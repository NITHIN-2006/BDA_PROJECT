// useYarnCluster.js
import { useState, useCallback, useRef } from "react";
import { ResourceManager, NodeManager } from "../engine/yarnEngine";

export default function useYarnCluster(nodeCount = 6) {
  const nodeManagersRef = useRef(
    Array.from({ length: nodeCount }, (_, i) => new NodeManager(`nm-${i}`))
  );
  const resourceManagerRef = useRef(new ResourceManager(nodeManagersRef.current));

  const [version, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);

  const requestContainers = useCallback((appId, count, vcores, memoryMB) => {
    const allocated = resourceManagerRef.current.requestContainers(appId, count, vcores, memoryMB);
    bump();
    return allocated;
  }, []);

  const finishApplication = useCallback((appId) => {
    resourceManagerRef.current.finishApplication(appId);
    bump();
  }, []);

  return {
    resourceManager: resourceManagerRef.current,
    nodeManagers: nodeManagersRef.current,
    requestContainers,
    finishApplication,
    version,
  };
}