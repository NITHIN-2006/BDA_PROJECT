// DataNodeBox.jsx
export default function DataNodeBox({ node }) {
  const usedMB = node.usedMB();
  const pctUsed = Math.min(100, (usedMB / node.capacityMB) * 100);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-hairline bg-panel p-3 w-48 hover:border-cyan/50 transition-colors">
      <div className="flex items-center justify-between">
        <span className="font-display text-xs font-semibold text-slate-200">{node.id}</span>
        <span className="text-[10px] text-muted">{node.blocks.length} blocks</span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-hairline overflow-hidden">
        <div
          className="h-full bg-cyan transition-all duration-500"
          style={{ width: `${pctUsed}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-muted">{usedMB} / {node.capacityMB} MB</span>

      <div className="flex flex-wrap gap-1 mt-1">
        {node.blocks.map((blockId) => (
          <span key={blockId} title={blockId} className="h-3.5 w-3.5 rounded-sm bg-cyan/80" />
        ))}
      </div>
    </div>
  );
}