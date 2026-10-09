import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Sparkles } from "lucide-react";
import { summarizeProjectBrief } from "@/lib/project-brief.functions";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contact } from "@/content/site";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const STEPS = [
  "services",
  "description",
  "stage",
  "budget",
  "timeline",
  "preference",
  "details",
  "summary",
] as const;
type Step = (typeof STEPS)[number];

type Form = {
  services: string[];
  description: string;
  stage: string;
  budget: string;
  timeline: string;
  preference: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string; // honeypot — must stay empty
};

const EMPTY: Form = {
  services: [],
  description: "",
  stage: "",
  budget: "",
  timeline: "",
  preference: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
};

function Choice({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  columns?: 1 | 2;
}) {
  return (
    <div className={cn("grid gap-2", columns === 2 && "sm:grid-cols-2")}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={cn(
            "flex items-center gap-3 border px-4 py-3 text-left text-sm transition-colors",
            value === option
              ? "border-pine bg-pine-soft text-foreground"
              : "border-border bg-surface text-muted-foreground hover:border-foreground/30 hover:text-foreground",
          )}
        >
          <span
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full border",
              value === option ? "border-pine bg-pine" : "border-input",
            )}
            aria-hidden
          >
            {value === option && <Check className="size-2.5 text-primary-foreground" />}
          </span>
          {option}
        </button>
      ))}
    </div>
  );
}

