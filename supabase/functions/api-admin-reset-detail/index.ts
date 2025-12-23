import { serve } from "https://deno.land/std/http/server.ts";
import { supabaseAdmin } from "../_shared/supabaseClient.ts";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const reset_request_id = url.searchParams.get("reset_request_id");

    if (!reset_request_id) {
      return new Response(JSON.stringify({ error: "missing reset_request_id" }), {
        status: 400,
      });
    }

    // authenticate
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");

    const { data: user, error: authErr } =
      await supabaseAdmin.auth.getUser(token);

    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
      });
    }

    // require admin role
    // assuming role stored in auth metadata
    const role = user.user?.app_metadata?.role;
    if (!["admin", "super_admin"].includes(role)) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403,
      });
    }

    const { data, error } = await supabaseAdmin.rpc(
      "get_approval_queue", // returns multiple, so filter manually
    );

    if (error) throw error;

    const item = data.find((x: any) => x.reset_request_id === reset_request_id);

    if (!item) {
      return new Response(JSON.stringify({ error: "not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "server_error", detail: String(err) }), {
      status: 500,
    });
  }
});
