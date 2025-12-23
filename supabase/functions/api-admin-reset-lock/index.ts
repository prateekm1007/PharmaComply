import { serve } from "https://deno.land/std/http/server.ts";
import { supabaseAdmin } from "../_shared/supabaseClient.ts";

serve(async (req) => {
  const auth = req.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "");

  const { data: user, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return new Response("unauthorized", { status: 401 });
  }

  const { reset_id } = await req.json();

  if (!reset_id) {
    return new Response("missing reset_id", { status: 400 });
  }

  await supabaseAdmin.rpc("cleanup_expired_reset_locks");

  await supabaseAdmin
    .from("reset_view_locks")
    .upsert({
      reset_id,
      admin_id: user.user.id,
      admin_email: user.user.email,
      expires_at: new Date(Date.now() + 5 * 60 * 1000)
    });

  const { data: viewers } = await supabaseAdmin
    .from("reset_view_locks")
    .select("admin_email")
    .eq("reset_id", reset_id);

  return new Response(JSON.stringify({ viewers }), {
    headers: { "Content-Type": "application/json" }
  });
});
