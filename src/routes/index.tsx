import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectCard, TechChips } from "@/components/site/cards";
import { CtaBand } from "@/components/site/cta-band";
import { Eyebrow, Section, SectionHeading } from "@/components/site/primitives";
import { SitePage } from "@/components/site/site-layout";
import { contact, heroStack, portrait, projects, rates, services } from "@/content/site";
import { useI18n } from "@/i18n";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dzmitry Nikalayeu — Software & Cloud Engineer" },
      {
        name: "description",
        content:
          "Independent Software & Cloud Engineer helping businesses build, modernize and maintain reliable digital products: web apps, APIs, AWS infrastructure, DevOps and AI integrations.",
      },
      { property: "og:title", content: "Dzmitry Nikalayeu — Software & Cloud Engineer" },
      {
        property: "og:description",
        content: "Web, backend, cloud and AI engineering for businesses — one engineer from idea to production.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const featured = projects.slice(0, 3);

  return (
    <SitePage>
      {/* Hero */}
      <div className="relative border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-lines" aria-hidden />
        <div className="container-site relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="fade-up">
            <Eyebrow>{t.home.eyebrow}</Eyebrow>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
              {t.home.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t.home.lead}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link to="/contact" onClick={() => track("contact_started", { source: "hero" })}>
                  {t.cta.start} <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="quiet">
                <Link to="/portfolio">{t.cta.viewWork}</Link>
              </Button>
            </div>

            <div className="mt-12">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {t.home.stackLabel}
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {heroStack.map((s) => (
                  <li key={s} className="font-mono text-xs uppercase tracking-[0.08em] text-foreground/70">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <figure className="fade-up relative mx-auto w-full max-w-[20rem] lg:max-w-none">
            <div className="absolute -bottom-3 -right-3 hidden size-full border border-pine/30 lg:block" aria-hidden />
            <img
              src={portrait}
              alt={`${contact.name} — ${t.common.role}`}
              className="relative aspect-[4/5] w-full border border-border object-cover"
            />
            <figcaption className="mt-4 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <span>{contact.name}</span>
              <span>{t.common.role}</span>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Capability strip */}
      <div className="border-b border-border bg-surface">
        <ul className="container-site grid gap-y-3 py-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.pillars.map((p, i) => (
            <li key={p} className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-pine">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-sm text-foreground">{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Why work with me */}
      <Section>
        <SectionHeading eyebrow={t.home.diffEyebrow} title={t.home.diffTitle} lead={t.home.diffLead} />
        <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.diff.map((d) => (
            <div key={d.k} className="border-t border-border pt-4">
              <dt className="font-display text-base font-semibold tracking-tight">{d.k}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Services */}
      <Section className="bg-surface">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t.nav.services} title={t.home.servicesTitle} />
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-pine"
          >
            {t.home.allServices} <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const service = t.services.items[s.key];
            return (
              <li key={s.key} className="flex flex-col gap-3 bg-surface p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold tracking-tight">{service.title}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {s.code}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{service.desc}</p>
                <div className="mt-auto pt-2">
                  <TechChips items={s.tech} max={4} />
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Selected work */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t.nav.portfolio} title={t.home.workTitle} lead={t.home.workLead} />
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-pine"
          >
            {t.home.allProjects} <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.key} project={p} />
          ))}
        </div>
      </Section>

      {/* Rates */}
      <Section className="bg-surface">
        <SectionHeading eyebrow={t.nav.cooperation} title={t.home.ratesTitle} lead={t.home.ratesLead} />
        <ul className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {rates.map((r) => (
            <li key={r.currency} className="bg-surface p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{r.currency}</p>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{r.display}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {t.coop.perHour}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button asChild variant="quiet" size="lg">
            <Link to="/cooperation">{t.home.ratesCta}</Link>
          </Button>
        </div>
      </Section>

      <CtaBand title={t.coop.title} lead={t.coop.lead} primary={t.cta.start} source="home" />
    </SitePage>
  );
}
