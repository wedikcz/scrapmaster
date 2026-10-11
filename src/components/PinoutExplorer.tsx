import React, { useState } from 'react';
import { ScrapComponent, PinDefinition } from '../types/scrap';
import { INITIAL_SCRAP_DATABASE } from '../data/scrapDatabase';
import { Language, TRANSLATIONS } from '../i18n/translations';
import {
  Compass,
  Search,
  Cpu,
  Zap,
  Info,
  Layers,
  Sparkles,
  ArrowRight,
  GripHorizontal,
  Plus,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface PinoutExplorerProps {
  lang: Language;
  onDropToBuild?: (component: ScrapComponent) => void;
  onAddToScrapBin?: (component: ScrapComponent) => void;
}

export const PinoutExplorer: React.FC<PinoutExplorerProps> = ({
  lang,
  onDropToBuild,
  onAddToScrapBin
}) => {
  const t = TRANSLATIONS[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComp, setSelectedComp] = useState<ScrapComponent>(INITIAL_SCRAP_DATABASE[0]);
  const [copiedPin, setCopiedPin] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: lang === 'cs' ? 'Všechny čipy' : 'All Components' },
    { id: 'ic', label: lang === 'cs' ? 'IC / Čipy & MCU' : 'ICs & MCUs' },
    { id: 'power', label: lang === 'cs' ? 'MOSFET & Regulátory' : 'MOSFETs & Regulators' },
    { id: 'motor', label: lang === 'cs' ? 'Budiče & Motory' : 'Drivers & Motors' },
    { id: 'sensor', label: lang === 'cs' ? 'Opto & Senzory' : 'Opto & Sensors' },
    { id: 'passive', label: lang === 'cs' ? 'Diodové můstky' : 'Rectifiers & Passives' }
  ];

  const filteredComponents = INITIAL_SCRAP_DATABASE.filter(comp => {
    const matchesCat = selectedCategory === 'all' || comp.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      comp.name.toLowerCase().includes(q) ||
      comp.partNumber.toLowerCase().includes(q) ||
      comp.packageType.toLowerCase().includes(q) ||
      comp.pinout.some(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const getPinBadgeColor = (type: PinDefinition['type']) => {
    switch (type) {
      case 'power':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'ground':
        return 'bg-slate-900 text-slate-300 border-slate-700';
      case 'input':
        return 'bg-sky-950 text-sky-300 border-sky-800';
      case 'output':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'analog':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'io':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  const handleDragStart = (e: React.DragEvent, comp: ScrapComponent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(comp));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">
                  {lang === 'cs' ? 'Pinout Explorer: Encyklopedie vývodů čipů' : 'Pinout Explorer: Searchable Hardware Library'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-bold">
                  Drag &amp; Drop Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'cs'
                  ? 'Kompletní knihovna zapojení pinů pro MOSFETy, operační zesilovače, časovače a MCU. Přetáhněte (Drag & Drop) součástku do návrháře zapojení!'
                  : 'Searchable pinout mapping for MOSFETs, OpAmps, timers, and microcontrollers. Drag and drop any component directly into Prompt-to-Build!'}
              </p>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="relative max-w-sm w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={lang === 'cs' ? 'Hledat pinout (555, LM317, IRFZ44, PWM...)' : 'Search pinout or function...'}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-sans"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-slate-800 border-sky-500 text-sky-400 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Studio: Component Selector (Left) & Visual Pinout Interactive IC (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Components Catalog with Draggable Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>{lang === 'cs' ? 'Katalog součástek (Přetáhněte myší)' : 'Component Catalog (Draggable)'}</span>
            <span className="text-slate-500 font-mono text-[11px]">{filteredComponents.length} {lang === 'cs' ? 'položek' : 'items'}</span>
          </div>

          <div className="max-h-[540px] overflow-y-auto space-y-2 pr-1">
            {filteredComponents.map(comp => {
              const isSelected = selectedComp.id === comp.id;
              return (
                <div
                  key={comp.id}
                  draggable
                  onDragStart={e => handleDragStart(e, comp)}
                  onClick={() => setSelectedComp(comp)}
                  className={`p-3.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing select-none flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-800 border-sky-500 text-slate-100 shadow-md shadow-sky-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <GripHorizontal className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-bold text-xs text-sky-300 font-mono">{comp.partNumber}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {comp.packageType}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200">{comp.name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[240px]">
                      {comp.extractedFrom}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {comp.pinCount} pinů
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (onDropToBuild) onDropToBuild(comp);
                      }}
                      className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-bold hover:bg-sky-900 transition-colors"
                      title="Vložit do návrháře zapojení"
                    >
                      + Do návrhu
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Silicon IC Package Pinout Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs font-mono text-sky-400 font-semibold uppercase">
                  {selectedComp.category} • {selectedComp.packageType}
                </div>
                <h3 className="text-lg font-bold text-slate-100 mt-0.5 font-sans">
                  {selectedComp.name} ({selectedComp.partNumber})
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  {selectedComp.extractedFrom}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onDropToBuild && (
                  <button
                    onClick={() => onDropToBuild(selectedComp)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'cs' ? 'Přidat do Prompt-to-Build' : 'Send to Prompt-to-Build'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* IC Silicon Package Visual Representation */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center relative select-none">
              <div className="text-[10px] font-mono text-slate-500 mb-2">
                TOP VIEW SILICON PACKAGE LAYOUT (Pin 1 Indicator)
              </div>

              {/* Physical Dual In-line Package (DIP) or Transistor Graphic */}
              <div className="relative bg-slate-900 border-2 border-slate-700 rounded-lg px-8 py-4 shadow-2xl flex flex-col items-center justify-center min-w-[220px]">
                {/* Notch on Pin 1 side */}
                <div className="absolute top-0 w-6 h-3 bg-slate-950 border-b-2 border-slate-700 rounded-b-full" />
                <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-slate-700" title="Pin 1 debossed dot" />

                <div className="font-mono font-bold text-sm text-slate-200 mt-2">{selectedComp.partNumber}</div>
                <div className="text-[10px] font-mono text-slate-500">{selectedComp.packageType}</div>
              </div>
            </div>

            {/* Full Pinout Specification Table */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Tabulka vývodů a signálů (Pinout):</span>
                <span className="text-[11px] font-mono text-slate-500">
                  {selectedComp.pinout.length} Definovaných pinů
                </span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {selectedComp.pinout.map(p => (
                  <div
                    key={p.pin}
                    onClick={() => {
                      navigator.clipboard.writeText(`Pin ${p.pin}: ${p.name} - ${p.desc}`);
                      setCopiedPin(String(p.pin));
                      setTimeout(() => setCopiedPin(null), 1500);
                    }}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800/80 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-slate-400 font-bold bg-slate-900 py-0.5 rounded border border-slate-800">
                        #{p.pin}
                      </span>
                      <span className="font-bold text-slate-100">{p.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${getPinBadgeColor(p.type)}`}>
                        {p.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px] truncate max-w-[200px]" title={p.desc}>
                        {p.desc}
                      </span>
                      {copiedPin === String(p.pin) ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multimeter Probing Procedure */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold font-mono">
                <Zap className="w-3.5 h-3.5" />
                <span>Multimeter Testing Guide:</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
                {selectedComp.testProcedure}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
