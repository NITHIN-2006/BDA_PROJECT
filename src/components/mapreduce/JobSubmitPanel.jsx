// JobSubmitPanel.jsx
export default function JobSubmitPanel({ blockCount, onSubmit, phase }) {
  const submitting = phase !== "idle" && phase !== "done";

  return (
    <div className="rounded-2xl bg-slate-900 p-5 border border-slate-700 flex items-center justify-between">
      <div>
        <label className="text-xs text-slate-400 block mb-1">Job</label>
        <p className="text-sm text-slate-200">Word Count</p>
        <p className="text-xs text-slate-500 mt-1">
          {blockCount} input blocks available
        </p>
      </div>
      <button
        onClick={onSubmit}
        disabled={submitting || blockCount === 0}
        className="rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 px-4 py-2 text-sm font-medium text-white transition-colors"
      >
        {submitting ? "Running..." : "Submit Job"}
      </button>
    </div>
  );
}