export function ExportEvidenceButton() {
  const handle = () => {
    window.location.href="/api/admin/export/evidence.zip";
  };

  return (
    <button
      onClick={handle}
      className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
    >
      Export Evidence Bundle
    </button>
  );
}
