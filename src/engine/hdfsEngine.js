// hdfsEngine.js
const BLOCK_SIZE_MB = 128; // classic default
const REPLICATION_FACTOR = 3;

class DataNode {
  constructor(id) {
    this.id = id;
    this.blocks = []; // block ids stored here
    this.capacityMB = 1000;
  }
  usedMB() {
    return this.blocks.length * BLOCK_SIZE_MB;
  }
}

class Block {
  constructor(id, fileId, index, sizeMB) {
    this.id = id;
    this.fileId = fileId;
    this.index = index;
    this.sizeMB = sizeMB;
    this.replicaNodeIds = [];
    this.content = null; // wire up actual bytes/text here if you simulate real content
  }
}

class NameNode {
  constructor(dataNodes) {
    this.dataNodes = dataNodes;
    this.fsImage = {};  // fileId -> { name, blockIds: [] }
    this.blockMap = {}; // blockId -> Block
  }

  // choose N distinct nodes with room, favoring least-used (simple rack-aware stub)
  pickNodesForReplica(count) {
    return [...this.dataNodes]
      .filter((n) => n.usedMB() + BLOCK_SIZE_MB <= n.capacityMB)
      .sort((a, b) => a.usedMB() - b.usedMB())
      .slice(0, count);
  }

 ingestFile(fileId, fileName, totalSizeMB, fullText = "") {
  const blockCount = Math.ceil(totalSizeMB / BLOCK_SIZE_MB);
  const blockIds = [];
  const charsPerBlock = fullText.length > 0 ? Math.ceil(fullText.length / blockCount) : 0;

  for (let i = 0; i < blockCount; i++) {
    const sizeMB = Math.min(BLOCK_SIZE_MB, totalSizeMB - i * BLOCK_SIZE_MB);
    const blockId = `${fileId}-b${i}`;
    const block = new Block(blockId, fileId, i, sizeMB);
    block.content = fullText.slice(i * charsPerBlock, (i + 1) * charsPerBlock);

    const targets = this.pickNodesForReplica(REPLICATION_FACTOR);
    targets.forEach((node) => {
      node.blocks.push(blockId);
      block.replicaNodeIds.push(node.id);
    });

    this.blockMap[blockId] = block;
    blockIds.push(blockId);
  }

  this.fsImage[fileId] = { name: fileName, blockIds };
  return blockIds.map((id) => this.blockMap[id]);
}
  // remove a DataNode (e.g. simulate node failure) and report under-replicated blocks
  removeNode(nodeId) {
    const affected = [];
    Object.values(this.blockMap).forEach((block) => {
      if (block.replicaNodeIds.includes(nodeId)) {
        block.replicaNodeIds = block.replicaNodeIds.filter((id) => id !== nodeId);
        affected.push(block.id); // caller can trigger re-replication animation
      }
    });
    this.dataNodes = this.dataNodes.filter((n) => n.id !== nodeId);
    return affected;
  }
}

export { NameNode, DataNode, Block, BLOCK_SIZE_MB, REPLICATION_FACTOR };