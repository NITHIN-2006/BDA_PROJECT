// ShuffleSortView.jsx
import { motion } from "framer-motion";

export default function ShuffleSortView({ shuffled, active }) {
  const entries = Object.entries(shuffled);

  return (
    <div className="rounded-2xl bg-slate-900 p-5 border border-slate-700">
      <h3 className="text-sm font-medium text-slate-300 mb-3">
        Shuffle & Sort {active && <span className="text-amber-400">● running</span>}
      </h3>
      <p className="text-xs text-slate-500 mb-3">Grouping intermediate pairs by key</p>
      <div className="flex flex-wrap gap-2">
        {entries.map(([key, values], i) => (
          <motion.div
            key={key}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg bg-amber-500/10 border border-amber-500/40 px-3 py-2"
          >
            <span className="text-xs font-mono text-amber-300">{key}</span>
            <span className="text-[10px] text-slate-500 ml-2">[{values.join(", ")}]</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}