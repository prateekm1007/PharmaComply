export async function submitReset({ amount, reason, organization_id }) {
  const res = await fetch("/api/reset/submit", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, reason, organization_id })
  });

  if (!res.ok) throw new Error("Reset submit failed");
  return res.json();
}
