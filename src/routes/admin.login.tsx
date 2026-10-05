import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Dzmitry Nikalayeu" },
      { name: "description", content: "Restricted admin sign-in for the site owner." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        if (!cancelled) setCheckingExisting(false);
        return;
      }
      const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      if (!cancelled) {
        if (!roleError && isAdmin) {
          router.navigate({ to: "/admin" });
        } else {
          setCheckingExisting(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !data.session) {
        setError(true);
        return;
      }
      try {
        await supabase.rpc("claim_owner_admin");
      } catch {
        // ignore — not the owner or already claimed
      }
      router.navigate({ to: "/admin" });
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingExisting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="border border-border bg-surface p-8">
          <p className="eyebrow">{t.admin.title}</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">{t.admin.loginTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.admin.loginLead}</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t.admin.email}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{t.admin.password}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{t.admin.invalid}</p> : null}
            <Button type="submit" variant="accent" className="w-full" disabled={submitting}>
              {submitting ? t.admin.signingIn : t.admin.login}
            </Button>
          </form>
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
            ← Home
          </Link>
        </div>
      </div>
    </div>
  );
}
