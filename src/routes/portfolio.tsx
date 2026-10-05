import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ProjectCard } from "@/components/site/cards";
import { CtaBand } from "@/components/site/cta-band";
import { PageHeader, Section } from "@/components/site/primitives";
import { SitePage } from "@/components/site/site-layout";
import { projects, type ProjectFilter } from "@/content/site";
import { useI18n } from "@/i18n";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "web", "backend", "cloud", "ai", "production"] as const;
type Filter = (typeof FILTERS)[number];

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Production Platforms & Case Studies" },
      {
        name: "description",
        content:
          "Selected engineering work: DinLIA production SaaS platform, OriolePartner, iPDiary and the Scania internal AI assistant — with the technology and architecture behind each.",
      },
      { property: "og:title", content: "Portfolio — Projects & case studies" },
      {
        property: "og:description",
        content:
          "Real platforms and real engineering work. Each project lists what was built and the technology behind it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    track("portfolio_project_view", { page: "portfolio", filter });
  }, [filter]);

  const list = filter === "all" ? projects : projects.filter((p) => p.filters.includes(filter));

  return (
    <SitePage>
      <PageHeader eyebrow={t.portfolio.eyebrow} title={t.portfolio.title} lead={t.portfolio.lead} />

      <Section rule={false} className="pt-2">
        <div className="flex flex-wrap gap-2" role="group" aria-label={t.portfolio.eyebrow}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={f === filter}
              className={cn(
                "rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors",
                f === filter
                  ? "border-pine bg-pine-soft text-pine"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {t.portfolio.filters[f]}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="mt-12 border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            {t.portfolio.empty}
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <ProjectCard key={p.key} project={p} />
            ))}
          </div>
        )}
      </Section>

      <CtaBand title={t.portfolio.similarTitle} lead={t.portfolio.similarLead} primary={t.cta.start} source="portfolio" />
    </SitePage>
  );
}
