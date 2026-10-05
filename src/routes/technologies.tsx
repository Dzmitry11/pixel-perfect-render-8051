import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { CtaBand } from "@/components/site/cta-band";
import { PageHeader, Section, SectionHeading } from "@/components/site/primitives";
import { SitePage } from "@/components/site/site-layout";
import { technologies, type Level } from "@/content/site";
import { useI18n } from "@/i18n";

const LEVEL_ORDER: Level[] = ["production", "handsOn", "working", "dev"];

function levelClasses(level: Level) {
  switch (level) {
    case "production":
      return "border-pine/50 bg-pine-soft text-pine";
    case "handsOn":
      return "border-border bg-background text-foreground";
    case "working":
      return "border-dashed border-border bg-background text-muted-foreground";
    default:
      return "border-dashed border-border bg-background text-muted-foreground";
  }
}

export const Route = createFileRoute("/technologies")({
  head: () => ({
    meta: [
      { title: "Technologies & Tools — Dzmitry Nikalayeu" },
      {
        name: "description",
        content:
          "The stack Dzmitry Nikalayeu builds and operates with: AWS, Terraform, Kubernetes, Docker, Java, Python, React, TypeScript, PostgreSQL and AI tooling — grouped by where each fits in a system.",
      },
      { property: "og:title", content: "Technologies & Tools" },
      {
        property: "og:description",
        content: "Cloud, infrastructure, CI/CD, backend, frontend, databases, messaging, AI and networking tools.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Technologies,
});

function Technologies() {
  const { t } = useI18n();

  useEffect(() => {
    track("service_view", { page: "technologies" });
  }, []);

  return (
    <SitePage>
      <PageHeader eyebrow={t.tech.eyebrow} title={t.tech.title} lead={t.tech.lead} />

      <Section rule={false} className="pt-2">
        <ul className="flex flex-wrap gap-2 border border-border bg-surface p-4">
          {LEVEL_ORDER.map((level) => (
            <li key={level}>
              <span
                className={`inline-flex items-center rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${levelClasses(level)}`}
              >
                {t.tech.levels[level]}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {technologies.map((category) => {
        const items = category.items.filter((item) => item.enabled !== false);
        if (items.length === 0) return null;
        return (
          <Section key={category.category} className="py-12 md:py-16">
            <SectionHeading title={t.tech.categories[category.category]} />
            <ul className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.name} className="flex flex-col gap-3 bg-surface p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-display text-base font-semibold tracking-tight">{item.name}</p>
                    <span
                      className={`shrink-0 rounded-sm border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] ${levelClasses(item.level)}`}
                    >
                      {t.tech.levels[item.level]}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}

      <CtaBand title={t.cta.discuss} lead={t.coop.lead} primary={t.cta.start} source="technologies" />
    </SitePage>
  );
}

import { track } from "@/lib/analytics";
