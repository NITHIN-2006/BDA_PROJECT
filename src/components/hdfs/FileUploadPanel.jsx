// FileUploadPanel.jsx
import { useState, useCallback } from "react";
import { useCluster } from "../../context/ClusterProvider";

export default function FileUploadPanel({ onIngested }) {
  const { nameNode, ingestFile } = useCluster();
  const [isDragging, setIsDragging] = useState(false);
  const [lastFile, setLastFile] = useState(null);

 const handleFiles = useCallback(
  (files) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const fileId = `file-${Date.now()}`;
      const sizeMB = Math.max(1, Math.round(file.size / (1024 * 1024)));

      const blocks = ingestFile(fileId, file.name, sizeMB, text);
      setLastFile({ name: file.name, sizeMB, blockCount: blocks.length });
      onIngested(blocks);
    };
    reader.readAsText(file);
  },
  [ingestFile, onIngested]
);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer
        ${isDragging ? "border-cyan bg-cyan/10" : "border-hairline bg-panel"}`}
    >
      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <label htmlFor="file-input" className="cursor-pointer">
        <p className="text-slate-300 text-sm font-medium">
          Drop a file here, or click to upload
        </p>
        <p className="text-muted text-xs mt-1">
          Splits into 128MB blocks · replicated x3 across DataNodes
        </p>
      </label>

      {lastFile && (
        <p className="mt-4 text-xs text-cyan font-mono">
          {lastFile.name} · {lastFile.sizeMB}MB → {lastFile.blockCount} blocks
        </p>
      )}
    </div>
  );
}