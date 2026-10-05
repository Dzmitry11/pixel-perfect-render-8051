import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { CtaBand } from "@/components/site/cta-band";
import { PageHeader, Section, SectionHeading } from "@/components/site/primitives";
import { SitePage } from "@/components/site/site-layout";
import { rates } from "@/content/site";
import { useI18n } from "@/i18n";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/cooperation")({
  head: () => ({
    meta: [
      { title: "Cooperation & B2B Rates — Dzmitry Nikalayeu" },
      {
        name: "description",
        content:
          "B2B cooperation models: hourly, short-term projects, long-term development, ongoing technical support, cloud/DevOps consulting and full project development. Onsite in Poland and Sweden, remote worldwide.",
      },
      { property: "og:title", content: "Cooperation / B2B" },
      {
        property: "og:description",
        content: "Clear rates, clear scope, clear communication. Six ways to work together.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cooperation,
});

function Cooperation() {
  const { t } = useI18n();

  useEffect(() => {
    track("cooperation_view", { page: "cooperation" });
  }, []);

  return (
    <SitePage>
      <PageHeader eyebrow={t.coop.eyebrow} title={t.coop.title} lead={t.coop.lead} />

      <Section rule={false} className="pt-2">
        <div className="border border-border bg-surface p-6 md:p-8">
          <p className="eyebrow">{t.coop.rateLabel}</p>
          <ul className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {rates.map((r) => (
              <li key={r.currency} className="bg-surface p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {r.currency}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{r.display}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t.coop.perHour}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{t.coop.rateNote}</p>
        </div>
      </Section>

      <Section>
        <SectionHeading title={t.coop.modelsTitle} />
        <ul className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {t.coop.models.map((model, i) => (
            <li key={model.t} className="flex flex-col gap-3 bg-surface p-6">
              <span className="font-mono text-[10px] text-pine">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-lg font-semibold tracking-tight">{model.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{model.d}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <p className="border border-border bg-surface px-5 py-4 text-sm">{t.coop.onsite}</p>
          <p className="border border-border bg-surface px-5 py-4 text-sm">{t.coop.remote}</p>
        </div>
      </Section>

      <CtaBand title={t.cta.discuss} lead={t.contact.lead} primary={t.cta.start} source="cooperation" />
    </SitePage>
  );
}
