// App.jsx
import { useState } from "react";
import { ClusterProvider, useCluster } from "./context/ClusterProvider";
import HdfsPage from "./pages/HdfsPage";
import MapReducePage from "./pages/MapReducePage";
import YarnPage from "./pages/YarnPage";
import EcosystemPage from "./pages/EcosystemPage";

const TABS = [
  { id: "hdfs", label: "HDFS", component: HdfsPage, accent: "cyan" },
  { id: "mapreduce", label: "MapReduce", component: MapReducePage, accent: "cyan" },
  { id: "yarn", label: "YARN", component: YarnPage, accent: "amber" },
  { id: "ecosystem", label: "Ecosystem", component: EcosystemPage, accent: "magenta" },
];

function ClusterTicker() {
  const { nameNode, resourceManager } = useCluster();
  const blockCount = Object.keys(nameNode.blockMap).length;
  const runningApps = Object.values(resourceManager.applications).filter(
    (a) => a.status === "running"
  ).length;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 px-6 py-2 bg-panel border-b border-hairline font-display text-[11px] text-muted">
      <span>BLOCKS <span className="text-cyan">{blockCount}</span></span>
      <span>REPLICATION <span className="text-cyan">x3</span></span>
      <span>NODEMANAGERS <span className="text-amber">{resourceManager.nodeManagers.length}</span></span>
      <span>RUNNING JOBS <span className="text-amber">{runningApps}</span></span>
      <span className="ml-auto flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
        CLUSTER ONLINE
      </span>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("hdfs");
  const ActivePage = TABS.find((t) => t.id === activeTab).component;
  const accentClass = { cyan: "text-cyan bg-cyan-dim", amber: "text-amber bg-amber-dim", magenta: "text-magenta bg-magenta-dim" };

  return (
    <ClusterProvider>
      <div className="min-h-screen bg-ink">
        <header className="border-b border-hairline px-6 pt-5">
          <h1 className="font-display text-lg font-semibold text-white mb-4 tracking-tight">
            HADOOP<span className="text-cyan">::</span>VISUALIZER
          </h1>
          <nav className="flex gap-1 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-display text-xs px-4 py-2.5 border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? `border-${tab.accent} text-white`
                    : "border-transparent text-muted hover:text-slate-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        <ClusterTicker />

        <main>
          <ActivePage />
        </main>
      </div>
    </ClusterProvider>
  );
}