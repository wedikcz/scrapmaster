import React, { useState } from 'react';
import {
  Box,
  Copy,
  Download,
  Check,
  Sliders,
  Layers,
  Sparkles,
  FileCode,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface ParametricCadGeneratorProps {
  lang: Language;
}

interface CadPreset {
  id: string;
  name: string;
  donorCategory: string;
  description: string;
  defaultScrew: number;
  defaultWall: number;
  generateScad: (screw: number, wall: number, clearance: number) => string;
  svgPreview: (screw: number, wall: number) => React.ReactNode;
}

export const ParametricCadGenerator: React.FC<ParametricCadGeneratorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const presets: CadPreset[] = [
    {
      id: 'dvd-mount',
      name: lang === 'cs' ? 'Držák krokového motorku z DVD mechaniky' : 'DVD Stepper Motor Sled Bracket',
      donorCategory: 'DVD-RW Sled',
      description: lang === 'cs'
        ? 'Pevný úchyt pro 4-vodičový mikrokrokový motor PL15S s otvory pro šroubky M2 a drážkou pro vodící tyče.'
        : 'Rigid mounting bracket for PL15S miniature stepper motor with M2 holes and linear rail clearance.',
      defaultScrew: 2.0,
      defaultWall: 2.4,
      generateScad: (screw, wall, tol) => `// ScrapMaster AI - DVD Stepper Motor Bracket (OpenSCAD)
// Generated for: PL15S Miniature Bipolar Stepper
$fn = 60;
screw_d = ${screw};
wall_t = ${wall};
tolerance = ${tol};
motor_w = 15.0 + tolerance;
motor_l = 15.0 + tolerance;
motor_h = 10.0;
rail_d = 3.0 + tolerance;

difference() {
    // Outer bracket body
    cube([motor_w + 2*wall_t, motor_l + 2*wall_t, motor_h + wall_t], center=true);
    
    // Motor cavity
    translate([0, 0, wall_t/2])
        cube([motor_w, motor_l, motor_h + 1], center=true);
        
    // Lead screw cutout slot
    translate([0, motor_l/2, 0])
        cube([6.0, 10.0, motor_h + 2], center=true);
        
    // Guide rail holes
    translate([motor_w/2 + wall_t/2, 0, 0])
        rotate([90, 0, 0])
            cylinder(d=rail_d, h=motor_l + 2*wall_t + 2, center=true);
            
    // Chassis mounting screw holes
    for (x = [-1, 1]) {
        translate([x * (motor_w/2 - 2), -(motor_l/2 + wall_t/2), 0])
            rotate([0, 90, 0])
                cylinder(d=screw_d, h=wall_t*2 + 2, center=true);
    }
}
`,
      svgPreview: (screw, wall) => (
        <svg viewBox="0 0 240 180" className="w-full h-full">
          <rect x="50" y="30" width="140" height="110" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          <rect x="70" y="45" width="100" height="80" rx="4" fill="#020617" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
          <circle cx="60" cy="85" r={screw * 2.5} fill="#38bdf8" />
          <circle cx="180" cy="85" r={screw * 2.5} fill="#38bdf8" />
          <line x1="120" y1="45" x2="120" y2="125" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          <text x="120" y="90" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">PL15S SLED</text>
        </svg>
      )
    },
    {
      id: 'battery-clip',
      name: lang === 'cs' ? 'Zacvakávací pouzdro pro 18650 & TP4056' : '18650 Cell & TP4056 Snap Enclosure',
      donorCategory: 'Laptop / Vape Battery',
      description: lang === 'cs'
        ? 'Kompaktní pouzdro pro jeden článek 18650 se slotem pro nabíjecí desku TP4056 (s otvorem pro USB-C).'
        : 'Compact snap-in cradle for single 18650 cylindrical cell with dedicated slot for TP4056 USB charger.',
      defaultScrew: 3.0,
      defaultWall: 2.0,
      generateScad: (screw, wall, tol) => `// ScrapMaster AI - 18650 & TP4056 Cradle
$fn = 60;
cell_d = 18.2 + ${tol};
cell_l = 65.5 + ${tol};
wall = ${wall};

union() {
    difference() {
        // Outer case
        cube([cell_d + 2*wall, cell_l + 25 + 2*wall, cell_d/2 + wall], center=false);
        
        // Cylindrical cell cutout
        translate([cell_d/2 + wall, cell_l/2 + wall, cell_d/2 + wall])
            rotate([90, 0, 0])
                cylinder(d=cell_d, h=cell_l, center=true);
                
        // TP4056 module pocket
        translate([wall, cell_l + wall + 2, wall])
            cube([17.5, 22.0, 8.0]);
            
        // USB port slot
        translate([wall + 4, cell_l + 25 + wall, wall + 1])
            cube([9.0, wall + 2, 4.0]);
    }
}
`,
      svgPreview: (screw, wall) => (
        <svg viewBox="0 0 240 180" className="w-full h-full">
          <rect x="40" y="35" width="160" height="100" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
          <rect x="50" y="45" width="95" height="80" rx="12" fill="#020617" stroke="#34d399" strokeWidth="1.5" />
          <rect x="155" y="55" width="35" height="60" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
          <rect x="188" y="75" width="10" height="20" rx="2" fill="#38bdf8" />
          <text x="97" y="90" fill="#34d399" fontSize="11" fontFamily="monospace" textAnchor="middle">18650 CELL</text>
          <text x="172" y="88" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">TP4056</text>
        </svg>
      )
    },
    {
      id: 'servo-pen',
      name: lang === 'cs' ? 'Zdvihací rameno pro pero (Servo 9g)' : 'Micro Servo 9g Pen Lifter Arm',
      donorCategory: 'CNC Plotter',
      description: lang === 'cs'
        ? 'Úchyt pro mikroservo SG90 s drážkou pro pero nebo laser a připevněním na DVD saně.'
        : 'Micro servo SG90 bracket with pen clamping groove for mini CNC laser/pen plotter.',
      defaultScrew: 2.5,
      defaultWall: 2.0,
      generateScad: (screw, wall, tol) => `// ScrapMaster AI - 9g Micro Servo Pen Lifter
$fn = 50;
servo_w = 12.2 + ${tol};
servo_l = 23.0 + ${tol};
servo_h = 22.5;

difference() {
    cube([servo_w + 2*${wall}, servo_l + 2*${wall} + 12, servo_h + ${wall}], center=true);
    
    // Servo cavity
    cube([servo_w, servo_l, servo_h + 2], center=true);
    
    // Pen cylindrical clamp hole (diameter 10mm)
    translate([0, servo_l/2 + 6, 0])
        cylinder(d=10.5, h=servo_h + 4, center=true);
        
    // Clamp clamping bolt
    translate([0, servo_l/2 + 6, 0])
        rotate([0, 90, 0])
            cylinder(d=${screw}, h=servo_w + 10, center=true);
}
`,
      svgPreview: (screw, wall) => (
        <svg viewBox="0 0 240 180" className="w-full h-full">
          <path d="M 60 40 L 140 40 L 180 80 L 180 130 L 60 130 Z" fill="#0f172a" stroke="#a78bfa" strokeWidth="2.5" />
          <rect x="75" y="55" width="55" height="60" rx="3" fill="#020617" stroke="#818cf8" strokeWidth="1.5" />
          <circle cx="155" cy="100" r="16" fill="#020617" stroke="#f43f5e" strokeWidth="2" />
          <text x="102" y="90" fill="#818cf8" fontSize="9" fontFamily="monospace" textAnchor="middle">SG90 SERVO</text>
          <text x="155" y="103" fill="#f43f5e" fontSize="8" fontFamily="monospace" textAnchor="middle">PEN</text>
        </svg>
      )
    }
  ];

  const [activePreset, setActivePreset] = useState<CadPreset>(presets[0]);
  const [screwSize, setScrewSize] = useState<number>(activePreset.defaultScrew);
  const [wallThickness, setWallThickness] = useState<number>(activePreset.defaultWall);
  const [tolerance, setTolerance] = useState<number>(0.2);
  const [copied, setCopied] = useState(false);

  const currentScadCode = activePreset.generateScad(screwSize, wallThickness, tolerance);

  const copyCode = () => {
    navigator.clipboard.writeText(currentScadCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScadFile = () => {
    const blob = new Blob([currentScadCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activePreset.id}_scrapmaster.scad`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">{t.cadTitle}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{t.cadDesc}</p>
            </div>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {presets.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setActivePreset(p);
                setScrewSize(p.defaultScrew);
                setWallThickness(p.defaultWall);
              }}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer text-xs ${
                activePreset.id === p.id
                  ? 'bg-slate-800 border-sky-500 text-sky-400 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.donorCategory}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Parameters & 3D Preview (Left) & OpenSCAD Code (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Wireframe Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Wireframe Preview Stage */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="font-semibold text-slate-200">{activePreset.name}</span>
              <span className="text-sky-400">Wireframe CAD</span>
            </div>
            <div className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center p-2 relative overflow-hidden shadow-inner">
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px)`,
                  backgroundSize: '16px 16px'
                }}
              />
              {activePreset.svgPreview(screwSize, wallThickness)}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {activePreset.description}
            </p>
          </div>

          {/* Parametric Customizer Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3 text-xs">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Parametrické rozměry (mm):</span>
            </div>
            <div className="space-y-3 font-mono">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Průměr šroubů (Screw M-size):</span>
                  <span className="text-sky-300 font-bold">M{screwSize.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1.6"
                  max="4.5"
                  step="0.5"
                  value={screwSize}
                  onChange={e => setScrewSize(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Tloušťka stěny (Wall Thickness):</span>
                  <span className="text-sky-300 font-bold">{wallThickness.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="1.6"
                  max="4.0"
                  step="0.2"
                  value={wallThickness}
                  onChange={e => setWallThickness(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Vůle pro 3D tisk (Tolerance):</span>
                  <span className="text-emerald-300 font-bold">+{tolerance.toFixed(2)} mm</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.4"
                  step="0.05"
                  value={tolerance}
                  onChange={e => setTolerance(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: OpenSCAD Code & Export (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-semibold">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span>OpenSCAD Script (.scad)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t.copied : t.copyScad}</span>
                </button>
                <button
                  onClick={downloadScadFile}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.downloadScad}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto max-h-[380px] leading-relaxed text-slate-300">
              <pre>
                <code>{currentScadCode}</code>
              </pre>
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              {lang === 'cs'
                ? 'Tip: Otevřete soubor v OpenSCADu nebo PrusaSliceru, stiskněte F6 (Render) a exportujte přímo do .STL pro vaši 3D tiskárnu.'
                : 'Tip: Open in OpenSCAD or PrusaSlicer, press F6 to render, and export directly to .STL for your 3D printer.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
