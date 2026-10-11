import React, { useState, useRef } from 'react';
import { SchematicNode, SchematicWire } from '../types/scrap';
import { ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

interface SchematicViewerProps {
  nodes: SchematicNode[];
  wires: SchematicWire[];
  title?: string;
}

export const SchematicViewer: React.FC<SchematicViewerProps> = ({ nodes, wires, title }) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPin, setHoveredPin] = useState<{ nodeLabel: string; pinLabel: string; type: string } | null>(null);
  const [selectedWire, setSelectedWire] = useState<SchematicWire | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setScale(s => Math.min(s + 0.2, 2.5));
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));
  const resetView = () => {
    setScale(1);
    setOffset({ x: 20, y: 20 });
    setSelectedWire(null);
  };

  const downloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'schematic').toLowerCase().replace(/\s+/g, '_')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Build a lookup map for node pins to draw accurate wire splines
  const pinCoordMap = new Map<string, { x: number; y: number }>();
  for (const node of nodes) {
    for (const pin of node.pins) {
      pinCoordMap.set(`${node.id}::${pin.id}`, { x: pin.x, y: pin.y });
    }
  }

  return (
    <div className="relative w-full h-[480px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden select-none">
      {/* Schematic canvas background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle, #38bdf8 1px, transparent 1px),
            linear-gradient(to right, #1e293b 1px, transparent 1px),
            linear-gradient(to bottom, #1e293b 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Toolbar controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-lg shadow-lg">
        <button
          onClick={zoomIn}
          title="Zoom In"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          title="Reset Canvas View"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
        <button
          onClick={downloadSvg}
          title="Export Vector SVG"
          className="p-1.5 text-sky-400 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Top Left Title & Scale Indicator */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
        <span className="text-sky-400 font-semibold">{title || 'Circuit Schematic'}</span>
        <span aria-hidden="true" className="text-slate-600">|</span>
        <span>{Math.round(scale * 100)}% scale</span>
        {selectedWire && (
          <>
            <span aria-hidden="true" className="text-slate-600">|</span>
            <span className="text-amber-400">Signal: {selectedWire.signalName || selectedWire.voltage || selectedWire.id}</span>
          </>
        )}
      </div>

      {/* Interactive Tooltip Banner */}
      {hoveredPin && (
        <div className="absolute bottom-3 left-3 z-10 text-xs font-mono bg-sky-950/90 text-sky-200 border border-sky-700/50 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>
            {hoveredPin.nodeLabel} &rarr; <strong>{hoveredPin.pinLabel}</strong> ({hoveredPin.type.toUpperCase()})
          </span>
        </div>
      )}

      {/* SVG Canvas Area */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
          </marker>
          <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
          {/* Render Wires */}
          {wires.map(wire => {
            const p1 = pinCoordMap.get(`${wire.fromNode}::${wire.fromPin}`);
            const p2 = pinCoordMap.get(`${wire.toNode}::${wire.toPin}`);
            if (!p1 || !p2) return null;

            const isSelected = selectedWire?.id === wire.id;
            const wireColor = isSelected ? '#38bdf8' : wire.color || '#94a3b8';
            const dx = Math.abs(p2.x - p1.x);
            // Spline path with right-angle / curved bezier
            const pathD = `M ${p1.x} ${p1.y} C ${p1.x + dx * 0.5} ${p1.y}, ${p2.x - dx * 0.5} ${p2.y}, ${p2.x} ${p2.y}`;

            return (
              <g
                key={wire.id}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedWire(wire);
                }}
                className="cursor-pointer group"
              >
                {/* Thick invisible click boundary */}
                <path d={pathD} fill="none" stroke="transparent" strokeWidth="14" />
                {/* Visual Wire */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={wireColor}
                  strokeWidth={isSelected ? 3 : 2}
                  strokeLinecap="round"
                  filter={isSelected ? 'url(#wire-glow)' : undefined}
                  className="transition-all duration-150 group-hover:stroke-sky-300 group-hover:stroke-[2.5]"
                />
                {/* Wire connection node dots */}
                <circle cx={p1.x} cy={p1.y} r="3" fill={wireColor} />
                <circle cx={p2.x} cy={p2.y} r="3" fill={wireColor} />
                {/* Signal label tag on midpoint */}
                {wire.signalName && (
                  <text
                    x={(p1.x + p2.x) / 2}
                    y={(p1.y + p2.y) / 2 - 6}
                    fill={wireColor}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none opacity-80"
                  >
                    {wire.signalName}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Schematic Nodes (Component ICs / Modules) */}
          {nodes.map(node => {
            const isMCU = node.type === 'mcu';
            const isPower = node.type === 'power';
            const isMotor = node.type === 'motor';
            const bgFill = isMCU
              ? '#0f172a'
              : isPower
              ? '#1c1917'
              : isMotor
              ? '#14232c'
              : '#09131f';
            const borderStroke = isMCU
              ? '#38bdf8'
              : isPower
              ? '#f59e0b'
              : isMotor
              ? '#10b981'
              : '#475569';

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                {/* Component Body Box */}
                <rect
                  x="0"
                  y="0"
                  width={node.width}
                  height={node.height}
                  rx="6"
                  fill={bgFill}
                  stroke={borderStroke}
                  strokeWidth="1.5"
                  className="drop-shadow-md"
                />
                {/* Top header bar */}
                <path
                  d={`M 0 6 Q 0 0 6 0 L ${node.width - 6} 0 Q ${node.width} 0 ${node.width} 6 L ${node.width} 24 L 0 24 Z`}
                  fill={borderStroke}
                  fillOpacity="0.18"
                />
                {/* Component Label */}
                <text
                  x={node.width / 2}
                  y="16"
                  fill="#f8fafc"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                  textAnchor="middle"
                  className="select-none pointer-events-none"
                >
                  {node.label}
                </text>
                {node.subLabel && (
                  <text
                    x={node.width / 2}
                    y={node.height - 8}
                    fill="#94a3b8"
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {node.subLabel}
                  </text>
                )}
                {/* Component Pins */}
                {node.pins.map(pin => {
                  const localX = pin.x - node.x;
                  const localY = pin.y - node.y;
                  const isPwr = pin.type === 'pwr';
                  const isGnd = pin.type === 'gnd';
                  const pinColor = isPwr ? '#ef4444' : isGnd ? '#64748b' : '#38bdf8';
                  // Determine pin text alignment based on horizontal position relative to center
                  const isRightSide = localX > node.width / 2;

                  return (
                    <g
                      key={pin.id}
                      onMouseEnter={() =>
                        setHoveredPin({
                          nodeLabel: node.label,
                          pinLabel: pin.label,
                          type: pin.type
                        })
                      }
                      onMouseLeave={() => setHoveredPin(null)}
                      className="cursor-pointer group"
                    >
                      {/* Terminal Line & Outer Solder Dot */}
                      <circle
                        cx={localX}
                        cy={localY}
                        r="4"
                        fill="#020617"
                        stroke={pinColor}
                        strokeWidth="1.5"
                        className="group-hover:scale-125 transition-transform"
                      />
                      {/* Pin Name Label */}
                      <text
                        x={isRightSide ? localX - 8 : localX + 8}
                        y={localY + 3}
                        fill="#cbd5e1"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor={isRightSide ? 'end' : 'start'}
                        className="select-none pointer-events-none group-hover:fill-sky-300 font-medium"
                      >
                        {pin.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
