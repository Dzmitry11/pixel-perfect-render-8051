import { createFileRoute } from "@tanstack/react-router";

import { ServiceCard } from "@/components/site/cards";
import { CtaBand } from "@/components/site/cta-band";
import { PageHeader, Section } from "@/components/site/primitives";
import { SitePage } from "@/components/site/site-layout";
import { services } from "@/content/site";
import { useI18n } from "@/i18n";
import { track } from "@/lib/analytics";
import { useEffect } from "react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Web, Backend, Cloud & AI Engineering" },
      {
        name: "description",
        content:
          "Freelance engineering services: web development, backend and APIs, cloud & DevOps on AWS, AI/LLM integration and technical consulting. Scoped clearly, delivered end to end.",
      },
      { property: "og:title", content: "Engineering services for businesses" },
      {
        property: "og:description",
        content:
          "Web development, backend & APIs, cloud & DevOps, AI/LLM integration and technical consulting — from a landing page to a production platform on Kubernetes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

function Services() {
  const { t } = useI18n();

  useEffect(() => {
    track("service_view", { page: "services" });
  }, []);

  return (
    <SitePage>
      <PageHeader eyebrow={t.services.eyebrow} title={t.services.title} lead={t.services.lead} />
      <Section rule={false} className="pt-2">
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((s) => (
            <ServiceCard key={s.key} serviceKey={s.key} />
          ))}
        </div>
      </Section>
      <CtaBand title={t.cta.discuss} lead={t.coop.lead} primary={t.cta.start} source="services" />
    </SitePage>
  );
}
