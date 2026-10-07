import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Dzmitry Nikalayeu" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminOverview,
});

const STATUS_KEYS = ["new", "in_progress", "contacted", "qualified", "closed", "spam"] as const;

function AdminOverview() {
  const { t } = useI18n();

  const requestsQuery = useQuery({
    queryKey: ["admin", "requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tables<"contact_requests">[];
    },
  });

  const requests = requestsQuery.data ?? [];
  const counts = Object.fromEntries(
    STATUS_KEYS.map((s) => [s, requests.filter((r) => r.status === s).length]),
  ) as Record<(typeof STATUS_KEYS)[number], number>;
  const recent = requests.slice(0, 5);

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-semibold tracking-tight">{t.admin.overview}</h1>

      <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STATUS_KEYS.map((s) => (
          <div key={s} className="border border-border bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t.admin.statuses[s]}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{counts[s]}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold tracking-tight">{t.admin.recent}</h2>
        <Link
          to="/admin/messages"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-pine hover:underline"
        >
          {t.admin.viewAll} <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-border border border-border bg-surface">
        {requestsQuery.isLoading && (
          <p className="px-4 py-6 text-sm text-muted-foreground">{t.common.loading}</p>
        )}
        {!requestsQuery.isLoading && recent.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted-foreground">{t.admin.empty}</p>
        )}
        {recent.map((r) => (
          <Link
            key={r.id}
            to="/admin/messages"
            search={{ selected: r.id }}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-background"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {r.name} <span className="text-muted-foreground">· {r.email}</span>
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{r.project_description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-pine">
                {t.admin.statuses[r.status as (typeof STATUS_KEYS)[number]] ?? r.status}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
