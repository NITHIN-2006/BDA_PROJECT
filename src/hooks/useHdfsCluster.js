// useHdfsCluster.js
import { useState, useCallback, useRef } from "react";
import { NameNode, DataNode } from "../engine/hdfsEngine";

export default function useHdfsCluster(nodeCount = 6) {
  // engine instances live in a ref — mutable, not re-created on render
  const dataNodesRef = useRef(
    Array.from({ length: nodeCount }, (_, i) => new DataNode(`dn-${i}`))
  );
  const nameNodeRef = useRef(new NameNode(dataNodesRef.current));

  // version counter forces re-render since engine mutates in place
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);

  const ingestFile = useCallback((fileId, fileName, sizeMB, fullText) => {
  const blocks = nameNodeRef.current.ingestFile(fileId, fileName, sizeMB, fullText);
  bump();
  return blocks;
}, []);
  const removeNode = useCallback((nodeId) => {
    const affected = nameNodeRef.current.removeNode(nodeId);
    bump();
    return affected;
  }, []);

  return {
    nameNode: nameNodeRef.current,
    dataNodes: dataNodesRef.current,
    ingestFile,
    removeNode,
    version, // include in deps/keys elsewhere if you need to force child re-renders
  };
}