import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface CanvasPanelProps {
  activeDiagramId?: string;
  mermaidSyntax?: string;
  onDiagramSelect?: (diagramId: string) => void;
}

export function CanvasPanel({
  activeDiagramId,
  mermaidSyntax,
  onDiagramSelect,
}: CanvasPanelProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
    });
  }, []);

  useEffect(() => {
    if (!mermaidSyntax || !canvasRef.current) return;

    const renderDiagram = async () => {
      try {
        setError(null);
        const id = `mermaid-${Date.now()}`;

        // Clear previous content
        canvasRef.current!.innerHTML = "";

        // Create container for diagram
        const diagramContainer = document.createElement("div");
        diagramContainer.id = id;
        diagramContainer.className = "mermaid-diagram";
        canvasRef.current!.appendChild(diagramContainer);

        // Render diagram
        await mermaid.render(id, mermaidSyntax);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to render diagram"
        );
        console.error("Mermaid rendering error:", err);
      }
    };

    renderDiagram();
  }, [mermaidSyntax]);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(delta);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--ifm-color-emphasis-200)] bg-[var(--ifm-background-surface-color)] px-3 py-2">
        <h3 className="m-0 text-lg font-semibold text-[var(--ifm-font-color-base)]">
          Canvas
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleZoom(0.1)}
            className="cursor-pointer rounded border border-[var(--ifm-color-emphasis-300)] bg-[var(--ifm-background-surface-color)] px-2 py-1 text-sm font-medium text-[var(--ifm-font-color-base)] transition-all duration-200 ease-in-out hover:bg-[var(--ifm-color-emphasis-100)] hover:border-[var(--ifm-color-emphasis-400)]"
          >
            +
          </button>
          <button
            onClick={() => handleZoom(-0.1)}
            className="cursor-pointer rounded border border-[var(--ifm-color-emphasis-300)] bg-[var(--ifm-background-surface-color)] px-2 py-1 text-sm font-medium text-[var(--ifm-font-color-base)] transition-all duration-200 ease-in-out hover:bg-[var(--ifm-color-emphasis-100)] hover:border-[var(--ifm-color-emphasis-400)]"
          >
            -
          </button>
          <button
            onClick={() => setZoom(1)}
            className="cursor-pointer rounded border border-[var(--ifm-color-emphasis-300)] bg-[var(--ifm-background-surface-color)] px-2 py-1 text-sm font-medium text-[var(--ifm-font-color-base)] transition-all duration-200 ease-in-out hover:bg-[var(--ifm-color-emphasis-100)] hover:border-[var(--ifm-color-emphasis-400)]"
          >
            Reset
          </button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="flex-1 overflow-auto bg-[var(--ifm-background-surface-color)] p-4"
        style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
        onWheel={handleWheel}
      >
        {error && (
          <div className="m-4 rounded border border-[#ffc107] bg-[#fff3cd] p-4 text-[#856404] dark:border-[rgba(255,193,7,0.3)] dark:bg-[rgba(255,193,7,0.1)] dark:text-[#ffd54f]">
            <p>Error rendering diagram:</p>
            <pre className="mt-2 overflow-x-auto text-sm">{error}</pre>
          </div>
        )}

        {!mermaidSyntax && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[var(--ifm-color-emphasis-600)]">
            <p>No diagram to display.</p>
            <p>Ask the AI to generate a Mermaid diagram to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
