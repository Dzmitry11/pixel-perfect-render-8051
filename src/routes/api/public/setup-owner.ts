import { createFileRoute } from "@tanstack/react-router";

// TEMPORARY one-time owner bootstrap. Removed right after use.
export const Route = createFileRoute("/api/public/setup-owner")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { password?: string };
        if (!body.password) return new Response("bad", { status: 400 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: list } = await supabaseAdmin.auth.admin.listUsers();
        if ((list?.users ?? []).length > 0) return new Response("exists", { status: 409 });
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: "dzmitry.softdev@gmail.com",
          password: body.password,
          email_confirm: true,
        });
        if (error || !data.user) return new Response(error?.message ?? "err", { status: 500 });
        await supabaseAdmin.from("user_roles").insert({ user_id: data.user.id, role: "admin" });
        return new Response("ok");
      },
    },
  },
});
