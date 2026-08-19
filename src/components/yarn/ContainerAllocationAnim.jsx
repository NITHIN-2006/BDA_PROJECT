// ContainerAllocationAnim.jsx
import { motion, AnimatePresence } from "framer-motion";

// nmPositions: { [nodeManagerId]: { x, y } } — measured from NM boxes, same pattern as BlockFlightAnim
export default function ContainerAllocationAnim({ containers, nmPositions, originPos, onComplete }) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {containers.map((container, i) => {
        const target = nmPositions[container.nodeId];
        if (!target) return null;

        return (
          <motion.div
            key={container.id}
            initial={{ x: originPos.x, y: originPos.y, opacity: 1, scale: 1, rotate: 0 }}
            animate={{ x: target.x, y: target.y, opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 h-4 w-4 rounded-sm bg-violet-400 shadow-md pointer-events-none z-50"
            style={{ translateX: -8, translateY: -8 }}
          />
        );
      })}
    </AnimatePresence>
  );
}