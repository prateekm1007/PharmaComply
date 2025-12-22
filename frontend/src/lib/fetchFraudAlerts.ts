export async function fetchFraudAlerts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/api-admin-fraud-metrics`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Fraud metrics fetch failed");
  return res.json();
}
