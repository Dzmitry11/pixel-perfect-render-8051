import { createFileRoute } from "@tanstack/react-router";

import { ContactQuiz } from "@/components/site/contact-quiz";
import { PageHeader, Section } from "@/components/site/primitives";
import { SitePage } from "@/components/site/site-layout";
import { contact } from "@/content/site";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dzmitry Nikalayeu" },
      {
        name: "description",
        content:
          "Start a project with Dzmitry Nikalayeu: a short questionnaire about your web, backend, cloud or AI project, plus direct email and phone contact.",
      },
      { property: "og:title", content: "Contact — Dzmitry Nikalayeu" },
      {
        property: "og:description",
        content:
          "Tell me about your project in two minutes — web development, backend, cloud/DevOps or AI integration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();

  return (
    <SitePage>
      <PageHeader eyebrow={t.contact.eyebrow} title={t.contact.title} lead={t.contact.lead} />

      <Section className="pt-0">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <ContactQuiz />

          <aside className="space-y-8">
            <div>
              <p className="eyebrow">{t.contact.direct}</p>
              <ul className="mt-4 space-y-4 text-sm">
                <li>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {t.contact.email}
                  </p>
                  <a href={`mailto:${contact.email}`} className="mt-1 block text-foreground hover:text-pine">
                    {contact.email}
                  </a>
                </li>
                <li>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {t.contact.phone}
                  </p>
                  {contact.phones.map((p) => (
                    <a key={p.tel} href={`tel:${p.tel}`} className="mt-1 block text-foreground hover:text-pine">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {p.label}
                      </span>{" "}
                      {p.display}
                    </a>
                  ))}
                </li>
                <li>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {t.contact.location}
                  </p>
                  <p className="mt-1 text-foreground">{t.contact.locations.join(" · ")}</p>
                </li>
                <li>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {t.contact.availability}
                  </p>
                  <ul className="mt-1 space-y-1 text-foreground">
                    {t.contact.availabilityItems.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Section>
    </SitePage>
  );
}
