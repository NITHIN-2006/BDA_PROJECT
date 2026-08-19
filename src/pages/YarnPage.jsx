// YarnPage.jsx
import { useState, useRef } from "react";
import { useCluster } from "../context/ClusterProvider";
import ResourceManagerView from "../components/yarn/ResourceManagerView";
import ContainerAllocationAnim from "../components/yarn/ContainerAllocationAnim";

export default function YarnPage() {
  const { resourceManager, nodeManagers } = useCluster();
  const [flyingContainers, setFlyingContainers] = useState([]);
  const rmRef = useRef(null);

  const handleAllocate = (containers) => {
    setFlyingContainers(containers);
  };

  // simplified stand-in for ref-measured positions, same caveat as HdfsPage
  const nmPositions = Object.fromEntries(
    nodeManagers.map((n, i) => [n.id, { x: 200 + (i % 4) * 180, y: 300 + Math.floor(i / 4) * 140 }])
  );
  const originPos = rmRef.current?.getBoundingClientRect() ?? { x: 100, y: 100 };

  return (
    <div className="space-y-6 p-6">
      <div ref={rmRef}>
        <ResourceManagerView resourceManager={resourceManager} onAllocate={handleAllocate} />
      </div>

      {flyingContainers.length > 0 && (
        <ContainerAllocationAnim
          containers={flyingContainers}
          nmPositions={nmPositions}
          originPos={originPos}
          onComplete={() => setFlyingContainers([])}
        />
      )}
    </div>
  );
}