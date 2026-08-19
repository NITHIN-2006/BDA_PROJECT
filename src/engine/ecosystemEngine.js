// ecosystemEngine.js
import { MRJob, wordCountReduceFn } from "./mapReduceEngine";

// Very simplified "translator": recognizes a couple of query shapes
// and builds the equivalent map/reduce functions, so the UI can show
// "your HiveQL became this MapReduce job" step by step.

function translateHiveQuery(query, blocks) {
  const normalized = query.trim().toLowerCase();

  // SELECT word, COUNT(*) FROM table GROUP BY word  -> word count
  if (normalized.includes("count(*)") && normalized.includes("group by")) {
    const mapFn = (block) =>
      (block.content ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => [w.toLowerCase(), 1]);
    return {
      explanation: "Translated to a word-count style MapReduce job (GROUP BY -> shuffle key, COUNT(*) -> reduce sum).",
      job: new MRJob(`hive-${Date.now()}`, blocks, mapFn, wordCountReduceFn),
    };
  }

  // SELECT AVG(col) FROM table
  if (normalized.includes("avg(")) {
    const colMatch = normalized.match(/avg\((\w+)\)/);
    const col = colMatch?.[1];
    const mapFn = (block) =>
      (block.rows ?? []).map((row) => ["avg", Number(row[col]) || 0]);
    const reduceFn = (_key, values) => values.reduce((a, b) => a + b, 0) / values.length;
    return {
      explanation: `Translated to a MapReduce job computing AVG(${col}) via sum/count in the reduce phase.`,
      job: new MRJob(`hive-${Date.now()}`, blocks, mapFn, reduceFn),
    };
  }

  return {
    explanation: "Query shape not recognized by this simplified translator yet.",
    job: null,
  };
}

// Pig: pipeline of ops (LOAD -> FILTER -> GROUP -> FOREACH) mapped the same way
function translatePigScript(scriptLines, blocks) {
  // scriptLines: e.g. ["A = LOAD 'data'", "B = GROUP A BY word", "C = FOREACH B GENERATE COUNT(A)"]
  const hasGroupCount = scriptLines.some((l) => /GROUP/i.test(l)) &&
    scriptLines.some((l) => /COUNT/i.test(l));

  if (hasGroupCount) {
    return translateHiveQuery("select count(*) group by", blocks); // reuse same underlying job shape
  }
  return { explanation: "Pig script shape not recognized yet.", job: null };
}

export { translateHiveQuery, translatePigScript };