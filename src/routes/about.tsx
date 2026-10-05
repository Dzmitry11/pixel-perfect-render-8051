import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { CtaBand } from "@/components/site/cta-band";
import { Eyebrow, Section, SectionHeading, Tag } from "@/components/site/primitives";
import { SitePage } from "@/components/site/site-layout";
import { contact, portrait } from "@/content/site";
import { useI18n } from "@/i18n";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dzmitry Nikalayeu, Software & Cloud Engineer" },
      {
        name: "description",
        content:
          "Dzmitry Nikalayeu is a software and cloud engineer building, deploying and maintaining production web platforms and AWS infrastructure. Independent, B2B, based in Poland and Sweden.",
      },
      { property: "og:title", content: "About Dzmitry Nikalayeu" },
      {
        property: "og:description",
        content:
          "Software & Cloud Engineer: production web platforms, AWS, DevOps, databases and AI-enabled applications. How I work, and the road here.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useI18n();

  return (
    <SitePage>
      <div className="container-site pb-10 pt-14 md:pt-20">
        <div className="fade-up max-w-3xl">
          <Eyebrow>{t.about.eyebrow}</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.06] tracking-tight text-balance md:text-5xl">
            {t.about.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t.about.lead}</p>
        </div>
      </div>

      {/* Portrait + biography */}
      <Section rule={false} className="pt-4">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <figure className="sticky top-24">
              <div className="relative">
                <div
                  className="absolute -bottom-3 -left-3 hidden size-full border border-pine/30 lg:block"
                  aria-hidden
                />
                <img
                  src={portrait}
                  alt={`${contact.name} — ${t.common.role}`}
                  className="relative aspect-[4/5] w-full border border-border object-cover"
                />
              </div>
              <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {contact.name} · {t.common.role}
              </figcaption>
            </figure>

            <div className="mt-8 space-y-5 border-t border-border pt-6 text-sm">
              <div>
                <p className="eyebrow">{t.contact.location}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {t.contact.locations.map((l) => (
                    <li key={l}>
                      <Tag>{l}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow">{t.contact.availability}</p>
                <ul className="mt-2 space-y-1.5 text-muted-foreground">
                  {t.contact.availabilityItems.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow">{t.footer.elsewhere}</p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 font-medium text-foreground hover:text-pine"
                    >
                      LinkedIn <ArrowUpRight className="size-3.5" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={contact.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 font-medium text-foreground hover:text-pine"
                    >
                      GitHub <ArrowUpRight className="size-3.5" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      onClick={() => track("contact_started", { source: "about_email" })}
                      className="font-medium text-foreground hover:text-pine"
                    >
                      {contact.email}
                    </a>
                  </li>
                  {contact.phones.map((p) => (
                    <li key={p.tel}>
                      <a href={`tel:${p.tel}`} className="text-muted-foreground hover:text-pine">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em]">{p.label}</span>{" "}
                        {p.display}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-5">
              {t.about.bio.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-foreground/85">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 border-t border-border pt-8">
              <SectionHeading title={t.about.howTitle} />
              <ol className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
                {t.about.how.map((step, i) => (
                  <li key={step.t} className="flex gap-4">
                    <span className="font-mono text-[10px] text-pine">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-display text-base font-semibold tracking-tight">{step.t}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section className="bg-surface">
        <SectionHeading title={t.about.timelineTitle} />
        <ol className="mt-10 border-l border-border">
          {t.about.timeline.map((item, i) => (
            <li key={item.t} className="relative pb-9 pl-8 last:pb-0">
              <span
                className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border border-pine bg-surface"
                aria-hidden
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-display text-lg font-semibold tracking-tight">{item.t}</p>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{item.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand title={t.cta.talk} lead={t.contact.lead} primary={t.cta.start} source="about" />
    </SitePage>
  );
}
