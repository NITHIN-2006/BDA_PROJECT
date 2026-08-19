// PigScriptPanel.jsx
import { useState } from "react";

const DEFAULT_SCRIPT = [
  "A = LOAD 'logs' AS (word:chararray);",
  "B = GROUP A BY word;",
  "C = FOREACH B GENERATE group, COUNT(A);",
].join("\n");

export default function PigScriptPanel({ blockCount, onRun }) {
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState(null);

  const handleRun = () => {
    setError(null);
    const lines = script.split("\n").filter(Boolean);
    const result = onRun(lines);
    setExplanation(result ?? null);
    if (!result) setError("Couldn't translate this script — try a GROUP...BY + COUNT example.");
  };

  return (
    <div className="rounded-2xl bg-slate-900 p-5 border border-slate-700">
      <h2 className="text-sm font-medium text-slate-300 mb-3">Pig Script</h2>

      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        rows={5}
        spellCheck={false}
        className="w-full bg-slate-800 text-slate-200 text-sm font-mono rounded-lg p-3 border border-slate-700 focus:border-pink-500 outline-none resize-none"
      />

      <button
        onClick={handleRun}
        disabled={blockCount === 0}
        className="mt-3 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:bg-slate-700 disabled:text-slate-500 px-4 py-2 text-sm font-medium text-white"
      >
        Run Script
      </button>

      {explanation && (
        <p className="mt-3 text-xs text-slate-400 border-l-2 border-pink-500/50 pl-2">
          {explanation}
        </p>
      )}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}