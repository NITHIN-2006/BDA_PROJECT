// Node.jsx
import { motion } from "framer-motion";

const VARIANT_STYLES = {
  default: "border-slate-700 bg-slate-800/60 hover:border-sky-500",
  active: "border-sky-500 bg-sky-500/10",
  warning: "border-amber-500 bg-amber-500/10",
  danger: "border-red-500 bg-red-500/10",
  success: "border-emerald-500 bg-emerald-500/10",
};

export default function Node({
  id,
  label,
  sublabel,
  variant = "default",
  pulse = false,
  children,
  onClick,
  className = "",
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={onClick ? { scale: 1.03 } : undefined}
      onClick={onClick}
      className={`relative flex flex-col gap-1 rounded-xl border p-3 transition-colors
        ${VARIANT_STYLES[variant]} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {pulse && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-200">{label ?? id}</span>
        {sublabel && <span className="text-xs text-slate-400">{sublabel}</span>}
      </div>

      {children}
    </motion.div>
  );
}