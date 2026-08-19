// HdfsPage.jsx
import { useState, useRef } from "react";
import { useCluster } from "../context/ClusterProvider";
import NameNodeBanner from "../components/cluster/NameNodeBanner";
import ClusterView from "../components/cluster/ClusterView";
import FileUploadPanel from "../components/hdfs/FileUploadPanel";
import BlockFlightAnim from "../components/hdfs/BlockFlightAnim";

export default function HdfsPage() {
  const { nameNode, dataNodes } = useCluster();
  const [flyingBlocks, setFlyingBlocks] = useState([]);
  const uploadRef = useRef(null);

  const handleIngested = (blocks) => {
    setFlyingBlocks(blocks); // triggers BlockFlightAnim
  };

  // simplified: real node positions should come from refs measured in ClusterView
  // (getBoundingClientRect per DataNodeBox); stubbed here so the page compiles standalone
  const nodePositions = Object.fromEntries(
    dataNodes.map((n, i) => [n.id, { x: 200 + (i % 4) * 180, y: 300 + Math.floor(i / 4) * 140 }])
  );
  const originPos = uploadRef.current?.getBoundingClientRect() ?? { x: 100, y: 100 };

  return (
    <div className="space-y-6 p-6">
      <NameNodeBanner nameNode={nameNode} />

      <div ref={uploadRef}>
        <FileUploadPanel onIngested={handleIngested} />
      </div>

      <ClusterView dataNodes={dataNodes} />

      {flyingBlocks.length > 0 && (
        <BlockFlightAnim
          blocks={flyingBlocks}
          nodePositions={nodePositions}
          originPos={originPos}
          onComplete={() => setFlyingBlocks([])}
        />
      )}
    </div>
  );
}