import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

export const handler: Handler = async (event) => {
  try {
    const token = event.headers.cookie
      ?.split(";")
      .find((c) => c.trim().startsWith("sb-access-token="))
      ?.split("=")[1];

    if (!token) {
      return {
        statusCode: 401,
        body: "Unauthorized",
      };
    }

    // backend Supabase RPC call (server authority)
    const resp = await fetch(
      \`\${process.env.SUPABASE_URL}/rest/v1/rpc/get_approval_queue\`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: \`Bearer \${process.env.SUPABASE_SERVICE_ROLE_KEY!}\`,
        },
        body: JSON.stringify({
          p_limit: 50,
          p_offset: 0,
        }),
      }
    );

    const data = await resp.json();
    return {
      statusCode: resp.status,
      body: JSON.stringify(data),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: err?.message ?? "Unknown error",
    };
  }
};
