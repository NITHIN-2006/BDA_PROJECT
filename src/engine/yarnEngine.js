// yarnEngine.js
class Container {
  constructor(id, nodeId, cpuVCores, memoryMB) {
    this.id = id;
    this.nodeId = nodeId;
    this.cpuVCores = cpuVCores;
    this.memoryMB = memoryMB;
    this.status = "allocated"; // allocated -> running -> completed
  }
}

class NodeManager {
  constructor(id, totalVCores = 8, totalMemoryMB = 8192) {
    this.id = id;
    this.totalVCores = totalVCores;
    this.totalMemoryMB = totalMemoryMB;
    this.usedVCores = 0;
    this.usedMemoryMB = 0;
    this.containers = [];
  }

  availableVCores() {
    return this.totalVCores - this.usedVCores;
  }
  availableMemoryMB() {
    return this.totalMemoryMB - this.usedMemoryMB;
  }

  tryAllocate(vcores, memoryMB) {
    return this.availableVCores() >= vcores && this.availableMemoryMB() >= memoryMB;
  }

  allocate(container) {
    this.usedVCores += container.cpuVCores;
    this.usedMemoryMB += container.memoryMB;
    this.containers.push(container);
  }

  release(containerId) {
    const c = this.containers.find((c) => c.id === containerId);
    if (!c) return;
    this.usedVCores -= c.cpuVCores;
    this.usedMemoryMB -= c.memoryMB;
    this.containers = this.containers.filter((x) => x.id !== containerId);
  }
}

class ResourceManager {
  constructor(nodeManagers) {
    this.nodeManagers = nodeManagers;
    this.jobQueue = [];
    this.applications = {}; // appId -> { containers: [], status }
    this._containerCounter = 0;
  }

  // simple scheduler: round-robin least-used NM that can fit the request
  requestContainers(appId, count, vcoresEach = 1, memoryMBEach = 1024) {
    if (!this.applications[appId]) {
      this.applications[appId] = { containers: [], status: "running" };
    }

    const allocated = [];
    for (let i = 0; i < count; i++) {
      const candidate = [...this.nodeManagers]
        .filter((nm) => nm.tryAllocate(vcoresEach, memoryMBEach))
        .sort((a, b) => a.usedVCores - b.usedVCores)[0];

      if (!candidate) break; // cluster full, rest stay queued

      const container = new Container(
        `${appId}-c${this._containerCounter++}`,
        candidate.id,
        vcoresEach,
        memoryMBEach
      );
      candidate.allocate(container);
      this.applications[appId].containers.push(container.id);
      allocated.push(container);
    }
    return allocated; // for animation: containers landing on their NM boxes
  }

  finishApplication(appId) {
    const app = this.applications[appId];
    if (!app) return;
    app.containers.forEach((cid) => {
      const nm = this.nodeManagers.find((n) => n.containers.some((c) => c.id === cid));
      nm?.release(cid);
    });
    app.status = "finished";
  }
}

export { ResourceManager, NodeManager, Container };