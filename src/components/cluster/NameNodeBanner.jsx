// NameNodeBanner.jsx
export default function NameNodeBanner({ nameNode }) {
  const files = Object.entries(nameNode.fsImage);
  const totalBlocks = Object.keys(nameNode.blockMap).length;

  return (
    <div className="rounded-lg bg-panel border border-hairline p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-sm font-semibold text-white">NAMENODE</h1>
          <p className="text-xs text-muted mt-0.5">
            {files.length} files · {totalBlocks} blocks tracked
          </p>
        </div>
        <span className="h-2 w-2 rounded-full bg-cyan glow-cyan animate-pulse" />
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-hairline pt-3">
          {files.map(([fileId, meta]) => (
            <li key={fileId} className="text-xs font-mono flex justify-between text-slate-300">
              <span>{meta.name}</span>
              <span className="text-muted">{meta.blockIds.length} blocks</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}