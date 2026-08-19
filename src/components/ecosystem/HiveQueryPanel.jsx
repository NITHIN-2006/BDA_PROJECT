// HiveQueryPanel.jsx
import { useState } from "react";

export default function HiveQueryPanel({ blockCount, onRun }) {
  const [query, setQuery] = useState("SELECT word, COUNT(*) FROM logs GROUP BY word");
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState(null);

  const handleRun = () => {
    setError(null);
    const result = onRun(query);
    setExplanation(result ?? null);
    if (!result) setError("Couldn't translate this query — try a COUNT(*)/GROUP BY or AVG() example.");
  };

  return (
    <div className="rounded-2xl bg-slate-900 p-5 border border-slate-700">
      <h2 className="text-sm font-medium text-slate-300 mb-3">Hive Query</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={3}
        spellCheck={false}
        className="w-full bg-slate-800 text-slate-200 text-sm font-mono rounded-lg p-3 border border-slate-700 focus:border-orange-500 outline-none resize-none"
      />
      <button
        onClick={handleRun}
        disabled={blockCount === 0}
        className="mt-3 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 px-4 py-2 text-sm font-medium text-white"
      >
        Run Query
      </button>
      {explanation && <p className="mt-3 text-xs text-slate-400 border-l-2 border-orange-500/50 pl-2">{explanation}</p>}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}