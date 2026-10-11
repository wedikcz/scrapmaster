import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Flame, Zap, Thermometer, Wind, Calculator } from 'lucide-react';

export const SafetyDiagnosticScanner: React.FC = () => {
  // Capacitor energy calculator state
  const [capMicrofarads, setCapMicrofarads] = useState(470);
  const [capVolts, setCapVolts] = useState(350);

  // Heatsink thermal calculator state
  const [inputVolts, setInputVolts] = useState(24);
  const [outputVolts, setOutputVolts] = useState(5);
  const [loadCurrentAmps, setLoadCurrentAmps] = useState(0.8);

  // E = 0.5 * C * V^2 (Joules)
  const storedJoules = 0.5 * (capMicrofarads * 1e-6) * Math.pow(capVolts, 2);
  const isLethal = storedJoules >= 10.0;

  // Thermal Dissipation P = (Vin - Vout) * I
  const wattsDissipated = Math.max(0, (inputVolts - outputVolts) * loadCurrentAmps);
  const needsFan = wattsDissipated > 10;
  const needsHeatsink = wattsDissipated > 1.5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              Hardware Safety Diagnostic &amp; Hazard Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live physics calculations for stored electrical energy, thermal dissipation limits, and toxic materials.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Physics Calculators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calculator 1: Capacitor Stored Shock Energy */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Primary Capacitor Lethal Shock Calculator</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">E = &frac12;CV&sup2;</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Capacitance (&micro;F)</label>
              <input
                type="number"
                value={capMicrofarads}
                onChange={e => setCapMicrofarads(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">DC Charge Voltage (V)</label>
              <input
                type="number"
                value={capVolts}
                onChange={e => setCapVolts(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono"
              />
            </div>
          </div>

          {/* Stored Joules Gauge */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isLethal
                ? 'bg-rose-950/40 border-rose-800 text-rose-200'
                : 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
            }`}
          >
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Stored Kinetic Energy
              </div>
              <div className="text-xl font-bold font-mono">
                {storedJoules.toFixed(2)} Joules
              </div>
            </div>
            <div className="text-right">
              {isLethal ? (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                  <span>POTENTIALLY FATAL (&gt;10J)</span>
                </div>
              ) : (
                <div className="text-xs text-emerald-400 font-semibold">
                  Non-Lethal (Painful Shock)
                </div>
              )}
              <div className="text-[11px] text-slate-400 mt-0.5">
                Discharge with 10k&Omega; 5W resistor
              </div>
            </div>
          </div>
        </div>

        {/* Calculator 2: Regulator Thermal Dissipation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span>Linear Regulator Heat Dissipation</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">P = (Vin - Vout) &times; I</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Vin (V)</label>
              <input
                type="number"
                value={inputVolts}
                onChange={e => setInputVolts(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Vout (V)</label>
              <input
                type="number"
                value={outputVolts}
                onChange={e => setOutputVolts(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Load (Amps)</label>
              <input
                type="number"
                step="0.1"
                value={loadCurrentAmps}
                onChange={e => setLoadCurrentAmps(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-slate-950 border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Heat Power Dissipation
              </div>
              <div className="text-xl font-bold font-mono text-amber-400">
                {wattsDissipated.toFixed(2)} Watts
              </div>
            </div>
            <div className="text-right text-xs space-y-0.5">
              {needsFan ? (
                <span className="text-rose-400 font-bold block">Active Fan + Large Heatsink</span>
              ) : needsHeatsink ? (
                <span className="text-amber-400 font-semibold block">Aluminum Heatsink Required</span>
              ) : (
                <span className="text-emerald-400 font-semibold block">Free Air (No Heatsink OK)</span>
              )}
              <span className="text-[11px] text-slate-500">
                TO-220 free air max: ~1.5W
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Scrap Hazard Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-400" />
          <span>Salvaged Electronics Hazard Classification Matrix</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1: Lithium-Ion Safety */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>18650 &amp; Pouch Lithium Cells</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed text-[11px]">
              <li>Never use metal tools that could pierce outer foil wrapper.</li>
              <li>Reject swollen or puffy pouch cells (&ldquo;pillowed&rdquo;).</li>
              <li>Cells reading &lt; 2.0V have internal copper dendrite risk; discard responsibly.</li>
              <li>Always solder through a battery protection board (TP4056 + DW01).</li>
            </ul>
          </div>

          {/* Card 2: Flyback & CRT Transformers */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="font-semibold text-rose-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Flybacks &amp; CRT Anodes</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed text-[11px]">
              <li>CRT glass acts as a high-voltage Leyden jar holding up to 25,000V DC.</li>
              <li>Discharge suction cup anode to chassis ground with 10M&Omega; high-voltage probe.</li>
              <li>Microwave transformers produce 2,000V AC at 500mA: instantaneously lethal shock.</li>
            </ul>
          </div>

          {/* Card 3: Toxic Materials */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="font-semibold text-sky-400 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5" />
              <span>Toxic Substances in Scrap</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed text-[11px]">
              <li>Beryllium Oxide (BeO): White ceramic in RF transistors. Toxic if sanded or broken.</li>
              <li>Old solder contains 40% Lead: Wash hands after handling; solder in ventilated room.</li>
              <li>CCFL backlight tubes contain Mercury vapor; avoid snapping glass tubes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
