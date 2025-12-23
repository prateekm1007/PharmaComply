import { serve } from "https://deno.land/std/http/server.ts";
import { supabaseAdmin } from "../_shared/supabaseClient.ts";

serve(async () => {
  const { data, error } = await supabaseAdmin
    .from("approval_audit_log")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response("Error", { status: 500 });
  }

  const header = Object.keys(data[0] || {}).join(",");
  const rows = data.map((r) => Object.values(r).join(","));
  const csv = [header, ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=audit_log.csv",
    },
  });
});
