// MapReducePage.jsx
import { useCluster } from "../context/ClusterProvider";
import useMapReduceJob from "../hooks/useMapReduceJob";
import { MRJob, wordCountMapFn, wordCountReduceFn } from "../engine/mapReduceEngine";
import JobSubmitPanel from "../components/mapreduce/JobSubmitPanel";
import MapPhaseView from "../components/mapreduce/MapPhaseView";
import ShuffleSortView from "../components/mapreduce/ShuffleSortView";
import ReducePhaseView from "../components/mapreduce/ReducePhaseView";

export default function MapReducePage() {
  const { nameNode } = useCluster();
  const { phase, mapOutputs, shuffled, results, runJob } = useMapReduceJob();

  const allBlocks = Object.values(nameNode.blockMap);

  const handleSubmit = () => {
    const job = new MRJob(`job-${Date.now()}`, allBlocks, wordCountMapFn, wordCountReduceFn);
    runJob(job);
  };

  return (
    <div className="space-y-6 p-6">
      <JobSubmitPanel blockCount={allBlocks.length} onSubmit={handleSubmit} phase={phase} />

      {phase !== "idle" && (
        <MapPhaseView mapOutputs={mapOutputs} active={phase === "mapping"} />
      )}
      {(phase === "shuffling" || phase === "reducing" || phase === "done") && (
        <ShuffleSortView shuffled={shuffled} active={phase === "shuffling"} />
      )}
      {(phase === "reducing" || phase === "done") && (
        <ReducePhaseView results={results} active={phase === "reducing"} />
      )}
    </div>
  );
}