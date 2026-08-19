// useMapReduceJob.js
import { useState, useCallback, useRef } from "react";

const PHASE_DELAY_MS = 1500;

export default function useMapReduceJob() {
  const [phase, setPhase] = useState("idle"); // idle -> mapping -> shuffling -> reducing -> done
  const [mapOutputs, setMapOutputs] = useState([]);
  const [shuffled, setShuffled] = useState({});
  const [results, setResults] = useState({});
  const jobRef = useRef(null);
  const timeoutsRef = useRef([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // accepts an already-constructed MRJob (from mapReduceEngine or ecosystemEngine)
  const runJob = useCallback((job) => {
    clearTimers();
    jobRef.current = job;

    setPhase("mapping");
    setMapOutputs(job.runMapPhase());
    setShuffled({});
    setResults({});

    timeoutsRef.current.push(
      setTimeout(() => {
        setPhase("shuffling");
        setShuffled(job.runShufflePhase());
      }, PHASE_DELAY_MS)
    );

    timeoutsRef.current.push(
      setTimeout(() => {
        setPhase("reducing");
        setResults(job.runReducePhase());
        setPhase("done");
      }, PHASE_DELAY_MS * 2)
    );
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    jobRef.current = null;
    setPhase("idle");
    setMapOutputs([]);
    setShuffled({});
    setResults({});
  }, []);

  return { phase, mapOutputs, shuffled, results, runJob, reset };
}