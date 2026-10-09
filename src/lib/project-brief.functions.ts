import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  services: z.array(z.string().max(100)).max(10),
  description: z.string().min(10).max(4000),
  stage: z.string().max(200),
  budget: z.string().max(200),
  timeline: z.string().max(200),
  preference: z.string().max(200),
  locale: z.enum(["en", "sv", "pl", "ru"]),
});

const LANG = { en: "English", sv: "Swedish", pl: "Polish", ru: "Russian" } as const;

export type BriefResult =
  | { ok: true; summary: string[]; nextStep: string }
  | { ok: false; error: string };

export const summarizeProjectBrief = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<BriefResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { ok: false, error: "AI is not configured." };

    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");

    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    const instructions = `You help Dzmitry Nikalayeu, an independent software & cloud engineer (web development, backend, cloud/DevOps, AI/LLM integration, technical consulting), triage incoming project requests.
Summarize the visitor's requirements and recommend ONE concrete next step (e.g. a free 30-min discovery call, a paid technical audit, a fixed-scope MVP estimate, hourly consulting, a B2B contract).
Reply in ${LANG[data.locale]}. Be concise, professional, no hype. Do not invent prices or promises.
Return ONLY JSON: {"summary": ["3-5 short bullet strings"], "nextStep": "1-2 sentences"}.`;

    const prompt = `Services: ${data.services.join(", ")}
Description: ${data.description}
Stage: ${data.stage}
Budget: ${data.budget || "not specified"}
Timeline: ${data.timeline}
Work preference: ${data.preference}`;

    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        system: instructions,
        prompt,
        maxRetries: 0,
        providerOptions: {
          openai: { store: false, forceReasoning: true, reasoningEffort: "low" },
        },
      });
      const text = await result.text;
      const match = text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(match ? match[0] : text) as { summary?: unknown; nextStep?: unknown };
      const summary = Array.isArray(parsed.summary) ? parsed.summary.map(String).slice(0, 6) : [];
      const nextStep = typeof parsed.nextStep === "string" ? parsed.nextStep : "";
      if (!summary.length || !nextStep) return { ok: false, error: "Could not generate a summary." };
      return { ok: true, summary, nextStep };
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 429) return { ok: false, error: "Too many requests — please try again in a minute." };
      if (status === 402 || status === 403) return { ok: false, error: "AI summary is temporarily unavailable." };
      console.error(e);
      return { ok: false, error: "Could not generate a summary." };
    }
  });
