import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const schema = z.object({
  visitorId: z.string().min(8).max(64),
  path: z.string().max(300),
  referrer: z.string().max(500).optional(),
});

function decode(v: string | null) {
  if (!v) return null;
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

export const recordVisit = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    if (data.path.startsWith("/admin")) return { ok: true };
    const req = getRequest();
    const h = req.headers;
    const cf = (req as unknown as { cf?: { country?: string; city?: string } }).cf;
    let country = cf?.country ?? h.get("cf-ipcountry");
    let city = cf?.city ?? decode(h.get("cf-ipcity"));
    if (country === "XX" || country === "T1") country = null;

    if (!country || !city) {
      const ip = (h.get("cf-connecting-ip") ?? h.get("x-forwarded-for") ?? "").split(",")[0]?.trim();
      if (ip) {
        try {
          const r = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country_code,city`);
          const j = (await r.json()) as { success?: boolean; country_code?: string; city?: string };
          if (j.success) {
            country = country ?? j.country_code ?? null;
            city = city ?? j.city ?? null;
          }
        } catch {
          /* ignore */
        }
      }
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("page_visits").insert({
      visitor_id: data.visitorId,
      path: data.path,
      referrer: data.referrer ?? null,
      country: country ?? null,
      city: city ?? null,
    });
    return { ok: true };
  });
