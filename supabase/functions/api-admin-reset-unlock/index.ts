import { serve } from "https://deno.land/std/http/server.ts";
import { supabaseAdmin } from "../_shared/supabaseClient.ts";

serve(async (req) => {
  const auth = req.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "");

  const { data: user } = await supabaseAdmin.auth.getUser(token);
  if (!user) return new Response("unauthorized", { status: 401 });

  const { reset_id } = await req.json();
  if (!reset_id) return new Response("missing reset_id", { status: 400 });

  await supabaseAdmin
    .from("reset_view_locks")
    .delete()
    .eq("reset_id", reset_id)
    .eq("admin_id", user.user.id);

  return new Response(JSON.stringify({ released: true }));
});
