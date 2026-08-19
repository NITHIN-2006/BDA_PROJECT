// ResourceManagerView.jsx
import { useState } from "react";
import { motion } from "framer-motion";

export default function ResourceManagerView({ resourceManager, onAllocate }) {
  const [containerCount, setContainerCount] = useState(4);
  const [appId] = useState(`app-${Date.now()}`);
  const [submitting, setSubmitting] = useState(false);

  const handleRequest = () => {
    setSubmitting(true);
    const allocated = resourceManager.requestContainers(appId, containerCount);
    onAllocate(allocated); // parent passes these to ContainerAllocationAnim
    setSubmitting(false);
  };

  return (
    <div className="rounded-2xl bg-slate-900 p-5 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-slate-300">ResourceManager</h2>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={20}
            value={containerCount}
            onChange={(e) => setContainerCount(Number(e.target.value))}
            className="w-14 bg-slate-800 text-slate-200 text-xs rounded px-2 py-1 border border-slate-700"
          />
          <button
            onClick={handleRequest}
            disabled={submitting}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 px-3 py-1.5 text-xs font-medium text-white"
          >
            Request Containers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {resourceManager.nodeManagers.map((nm) => {
          const vcorePct = (nm.usedVCores / nm.totalVCores) * 100;
          const memPct = (nm.usedMemoryMB / nm.totalMemoryMB) * 100;

          return (
            <div key={nm.id} className="rounded-lg bg-slate-800 border border-slate-700 p-3">
              <p className="text-xs font-semibold text-slate-300 mb-2">{nm.id}</p>

              <p className="text-[10px] text-slate-500 mb-0.5">
                vCores {nm.usedVCores}/{nm.totalVCores}
              </p>
              <div className="h-1.5 w-full rounded-full bg-slate-700 overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-violet-500"
                  animate={{ width: `${vcorePct}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <p className="text-[10px] text-slate-500 mb-0.5">
                Mem {nm.usedMemoryMB}/{nm.totalMemoryMB}MB
              </p>
              <div className="h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
                <motion.div
                  className="h-full bg-sky-500"
                  animate={{ width: `${memPct}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {nm.containers.map((c) => (
                  <span
                    key={c.id}
                    title={c.id}
                    className="h-3 w-3 rounded-sm bg-violet-400/80"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}