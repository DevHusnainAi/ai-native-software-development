import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface CanvasPanelProps {
  activeDiagramId?: string;
  mermaidSyntax?: string;
  onDiagramSelect?: (diagramId: string) => void;
}

export function CanvasPanel({ activeDiagramId, mermaidSyntax, onDiagramSelect }: CanvasPanelProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    if (!mermaidSyntax || !canvasRef.current) return;

    const renderDiagram = async () => {
      try {
        setError(null);
        const id = `mermaid-${Date.now()}`;
        
        // Clear previous content
        canvasRef.current!.innerHTML = '';

        // Create container for diagram
        const diagramContainer = document.createElement('div');
        diagramContainer.id = id;
        diagramContainer.className = 'mermaid-diagram';
        canvasRef.current!.appendChild(diagramContainer);

        // Render diagram
        await mermaid.render(id, mermaidSyntax);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        console.error('Mermaid rendering error:', err);
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
    <div className="canvas-panel">
      <div className="canvas-header">
        <h3>Canvas</h3>
        <div className="canvas-controls">
          <button onClick={() => handleZoom(0.1)}>+</button>
          <button onClick={() => handleZoom(-0.1)}>-</button>
          <button onClick={() => setZoom(1)}>Reset</button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="canvas-content"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        onWheel={handleWheel}
      >
        {error && (
          <div className="canvas-error">
            <p>Error rendering diagram:</p>
            <pre>{error}</pre>
          </div>
        )}

        {!mermaidSyntax && (
          <div className="canvas-empty">
            <p>No diagram to display.</p>
            <p>Ask the AI to generate a Mermaid diagram to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

