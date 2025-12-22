import { useState } from "react";
import { submitReset } from "../../services/api/reset";

export function RequestResetForm() {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");

  async function submit(e) {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      await submitReset({
        amount: Number(amount),
        reason,
        organization_id: "TODO-org"
      });
      setStatus("Submitted!");
    } catch {
      setStatus("Error");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input 
        type="number"
        placeholder="Amount %"
        value={amount}
        onChange={e=>setAmount(e.target.value)}
        className="border p-2 w-full"
      />
      <input 
        placeholder="Reason"
        value={reason}
        onChange={e=>setReason(e.target.value)}
        className="border p-2 w-full"
      />
      <button className="bg-blue-600 text-white px-4 py-2" type="submit">
        Submit
      </button>
      <div>{status}</div>
    </form>
  );
}
