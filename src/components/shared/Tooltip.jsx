// Tooltip.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Tooltip({ content, children, side = "top" }) {
  const [show, setShow] = useState(false);

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 whitespace-nowrap rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-[11px] text-slate-200 shadow-lg pointer-events-none ${sideClasses[side]}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}