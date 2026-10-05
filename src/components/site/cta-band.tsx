import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { contact } from "@/content/site";
import { useI18n } from "@/i18n";
import { track } from "@/lib/analytics";

export function CtaBand({
  title,
  lead,
  primary,
  source = "cta_band",
}: {
  title?: string;
  lead?: string;
  primary?: string;
  source?: string;
}) {
  const { t } = useI18n();

  return (
    <section className="border-t border-border bg-ink">
      <div className="container-site flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-foreground md:text-3xl">
            {title ?? t.cta.talk}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-foreground/70">{lead ?? t.portfolio.similarLead}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" variant="accent">
            <Link to="/contact" onClick={() => track("contact_started", { source })}>
              {primary ?? t.cta.start}
            </Link>
          </Button>
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex h-11 items-center rounded-md border border-ink-foreground/25 px-6 text-[0.95rem] font-medium text-ink-foreground transition-colors hover:border-ink-foreground/60"
          >
            {contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
