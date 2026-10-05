import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Page-level section with a hairline rule and consistent vertical rhythm. */
export function Section({
  children,
  className,
  id,
  rule = true,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  rule?: boolean;
}) {
  return (
    <section id={id} className={cn(rule && "border-t border-border", "py-16 md:py-24", className)}>
      <div className="container-site">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{lead}</p>}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="container-site pb-12 pt-14 md:pb-16 md:pt-20">
      <div className="fade-up max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.06] tracking-tight text-balance md:text-5xl">
          {title}
        </h1>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lead}</p>}
        {children}
      </div>
    </header>
  );
}

/** Small monospaced chip used for technology and metadata labels. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
