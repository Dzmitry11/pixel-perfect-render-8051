import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Tag } from "@/components/site/primitives";
import { contact, services, type Project, type ServiceKey } from "@/content/site";
import { useI18n } from "@/i18n";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function TechChips({ items, max }: { items: string[]; max?: number }) {
  const shown = max ? items.slice(0, max) : items;
  const rest = max ? items.length - shown.length : 0;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
      {rest > 0 && (
        <li>
          <Tag>+{rest}</Tag>
        </li>
      )}
    </ul>
  );
}

export function StatusBadge({ status, className }: { status: Project["status"]; className?: string }) {
  const { t } = useI18n();
  const dot =
    status === "production" ? "bg-pine" : status === "active" ? "bg-status-progress" : "bg-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot)} aria-hidden />
      {t.portfolio.statuses[status]}
    </span>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { t } = useI18n();
  const copy = t.portfolio.projects[project.key];

  return (
    <article className="group flex flex-col border border-border bg-surface transition-colors hover:border-foreground/30">
      <Link
        to="/portfolio/$slug"
        params={{ slug: project.key }}
        className="relative block overflow-hidden border-b border-border"
      >
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute left-3 top-3 bg-background/90 px-2 py-1">
          <StatusBadge status={project.status} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-pine">{copy.category}</p>
          <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">{project.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.desc}</p>
        </div>

        <TechChips items={project.tech} max={6} />

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link
            to="/portfolio/$slug"
            params={{ slug: project.key }}
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-pine"
          >
            {t.cta.caseStudy} <ArrowUpRight className="size-3.5" />
          </Link>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => track("project_link_clicked", { project: project.key, kind: "site" })}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-pine"
            >
              {t.cta.visit}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ServiceCard({ serviceKey }: { serviceKey: ServiceKey }) {
  const { t } = useI18n();
  const service = t.services.items[serviceKey];
  const entry = services.find((s) => s.key === serviceKey);

  return (
    <article className="flex flex-col gap-4 border border-border bg-surface p-6 transition-colors hover:border-foreground/30">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl font-semibold tracking-tight">{service.title}</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {entry?.code ?? serviceKey}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{service.desc}</p>
      <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
        {service.work.map((w) => (
          <li key={w} className="flex items-start gap-2 text-foreground">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-pine" aria-hidden />
            {w}
          </li>
        ))}
      </ul>
      {entry && <TechChips items={entry.tech} max={8} />}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
        <Link
          to="/contact"
          onClick={() => track("contact_started", { source: "service_card", service: serviceKey })}
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-pine"
        >
          {t.cta.discussShort} <ArrowUpRight className="size-3.5" />
        </Link>
        <a
          href={`mailto:${contact.email}?subject=${encodeURIComponent(service.title)}`}
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-pine"
        >
          {contact.email}
        </a>
      </div>
    </article>
  );
}