export function ContactQuiz() {
  const { t, locale } = useI18n();
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [ai, setAi] = useState<{ summary: string[]; nextStep: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function runAi() {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await summarizeProjectBrief({
        data: {
          services: form.services,
          description: form.description.trim(),
          stage: form.stage,
          budget: form.budget,
          timeline: form.timeline,
          preference: form.preference,
          locale: locale as "en" | "sv" | "pl" | "ru",
        },
      });
      if (res.ok) setAi({ summary: res.summary, nextStep: res.nextStep });
      else setAiError(res.error);
    } catch {
      setAiError(t.quiz.errors.generic);
    } finally {
      setAiLoading(false);
    }
  }

  const step = STEPS[index];
  const total = STEPS.length;
  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  function validate(current: Step): string | null {
    switch (current) {
      case "services":
        return form.services.length === 0 ? t.quiz.errors.services : null;
      case "description":
        return form.description.trim().length < 10 ? t.quiz.errors.description : null;
      case "stage":
        return form.stage ? null : t.quiz.errors.choice;
      case "timeline":
        return form.timeline ? null : t.quiz.errors.choice;
      case "preference":
        return form.preference ? null : t.quiz.errors.choice;
      case "details": {
        if (!form.name.trim()) return t.quiz.errors.name;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) return t.quiz.errors.email;
        return null;
      }
      default:
        return null;
    }
  }

  function next() {
    if (!step) return;
    const problem = validate(step);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    track("contact_step_completed", { step, index });
    setIndex((i) => Math.min(i + 1, total - 1));
  }

  function back() {
    setError(null);
    setIndex((i) => Math.max(i - 1, 0));
  }

  function reset() {
    setForm(EMPTY);
    setIndex(0);
    setError(null);
    setDone(false);
  }

  async function submit() {
    if (form.website) {
      setDone(true);
      return;
    }
    setSending(true);
    const { error: insertError } = await supabase.from("contact_requests").insert({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      company: form.company.trim() || null,
      services: form.services,
      project_description: form.description.trim(),
      project_stage: form.stage,
      budget: form.budget || null,
      timeline: form.timeline,
      work_preference: form.preference,
      locale,
      status: "new",
    });
    setSending(false);

    if (insertError) {
      console.error(insertError);
      toast.error(t.quiz.errors.generic);
      setError(t.quiz.errors.generic);
      return;
    }

    track("contact_submitted", { locale, services: form.services.length });
    setDone(true);
  }

  if (done) {
    return (
      <div className="border border-border bg-surface p-8 md:p-12">
        <div className="text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-pine bg-pine-soft">
            <Check className="size-6 text-pine" />
          </span>
          <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight">{t.quiz.successTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{t.quiz.success}</p>
        </div>

        <div className="mx-auto mt-8 max-w-md border border-pine/40 bg-pine-soft px-5 py-4">
          <div className="flex items-center gap-4">
            <Clock className="size-5 shrink-0 text-pine" aria-hidden />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {t.quiz.responseLabel}
              </p>
              <p className="text-sm font-semibold text-foreground">{t.quiz.responseTime}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <p className="eyebrow">{t.quiz.nextTitle}</p>
          <ol className="mt-4 space-y-3">
            {t.quiz.nextSteps.map((s, i) => (
              <li key={s} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                <span
                  aria-hidden
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-[10px] text-muted-foreground"
                >
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>

        <p className="mx-auto mt-8 max-w-md border-t border-border pt-6 text-center text-sm text-muted-foreground">
          {t.contact.direct}{" "}
          <a href={`mailto:${contact.email}`} className="text-pine hover:underline">
            {contact.email}
          </a>
        </p>

        <div className="mt-6 text-center">
          <Button variant="quiet" size="lg" onClick={reset}>
            {t.quiz.another}
          </Button>
        </div>
      </div>
    );
  }

  const summaryRows: { label: string; value: string; step: Step }[] = [
    { label: t.quiz.q1, value: form.services.join(", "), step: "services" },
    { label: t.quiz.q2, value: form.description, step: "description" },
    { label: t.quiz.q3, value: form.stage, step: "stage" },
    { label: t.quiz.q4, value: form.budget || "—", step: "budget" },
    { label: t.quiz.q5, value: form.timeline, step: "timeline" },
    { label: t.quiz.q6, value: form.preference, step: "preference" },
    { label: t.quiz.name, value: form.name, step: "details" },
    { label: t.quiz.email, value: form.email, step: "details" },
    { label: t.quiz.phone, value: form.phone || "—", step: "details" },
    { label: t.quiz.company, value: form.company || "—", step: "details" },
  ];

  return (
    <div className="border border-border bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {t.quiz.step} {index + 1} {t.quiz.of} {total}
        </p>
        <div className="flex gap-1" aria-hidden>
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={cn("h-1 w-5 rounded-full transition-colors", i <= index ? "bg-pine" : "bg-border")}
            />
          ))}
        </div>
      </div>

      <div className="px-6 py-7 md:px-8">
        {step === "services" && (
          <fieldset>
            <legend className="font-display text-lg font-semibold tracking-tight">{t.quiz.q1}</legend>
            <p className="mt-1 text-sm text-muted-foreground">{t.quiz.q1hint}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {t.quiz.services.map((option) => {
                const on = form.services.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      set("services", on ? form.services.filter((s) => s !== option) : [...form.services, option])
                    }
                    className={cn(
                      "rounded-sm border px-3 py-2 text-sm transition-colors",
                      on
                        ? "border-pine bg-pine-soft text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === "description" && (
          <div>
            <Label htmlFor="project-description" className="font-display text-lg font-semibold tracking-tight">
              {t.quiz.q2}
            </Label>
            <Textarea
              id="project-description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder={t.quiz.q2placeholder}
              rows={6}
              className="mt-4"
            />
          </div>
        )}

        {step === "stage" && (
          <fieldset>
            <legend className="font-display text-lg font-semibold tracking-tight">{t.quiz.q3}</legend>
            <div className="mt-5">
              <Choice options={t.quiz.stages} value={form.stage} onChange={(v) => set("stage", v)} />
            </div>
          </fieldset>
        )}

        {step === "budget" && (
          <fieldset>
            <legend className="font-display text-lg font-semibold tracking-tight">{t.quiz.q4}</legend>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.quiz.q4hint} · {t.common.optional}
            </p>
            <div className="mt-5">
              <Choice
                options={t.quiz.budgets}
                value={form.budget}
                onChange={(v) => set("budget", v === form.budget ? "" : v)}
                columns={2}
              />
            </div>
          </fieldset>
        )}

        {step === "timeline" && (
          <fieldset>
            <legend className="font-display text-lg font-semibold tracking-tight">{t.quiz.q5}</legend>
            <div className="mt-5">
              <Choice options={t.quiz.timelines} value={form.timeline} onChange={(v) => set("timeline", v)} />
            </div>
          </fieldset>
        )}

        {step === "preference" && (
          <fieldset>
            <legend className="font-display text-lg font-semibold tracking-tight">{t.quiz.q6}</legend>
            <div className="mt-5">
              <Choice options={t.quiz.prefs} value={form.preference} onChange={(v) => set("preference", v)} columns={2} />
            </div>
          </fieldset>
        )}

        {step === "details" && (
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">{t.quiz.q7}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">{t.quiz.name}</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  autoComplete="name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">{t.quiz.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  autoComplete="email"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">
                  {t.quiz.phone} <span className="text-muted-foreground">({t.common.optional})</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  autoComplete="tel"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="company">
                  {t.quiz.company} <span className="text-muted-foreground">({t.common.optional})</span>
                </Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  autoComplete="organization"
                  className="mt-2"
                />
              </div>
            </div>
            {/* Honeypot: hidden from people, attractive to bots. */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
            />
          </div>
        )}

        {step === "summary" && (
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">{t.quiz.q8}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t.quiz.summary}
            </p>
            <dl className="mt-5 divide-y divide-border border border-border bg-background">
              {summaryRows.map((row) => (
                <div key={`${row.label}-${row.value}`} className="flex items-start gap-4 px-4 py-3">
                  <dt className="w-40 shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {row.label}
                  </dt>
                  <dd className="flex-1 text-sm leading-relaxed text-foreground">{row.value || "—"}</dd>
                  <button
                    type="button"
                    onClick={() => setIndex(STEPS.indexOf(row.step))}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-pine hover:underline"
                  >
                    {t.quiz.edit}
                  </button>
                </div>
              ))}
            </dl>

            <div className="mt-6 border border-pine/40 bg-pine-soft p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="eyebrow flex items-center gap-2">
                  <Sparkles className="size-3.5 text-pine" aria-hidden /> {t.quiz.aiTitle}
                </p>
                {!ai && (
                  <Button variant="quiet" onClick={runAi} disabled={aiLoading}>
                    {aiLoading ? t.quiz.aiLoading : t.quiz.aiButton}
                  </Button>
                )}
              </div>
              {aiError && <p className="mt-3 text-sm text-destructive">{aiError}</p>}
              {ai && (
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground">
                  <ul className="list-disc space-y-1 pl-5">
                    {ai.summary.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {t.quiz.aiNext}
                    </p>
                    <p className="mt-1 font-semibold">{ai.nextStep}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.quiz.aiNote}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-5 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
        <Button variant="ghost" onClick={back} disabled={index === 0}>
          <ArrowLeft className="size-4" /> {t.common.back}
        </Button>
        <div className="flex items-center gap-2">
          {step === "budget" && form.budget === "" && (
            <Button variant="ghost" onClick={next}>
              {t.quiz.skip}
            </Button>
          )}
          {step === "summary" ? (
            <Button variant="accent" size="lg" onClick={submit} disabled={sending}>
              {sending ? t.quiz.sending : t.quiz.send}
            </Button>
          ) : (
            <Button variant="accent" size="lg" onClick={next}>
              {t.common.next} <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
