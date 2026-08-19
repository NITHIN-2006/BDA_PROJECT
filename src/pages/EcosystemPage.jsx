// EcosystemPage.jsx
import { useCluster } from "../context/ClusterProvider";
import useMapReduceJob from "../hooks/useMapReduceJob";
import { translateHiveQuery, translatePigScript } from "../engine/ecosystemEngine";
import HiveQueryPanel from "../components/ecosystem/HiveQueryPanel";
import PigScriptPanel from "../components/ecosystem/PigScriptPanel";
import MapPhaseView from "../components/mapreduce/MapPhaseView";
import ShuffleSortView from "../components/mapreduce/ShuffleSortView";
import ReducePhaseView from "../components/mapreduce/ReducePhaseView";

export default function EcosystemPage() {
  const { nameNode } = useCluster();
  const { phase, mapOutputs, shuffled, results, runJob } = useMapReduceJob();

  const allBlocks = Object.values(nameNode.blockMap);

  const handleHiveRun = (query) => {
    const { job, explanation } = translateHiveQuery(query, allBlocks);
    if (job) runJob(job);
    return explanation;
  };

  const handlePigRun = (lines) => {
    const { job, explanation } = translatePigScript(lines, allBlocks);
    if (job) runJob(job);
    return explanation;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HiveQueryPanel blockCount={allBlocks.length} onRun={handleHiveRun} />
        <PigScriptPanel blockCount={allBlocks.length} onRun={handlePigRun} />
      </div>

      {phase !== "idle" && <MapPhaseView mapOutputs={mapOutputs} active={phase === "mapping"} />}
      {(phase === "shuffling" || phase === "reducing" || phase === "done") && (
        <ShuffleSortView shuffled={shuffled} active={phase === "shuffling"} />
      )}
      {(phase === "reducing" || phase === "done") && (
        <ReducePhaseView results={results} active={phase === "reducing"} />
      )}
    </div>
  );
}