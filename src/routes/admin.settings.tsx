import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Admin — Dzmitry Nikalayeu" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSettings,
});

function AdminSettings() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/admin/login" });
  };

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-semibold tracking-tight">{t.admin.settings}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t.admin.settingsLead}</p>

      <div className="mt-8 max-w-lg space-y-6">
        <div className="border border-border bg-surface p-6">
          <p className="eyebrow">{t.admin.account}</p>
          <p className="mt-3 text-sm text-foreground">{email ?? "—"}</p>
          <Button variant="quiet" className="mt-5" onClick={signOut}>
            {t.admin.signOut}
          </Button>
        </div>

        <div className="border border-border bg-surface p-6">
          <p className="eyebrow">{t.admin.emailNotify}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.admin.emailNotifyText}</p>
        </div>
      </div>
    </AdminShell>
  );
}
