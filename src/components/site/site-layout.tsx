import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { contact, navigation } from "@/content/site";
import { LOCALES, useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

function LanguageSwitch({ className }: { className?: string }) {
  const { t, locale, setLocale } = useI18n();
  return (
    <div className={cn("flex items-center gap-1", className)} role="group" aria-label={t.nav.language}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={l === locale}
          className={cn(
            "px-1.5 py-1 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors",
            l === locale ? "text-pine underline underline-offset-4" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-pine/40 bg-pine-soft font-mono text-xs font-semibold text-pine">
            DN
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-[0.95rem] font-semibold tracking-tight">{contact.name}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t.common.role}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t.nav.menu}>
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground",
                isActive(item.to) ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch className="hidden md:flex" />
          <Button asChild size="lg" variant="accent" className="hidden md:inline-flex">
            <Link to="/contact">{t.cta.start}</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface lg:hidden">
          <nav className="container-site flex flex-col py-3" aria-label={t.nav.menu}>
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-border/60 py-3 text-sm last:border-0",
                  isActive(item.to) ? "text-pine" : "text-foreground",
                )}
              >
                {t.nav[item.key]}
              </Link>
            ))}
            <div className="flex items-center justify-between py-4">
              <LanguageSwitch />
              <Button asChild size="lg" variant="accent">
                <Link to="/contact" onClick={() => setOpen(false)}>
                  {t.cta.start}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight">{contact.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{t.common.positioning}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-foreground hover:text-pine"
            >
              LinkedIn <ArrowUpRight className="size-3.5" />
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-foreground hover:text-pine"
            >
              GitHub <ArrowUpRight className="size-3.5" />
            </a>
            <a href={`mailto:${contact.email}`} className="text-foreground hover:text-pine">
              {contact.email}
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow">{t.footer.navigate}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {navigation.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-muted-foreground hover:text-foreground">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">{t.footer.availability}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {t.footer.availabilityItems.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <ul className="mt-5 space-y-1 text-sm">
            {contact.phones.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`} className="text-foreground hover:text-pine">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {p.label}
                  </span>{" "}
                  {p.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground">
          <span>
            © {year} {contact.name}. {t.footer.rights}
          </span>
          <span className="font-mono uppercase tracking-[0.14em]">PL · SE · Remote</span>
        </div>
      </div>
    </footer>
  );
}

export function SitePage({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-3 focus:py-2 focus:text-sm"
      >
        {t.nav.skip}
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
