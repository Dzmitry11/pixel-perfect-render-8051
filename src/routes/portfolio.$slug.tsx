import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { StatusBadge, TechChips } from "@/components/site/cards";
import { CtaBand } from "@/components/site/cta-band";
import { Eyebrow, Section } from "@/components/site/primitives";
import { SitePage } from "@/components/site/site-layout";
import { projects } from "@/content/site";
import { useI18n } from "@/i18n";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/portfolio/$slug")({
  head: ({ params }) => {
    const project = projects.find((p) => p.key === params.slug);
    const title = project ? `${project.name} — Case Study` : "Project case study";
    const description = project
      ? `${project.name}: ${project.tech.join(", ")} — engineering case study by Dzmitry Nikalayeu.`
      : "Engineering case studies by Dzmitry Nikalayeu.";
    return {
      meta: [
        { title: `${title} · Dzmitry Nikalayeu` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: ({ params }) => {
    const project = projects.find((p) => p.key === params.slug);
    if (!project) throw notFound();
    return project;
  },
  component: ProjectCase,
});

function ProjectCase() {
  const { t } = useI18n();
  const { slug } = Route.useParams();
  const project = projects.find((p) => p.key === slug);
  if (!project) return null;
  const copy = t.portfolio.projects[project.key];

  useEffect(() => {
    track("portfolio_project_view", { project: project.key });
  }, [project.key]);

  return (
    <SitePage>
      <div className="container-site pt-10">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-pine"
        >
          <ArrowLeft className="size-3.5" /> {t.common.back}
        </Link>
      </div>

      <div className="container-site grid items-end gap-8 pb-10 pt-8 md:grid-cols-[1.3fr_0.7fr] md:pb-14">
        <div className="fade-up">
          <Eyebrow>{copy.category}</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-5xl">
            {project.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{copy.desc}</p>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <StatusBadge status={project.status} />
          <div className="flex flex-wrap gap-3">
            {project.url ? (
              <Button asChild size="lg" variant="accent">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => track("project_link_clicked", { project: project.key, kind: "site" })}
                >
                  {t.cta.visit} <ArrowUpRight className="size-4" />
                </a>
              </Button>
            ) : (
              <span className="inline-flex h-11 items-center rounded-md border border-dashed border-border px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {t.cta.linkSoon}
              </span>
            )}
            {project.github && (
              <Button asChild size="lg" variant="quiet">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => track("project_link_clicked", { project: project.key, kind: "github" })}
                >
                  <Github className="size-4" /> {t.cta.github}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="border-y border-border">
        <img
          src={project.image}
          alt={project.name}
          className="aspect-[21/9] w-full object-cover md:aspect-[3/1]"
        />
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-20">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">{t.common.keyFeatures}</h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/85">{copy.long}</p>

            {project.highlights && project.highlights.length > 0 && (
              <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 border-t border-border pt-3 text-sm">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-pine" aria-hidden />
                    <span className="text-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="eyebrow">{t.common.technologies}</h2>
            <div className="mt-4">
              <TechChips items={project.tech} />
            </div>
            <div className="mt-8 border-t border-border pt-6">
              <p className="eyebrow">{t.common.status}</p>
              <div className="mt-3">
                <StatusBadge status={project.status} />
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <CtaBand title={t.portfolio.similarTitle} lead={t.portfolio.similarLead} primary={t.cta.start} source={`project:${project.key}`} />
    </SitePage>
  );
}
