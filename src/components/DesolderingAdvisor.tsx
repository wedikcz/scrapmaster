import React, { useState, useEffect } from 'react';
import {
  Flame,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Wrench,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface DesolderingAdvisorProps {
  lang: Language;
}

export const DesolderingAdvisor: React.FC<DesolderingAdvisorProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  // Simulator state
  const [solderAlloy, setSolderAlloy] = useState<'leaded' | 'rohs' | 'chipquik'>('rohs');
  const [boardType, setBoardType] = useState<'single' | 'double' | 'four_layer'>('double');
  const [hasGroundPlane, setHasGroundPlane] = useState(true);

  // Pad touch simulator
  const [dwellTime, setDwellTime] = useState(0);
  const [isHoldingIron, setIsHoldingIron] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHoldingIron) {
      interval = setInterval(() => {
        setDwellTime(t => t + 0.1);
      }, 100);
    } else {
      setDwellTime(0);
    }
    return () => clearInterval(interval);
  }, [isHoldingIron]);

  // Recommended parameters calculation
  const getThermalRecs = () => {
    let meltTemp = 217;
    let ironTemp = 360;
    let maxDwellSec = 3.5;
    let preheatTemp = 0;

    if (solderAlloy === 'leaded') {
      meltTemp = 183;
      ironTemp = 315;
      maxDwellSec = 4.0;
    } else if (solderAlloy === 'chipquik') {
      meltTemp = 58;
      ironTemp = 200;
      maxDwellSec = 10.0;
    }

    if (boardType === 'four_layer' || hasGroundPlane) {
      ironTemp += 25;
      maxDwellSec = 2.5; // High thermal stress
      preheatTemp = 110;
    } else if (boardType === 'single') {
      maxDwellSec = 2.0; // Cheap single-sided paper-phenolic boards delaminate very easily!
    }

    return { meltTemp, ironTemp, maxDwellSec, preheatTemp };
  };

  const recs = getThermalRecs();

  // Status for simulator
  const padStatus =
    dwellTime === 0
      ? 'idle'
      : dwellTime < recs.maxDwellSec * 0.8
      ? 'safe'
      : dwellTime < recs.maxDwellSec
      ? 'warning'
      : 'damaged';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">{t.desolderTitle}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{t.desolderDesc}</p>
            </div>
          </div>
        </div>

        {/* Quick status */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Cínová slitina:</span>
          <span className="px-2.5 py-1 bg-slate-950 text-rose-300 border border-slate-800 rounded font-bold uppercase">
            {solderAlloy}
          </span>
        </div>
      </div>

      {/* Configuration & Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Board & Alloy Selectors (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 text-xs">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span>Parametry odpájecího procesu:</span>
            </h3>

            {/* Solder Alloy Selector */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Typ pájky na desce:</label>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                <button
                  onClick={() => setSolderAlloy('rohs')}
                  className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    solderAlloy === 'rohs'
                      ? 'bg-slate-800 border-sky-400 text-sky-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  RoHS Bezolovnatá (SAC305)
                </button>
                <button
                  onClick={() => setSolderAlloy('leaded')}
                  className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    solderAlloy === 'leaded'
                      ? 'bg-slate-800 border-sky-400 text-sky-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Stará Olovnatá (Sn60/Pb40)
                </button>
                <button
                  onClick={() => setSolderAlloy('chipquik')}
                  className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    solderAlloy === 'chipquik'
                      ? 'bg-slate-800 border-sky-400 text-sky-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  ChipQuik Nízkotavitelná
                </button>
              </div>
            </div>

            {/* PCB Substrate Type */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Typ plošného spoje (DPS):</label>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                <button
                  onClick={() => setBoardType('single')}
                  className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    boardType === 'single'
                      ? 'bg-slate-800 border-sky-400 text-sky-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  1-vrstvá Papír/Fenol (Hračky, stará rádia)
                </button>
                <button
                  onClick={() => setBoardType('double')}
                  className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    boardType === 'double'
                      ? 'bg-slate-800 border-sky-400 text-sky-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  2-vrstvá FR4 Standard (Arduino, zdroje)
                </button>
                <button
                  onClick={() => setBoardType('four_layer')}
                  className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                    boardType === 'four_layer'
                      ? 'bg-slate-800 border-sky-400 text-sky-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  4+ vrstvá Masivní (Základní desky PC, GPU)
                </button>
              </div>
            </div>

            {/* Ground Plane Checkbox */}
            <label className="flex items-center gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={hasGroundPlane}
                onChange={e => setHasGroundPlane(e.target.checked)}
                className="accent-rose-500"
              />
              <span className="text-slate-300">
                Přívod je napojen na masivní zemní polygon (GND Plane)
              </span>
            </label>
          </div>

          {/* Interactive Pad Thermal Dwell Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Simulátor kontaktu hrotu s ploškou:</span>
              </span>
              <span className="font-mono text-slate-400">
                {dwellTime.toFixed(1)}s / max {recs.maxDwellSec.toFixed(1)}s
              </span>
            </div>

            {/* Visual health bar */}
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-75 ${
                  padStatus === 'safe'
                    ? 'bg-emerald-400'
                    : padStatus === 'warning'
                    ? 'bg-amber-400'
                    : padStatus === 'damaged'
                    ? 'bg-rose-500 animate-pulse'
                    : 'bg-slate-700'
                }`}
                style={{
                  width: `${Math.min(100, (dwellTime / recs.maxDwellSec) * 100)}%`
                }}
              />
            </div>

            <div className="text-center pt-2">
              <button
                onMouseDown={() => setIsHoldingIron(true)}
                onMouseUp={() => setIsHoldingIron(false)}
                onTouchStart={() => setIsHoldingIron(true)}
                onTouchEnd={() => setIsHoldingIron(false)}
                className={`w-full py-3 rounded-xl font-bold text-xs select-none cursor-pointer transition-all ${
                  isHoldingIron
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-[0.98]'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isHoldingIron
                  ? '🔥 HROT PÁJKY NA PLOŠCE (DRŽTE A SLEDUJTE ČAS)'
                  : 'Stiskněte a držte pro test doby ohřevu plošky'}
              </button>
            </div>

            {padStatus === 'damaged' && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-lg text-xs text-rose-300 flex items-center gap-2 font-mono">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>VAROVÁNÍ: Ploška se odlepila od substrátu (Lifted Pad) nebo se čip upekl!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Computed Recommendations & Techniques (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center justify-between border-b border-slate-800 pb-3">
              <span>Doporučená tepelná kalibrace</span>
              <span className="text-xs font-mono text-emerald-400">OPTIMALIZOVÁNO PRO ZÁCHRANU</span>
            </h3>

            {/* Calculated Values */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">BOD TAVENÍ PÁJKY</span>
                <span className="text-slate-200 font-bold text-base">{recs.meltTemp} °C</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">TEPLOTA HROTU</span>
                <span className="text-rose-400 font-bold text-base">{recs.ironTemp} °C</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">MAX DOBA OHŘEVU</span>
                <span className="text-amber-400 font-bold text-base">{recs.maxDwellSec} sekundy</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">PŘEDEHŘEV DESKY</span>
                <span className="text-sky-400 font-bold text-base">
                  {recs.preheatTemp > 0 ? `${recs.preheatTemp} °C` : 'Není nutný'}
                </span>
              </div>
            </div>

            {/* Professional Desoldering Protocols */}
            <div className="space-y-2.5 text-xs">
              <div className="font-semibold text-slate-300">
                Ověřené postupy pro záchranu bez poškození:
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="font-semibold text-sky-400">1. Přidání čerstvé olovnaté pájky s tavidlem (Rosin Flux)</div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  Stará bezolovnatá pájka plná oxidů nechce téct. Největším trikem je přidat kousek čerstvého cínu s tavidlem na hrot pájky – obnoví se tepelný můstek a stará pájka se roztaví za zlomek sekundy.
                </p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="font-semibold text-sky-400">2. Odsávačka cínu vs. Měděný knot (Wick/Braid)</div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  Pro průchozí součástky (DIP, TO-220, kondenzátory) použijte pružinovou odsávačku. Pro dočištění otvorů před vyjmutím čipu použijte měděnou pletenku napuštěnou kalafunou.
                </p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="font-semibold text-amber-400">3. Záchrana citlivých MOS čipů (MOSFET, mikrokontroléry)</div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  Pájka musí mít uzemněný hrot (ochrana proti ESD výboji). Nepájejte všechny piny čipu za sebou – střídejte protilehlé rohy, aby se křemík stíhal ochlazovat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
