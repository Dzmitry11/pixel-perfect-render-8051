import { Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LOCALES, useI18n, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

function useAdminSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const isAdminQuery = useQuery({
    queryKey: ["admin", "has-role", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      if (error) return false;
      return Boolean(data);
    },
    enabled: session !== undefined,
  });

  return {
    session,
    checking: session === undefined || (session !== null && isAdminQuery.isLoading),
    isAdmin: Boolean(isAdminQuery.data),
  };
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const { session, checking, isAdmin } = useAdminSession();

  useEffect(() => {
    if (!checking && !session) {
      router.navigate({ to: "/admin/login" });
    }
  }, [checking, session, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/admin/login" });
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{t.common.loading}</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm border border-border bg-surface p-8 text-center">
          <p className="text-sm text-foreground">{t.admin.notAdmin}</p>
          <Button className="mt-6" variant="quiet" onClick={signOut}>
            {t.admin.signOut}
          </Button>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: "/admin" as const, label: t.admin.overview },
    { to: "/admin/messages" as const, label: t.admin.messages },
    { to: "/admin/settings" as const, label: t.admin.settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container-site flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link to="/admin" className="font-display text-sm font-semibold tracking-tight">
              {t.admin.title}
            </Link>
            <nav className="flex items-center gap-5">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/admin" }}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                  activeProps={{ className: "text-pine" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {LOCALES.map((l: Locale) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={cn(
                    "px-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground",
                    locale === l && "text-pine",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <Button variant="quiet" size="sm" onClick={signOut}>
              {t.admin.signOut}
            </Button>
          </div>
        </div>
      </header>
      <main className="container-site py-10">{children}</main>
    </div>
  );
}
