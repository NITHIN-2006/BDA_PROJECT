// MapPhaseView.jsx
import { motion } from "framer-motion";

export default function MapPhaseView({ mapOutputs, active }) {
  return (
    <div className="rounded-2xl bg-slate-900 p-5 border border-slate-700">
      <h3 className="text-sm font-medium text-slate-300 mb-3">
        Map Phase {active && <span className="text-sky-400">● running</span>}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {mapOutputs.map((task, i) => (
          <motion.div
            key={task.taskId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-lg bg-slate-800 border border-slate-700 p-3"
          >
            <p className="text-xs text-slate-400 mb-1">{task.blockId}</p>
            <div className="flex flex-wrap gap-1">
              {task.pairs.slice(0, 6).map(([k, v], idx) => (
                <span key={idx} className="text-[10px] bg-emerald-500/20 text-emerald-300 rounded px-1.5 py-0.5">
                  {k}:{v}
                </span>
              ))}
              {task.pairs.length > 6 && (
                <span className="text-[10px] text-slate-500">+{task.pairs.length - 6} more</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}