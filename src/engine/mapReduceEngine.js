// mapReduceEngine.js
class MRJob {
  constructor(id, blocks, mapFn, reduceFn) {
    this.id = id;
    this.blocks = blocks;       // Block[] from hdfsEngine — one map task per block
    this.mapFn = mapFn;         // (blockContent) => [[key, value], ...]
    this.reduceFn = reduceFn;   // (key, values[]) => result
    this.mapOutputs = [];       // per-task intermediate KV pairs, for animation
    this.shuffled = {};         // key -> values[]
    this.results = {};          // key -> reduced value
    this.phase = "idle";        // idle -> mapping -> shuffling -> reducing -> done
  }

  runMapPhase() {
    this.phase = "mapping";
    this.mapOutputs = this.blocks.map((block) => ({
      taskId: `map-${block.id}`,
      blockId: block.id,
      pairs: this.mapFn(block), // e.g. word-count: [["the",1],["quick",1],...]
    }));
    return this.mapOutputs; // caller animates each task lighting up
  }

  runShufflePhase() {
    this.phase = "shuffling";
    this.shuffled = {};
    this.mapOutputs.forEach(({ pairs }) => {
      pairs.forEach(([key, value]) => {
        if (!this.shuffled[key]) this.shuffled[key] = [];
        this.shuffled[key].push(value);
      });
    });
    return this.shuffled; // caller animates KVs grouping/flying to reducers
  }

  runReducePhase() {
    this.phase = "reducing";
    this.results = {};
    Object.entries(this.shuffled).forEach(([key, values]) => {
      this.results[key] = this.reduceFn(key, values);
    });
    this.phase = "done";
    return this.results;
  }

  runAll() {
    this.runMapPhase();
    this.runShufflePhase();
    return this.runReducePhase();
  }
}

// example built-in job: classic word count
function wordCountMapFn(block) {
  const text = block.content ?? ""; // wire up block.content when you simulate file bytes
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => [word.toLowerCase(), 1]);
}
function wordCountReduceFn(_key, values) {
  return values.reduce((sum, v) => sum + v, 0);
}

export { MRJob, wordCountMapFn, wordCountReduceFn };