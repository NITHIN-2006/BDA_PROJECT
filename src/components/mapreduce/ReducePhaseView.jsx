// ReducePhaseView.jsx
import { motion } from "framer-motion";

export default function ReducePhaseView({ results, active }) {
  const entries = Object.entries(results).sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-2xl bg-slate-900 p-5 border border-slate-700">
      <h3 className="text-sm font-medium text-slate-300 mb-3">
        Reduce Phase {active && <span className="text-emerald-400">● running</span>}
      </h3>
      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
        {entries.map(([key, value], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between rounded-md bg-slate-800 px-3 py-1.5"
          >
            <span className="text-xs font-mono text-slate-300">{key}</span>
            <span className="text-xs font-semibold text-emerald-400">{value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}