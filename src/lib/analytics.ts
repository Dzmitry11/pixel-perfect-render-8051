// Provider-agnostic analytics. No tracking is sent by default.
// To add Plausible / GA later, register a sink: registerAnalyticsSink((e, p) => window.plausible?.(e, { props: p }))
export type AnalyticsEvent =
  | "portfolio_project_view"
  | "service_view"
  | "cooperation_view"
  | "contact_started"
  | "contact_step_completed"
  | "contact_submitted"
  | "language_changed"
  | "project_link_clicked";

type Props = Record<string, string | number | boolean | undefined>;
type Sink = (event: AnalyticsEvent, props?: Props) => void;

const sinks: Sink[] = [];

export function registerAnalyticsSink(sink: Sink) {
  sinks.push(sink);
}

export function track(event: AnalyticsEvent, props?: Props) {
  if (typeof window === "undefined") return;
  if (import.meta.env.DEV) console.debug("[analytics]", event, props ?? {});
  for (const s of sinks) {
    try { s(event, props); } catch { /* never break the UI */ }
  }
}
