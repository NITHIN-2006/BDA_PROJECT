// BlockFlightAnim.jsx
import { motion, AnimatePresence } from "framer-motion";

// nodePositions: { [nodeId]: { x, y } } — measured from DataNodeBox refs in ClusterView
export default function BlockFlightAnim({ blocks, nodePositions, originPos, onComplete }) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {blocks.flatMap((block) =>
        block.replicaNodeIds.map((nodeId, replicaIdx) => {
          const target = nodePositions[nodeId];
          if (!target) return null;

          return (
            <motion.div
              key={`${block.id}-${nodeId}`}
              initial={{ x: originPos.x, y: originPos.y, opacity: 1, scale: 1 }}
              animate={{ x: target.x, y: target.y, opacity: 0, scale: 0.4 }}
              transition={{
                duration: 0.8,
                delay: block.index * 0.15 + replicaIdx * 0.08,
                ease: "easeInOut",
              }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 h-5 w-5 rounded-sm bg-emerald-400 shadow-lg pointer-events-none z-50"
              style={{ translateX: -10, translateY: -10 }}
            />
          );
        })
      )}
    </AnimatePresence>
  );
}