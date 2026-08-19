// ClusterProvider.jsx
import { createContext, useContext } from "react";
import useHdfsCluster from "../hooks/useHdfsCluster";
import useYarnCluster from "../hooks/useYarnCluster";

const ClusterContext = createContext(null);

export function ClusterProvider({ children, hdfsNodeCount = 6, yarnNodeCount = 6 }) {
  const hdfs = useHdfsCluster(hdfsNodeCount);
  const yarn = useYarnCluster(yarnNodeCount);

  const value = {
    // HDFS
    nameNode: hdfs.nameNode,
    dataNodes: hdfs.dataNodes,
    ingestFile: hdfs.ingestFile,
    removeNode: hdfs.removeNode,
    hdfsVersion: hdfs.version,

    // YARN
    resourceManager: yarn.resourceManager,
    nodeManagers: yarn.nodeManagers,
    requestContainers: yarn.requestContainers,
    finishApplication: yarn.finishApplication,
    yarnVersion: yarn.version,
  };

  return (
    <ClusterContext.Provider value={value}>
      {children}
    </ClusterContext.Provider>
  );
}

export function useCluster() {
  const ctx = useContext(ClusterContext);
  if (!ctx) {
    throw new Error("useCluster must be used within a ClusterProvider");
  }
  return ctx;
}