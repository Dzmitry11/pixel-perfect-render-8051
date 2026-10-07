import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

type Request = Tables<"contact_requests">;
type Note = Tables<"contact_request_notes">;

const STATUS_KEYS = ["new", "in_progress", "contacted", "qualified", "closed", "spam"] as const;
type Status = (typeof STATUS_KEYS)[number];

export const Route = createFileRoute("/admin/messages")({
  validateSearch: (search: Record<string, unknown>) => ({
    selected: typeof search["selected"] === "string" ? (search["selected"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Messages — Admin — Dzmitry Nikalayeu" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminMessages,
});

function AdminMessages() {
  const { t } = useI18n();
  const navigate = useNavigate({ from: "/admin/messages" });
  const { selected } = Route.useSearch();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [noteDraft, setNoteDraft] = useState("");

  const requestsQuery = useQuery({
    queryKey: ["admin", "requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Request[];
    },
  });

  const notesQuery = useQuery({
    queryKey: ["admin", "notes", selected],
    enabled: Boolean(selected),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_request_notes")
        .select("*")
        .eq("request_id", selected!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Note[];
    },
    placeholderData: (prev) => prev,
  });

  const requests = requestsQuery.data ?? [];

  const allServices = useMemo(
    () => Array.from(new Set(requests.flatMap((r) => r.services ?? []))).sort(),
    [requests],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = requests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (serviceFilter !== "all" && !(r.services ?? []).includes(serviceFilter)) return false;
      if (q) {
        const hay = `${r.name} ${r.email} ${r.company ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === "oldest") list = [...list].reverse();
    return list;
  }, [requests, search, statusFilter, serviceFilter, sort]);

  const current = requests.find((r) => r.id === selected) ?? null;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin"] });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("contact_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success(t.admin.saved);
    },
  });

  const noteMutation = useMutation({
    mutationFn: async ({ requestId, body }: { requestId: string; body: string }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const { error } = await supabase.from("contact_request_notes").insert({
        request_id: requestId,
        author_id: sessionData.session?.user.id ?? null,
        body,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNoteDraft("");
      invalidate();
      toast.success(t.admin.saved);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      navigate({ search: {} });
    },
  });

  const selectClass =
    "h-10 rounded-md border border-input bg-surface px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-semibold tracking-tight">{t.admin.messages}</h1>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.admin.search}
          className="w-full sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
          className={selectClass}
          aria-label={t.admin.allStatuses}
        >
          <option value="all">{t.admin.allStatuses}</option>
          {STATUS_KEYS.map((s) => (
            <option key={s} value={s}>
              {t.admin.statuses[s]}
            </option>
          ))}
        </select>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className={selectClass}
          aria-label={t.admin.allServices}
        >
          <option value="all">{t.admin.allServices}</option>
          {allServices.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          className={selectClass}
          aria-label={t.admin.newest}
        >
          <option value="newest">{t.admin.newest}</option>
          <option value="oldest">{t.admin.oldest}</option>
        </select>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="divide-y divide-border self-start border border-border bg-surface">
          {requestsQuery.isLoading && (
            <p className="px-4 py-6 text-sm text-muted-foreground">{t.common.loading}</p>
          )}
          {!requestsQuery.isLoading && requests.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground">{t.admin.empty}</p>
          )}
          {!requestsQuery.isLoading && requests.length > 0 && filtered.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground">{t.admin.noResults}</p>
          )}
          {filtered.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => navigate({ search: { selected: r.id } })}
              className={cn(
                "block w-full px-4 py-3 text-left transition-colors hover:bg-background",
                r.id === selected && "border-l-2 border-l-pine bg-background",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium text-foreground">{r.name}</p>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-pine">
                  {t.admin.statuses[r.status as Status] ?? r.status}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {r.email} · {new Date(r.created_at).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>

        <div className="self-start border border-border bg-surface p-6">
          {!current ? (
            <p className="text-sm text-muted-foreground">{t.admin.select}</p>
          ) : (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold tracking-tight">{current.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {current.email}
                    {current.phone ? ` · ${current.phone}` : ""}
                    {current.company ? ` · ${current.company}` : ""}
                  </p>
                </div>
                <select
                  value={current.status}
                  onChange={(e) => statusMutation.mutate({ id: current.id, status: e.target.value as Status })}
                  className={selectClass}
                  aria-label={t.admin.allStatuses}
                >
                  {STATUS_KEYS.map((s) => (
                    <option key={s} value={s}>
                      {t.admin.statuses[s]}
                    </option>
                  ))}
                </select>
              </div>

              <dl className="mt-6 grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{t.admin.date}</dt>
                  <dd className="mt-1">{new Date(current.created_at).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{t.admin.services}</dt>
                  <dd className="mt-1">{(current.services ?? []).join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{t.admin.stage}</dt>
                  <dd className="mt-1">{current.project_stage ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{t.admin.budget}</dt>
                  <dd className="mt-1">{current.budget ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{t.admin.timeline}</dt>
                  <dd className="mt-1">{current.timeline ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{t.admin.workPref}</dt>
                  <dd className="mt-1">{current.work_preference ?? "—"}</dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-border pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {t.admin.description}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {current.project_description}
                </p>
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {t.admin.notes}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{t.admin.notesPrivate}</p>
                <ul className="mt-4 space-y-3">
                  {(notesQuery.data ?? []).map((n) => (
                    <li key={n.id} className="border border-border bg-background px-3 py-2 text-sm">
                      <p className="whitespace-pre-wrap">{n.body}</p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </li>
                  ))}
                  {notesQuery.data?.length === 0 && (
                    <li className="text-sm text-muted-foreground">{t.admin.noNotes}</li>
                  )}
                </ul>
                <div className="mt-4 flex flex-col gap-2">
                  <Textarea
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder={t.admin.notePlaceholder}
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <Button
                      variant="quiet"
                      size="sm"
                      disabled={!noteDraft.trim() || noteMutation.isPending}
                      onClick={() => noteMutation.mutate({ requestId: current.id, body: noteDraft.trim() })}
                    >
                      {t.admin.addNote}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (window.confirm(t.admin.deleteConfirm)) deleteMutation.mutate(current.id);
                      }}
                    >
                      <Trash2 className="size-4" /> {t.admin.delete}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
