import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req: Request) => {
  const alert = await req.json();

  await fetch(
    `${Deno.env.get("BACKEND_URL")}/api/admin/fraud-webhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alert)
    }
  );

  return new Response(
    JSON.stringify({ ok: true }),
    { headers: { "Content-Type": "application/json" }}
  );
});
