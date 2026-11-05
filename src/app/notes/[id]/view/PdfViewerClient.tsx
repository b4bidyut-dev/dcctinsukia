"use client";

import { useState, useRef } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  Download,
} from "lucide-react";

interface PdfViewerClientProps {
  pdfUrl: string;
  title: string;
}

export default function PdfViewerClient({ pdfUrl, title }: PdfViewerClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 15, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 15, 60));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex-1 flex flex-col rounded-xl overflow-hidden bg-slate-900 border border-slate-800 ${
        isFullscreen ? "p-0 rounded-none border-0" : ""
      }`}
    >
      {/* Control Toolbar */}
      <div className="bg-[#0b291a] px-4 py-2 border-b border-[#144229] flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-slate-400">Zoom:</span>
          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-slate-700 text-slate-200 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-amber-400 w-12 text-center">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-slate-700 text-slate-200 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-0.5 rounded hover:bg-slate-700 text-[11px] text-slate-400 hover:text-white"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Document View Canvas */}
      <div className="flex-1 w-full bg-[#1e293b] flex items-center justify-center p-2 sm:p-4 overflow-auto">
        <div
          className="w-full h-full min-h-[75vh] flex flex-col transition-all duration-150"
          style={{ width: `${zoom}%`, margin: "0 auto" }}
        >
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full flex-1 min-h-[75vh] rounded-lg shadow-2xl bg-white border border-slate-700"
          >
            {/* Fallback if browser does not render <object> */}
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900 rounded-lg text-white space-y-4">
              <p className="text-sm text-slate-300">
                Your browser does not support inline PDF viewing.
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open PDF in New Tab
              </a>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
}

