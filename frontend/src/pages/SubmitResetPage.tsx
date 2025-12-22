import { RequestResetForm } from "../components/admin/RequestResetForm";

export default function SubmitResetPage() {
  return (
    <div className="p-6">
      <h1 className="font-bold text-xl mb-4">Submit Reset Request</h1>
      <RequestResetForm />
    </div>
  );
}
