// ClusterView.jsx
import DataNodeBox from "./DataNodeBox";

export default function ClusterView({ dataNodes }) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6">
      <h2 className="text-slate-300 text-sm font-medium mb-4 tracking-wide uppercase">
        DataNode Cluster
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {dataNodes.map((node) => (
          <DataNodeBox key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}