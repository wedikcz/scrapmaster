import React, { useState } from 'react';
import { ScrapComponent } from '../types/scrap';
import { Language, TRANSLATIONS } from '../i18n/translations';
import {
  Printer,
  QrCode,
  Tag,
  Check,
  Layers,
  Copy,
  Download,
  Filter
} from 'lucide-react';

interface StorageLabelGeneratorProps {
  lang: Language;
  inventory: ScrapComponent[];
}

export const StorageLabelGenerator: React.FC<StorageLabelGeneratorProps> = ({
  lang,
  inventory
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    return new Set(inventory.slice(0, 6).map(i => i.id));
  });
  const [labelSize, setLabelSize] = useState<'small' | 'standard'>('small');

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(inventory.map(i => i.id)));
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedItems = inventory.filter(i => selectedIds.has(i.id));

  // Generates clean SVG QR Code pattern
  const renderQrSvg = (text: string) => {
    return (
      <svg viewBox="0 0 40 40" className="w-10 h-10 shrink-0 bg-white p-0.5 rounded">
        {/* Finder patterns */}
        <rect x="2" y="2" width="10" height="10" fill="#000" />
        <rect x="4" y="4" width="6" height="6" fill="#fff" />
        <rect x="5.5" y="5.5" width="3" height="3" fill="#000" />

        <rect x="28" y="2" width="10" height="10" fill="#000" />
        <rect x="30" y="4" width="6" height="6" fill="#fff" />
        <rect x="31.5" y="5.5" width="3" height="3" fill="#000" />

        <rect x="2" y="28" width="10" height="10" fill="#000" />
        <rect x="4" y="30" width="6" height="6" fill="#fff" />
        <rect x="5.5" y="31.5" width="3" height="3" fill="#000" />

        {/* Data dots */}
        <rect x="16" y="6" width="3" height="3" fill="#000" />
        <rect x="22" y="6" width="3" height="3" fill="#000" />
        <rect x="15" y="15" width="4" height="4" fill="#000" />
        <rect x="22" y="16" width="4" height="3" fill="#000" />
        <rect x="16" y="24" width="3" height="4" fill="#000" />
        <rect x="24" y="26" width="4" height="4" fill="#000" />
        <rect x="30" y="18" width="4" height="4" fill="#000" />
        <rect x="6" y="18" width="4" height="4" fill="#000" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - hidden during actual printing */}
      <div className="print:hidden bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">{t.labelsTitle}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{t.labelsDesc}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setLabelSize('small')}
              className={`px-2.5 py-1 rounded font-mono ${
                labelSize === 'small' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Krabička 45&times;25mm
            </button>
            <button
              onClick={() => setLabelSize('standard')}
              className={`px-2.5 py-1 rounded font-mono ${
                labelSize === 'standard' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Štítek 70&times;35mm
            </button>
          </div>

          <button
            onClick={selectAll}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium cursor-pointer"
          >
            Označit vše ({inventory.length})
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printLabels} ({selectedItems.length})</span>
          </button>
        </div>
      </div>

      {/* Checklist Filter (hidden in print) */}
      <div className="print:hidden bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-2">
        <div className="text-xs font-semibold text-slate-300">
          Vyberte součástky pro tisk štítků:
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {inventory.map(comp => {
            const isChecked = selectedIds.has(comp.id);
            return (
              <button
                key={comp.id}
                onClick={() => toggleSelect(comp.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isChecked
                    ? 'bg-sky-950 text-sky-200 border-sky-600'
                    : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isChecked ? 'bg-sky-400' : 'bg-slate-600'}`} />
                <span>{comp.partNumber}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Printable Sheet View */}
      <div className="bg-slate-900 print:bg-white border border-slate-800 print:border-none rounded-xl p-5 shadow-2xl">
        <div className="print:hidden text-xs font-mono text-slate-400 mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <span>Náhled tiskového archu (Tiskne se s vysokým kontrastem):</span>
          <span>{selectedItems.length} připraveno</span>
        </div>

        {/* Labels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 print:grid-cols-3 gap-3">
          {selectedItems.map(item => (
            <div
              key={item.id}
              className={`border rounded-lg p-2.5 flex items-center justify-between gap-2.5 transition-all ${
                labelSize === 'small' ? 'h-24' : 'h-28'
              } bg-slate-950 print:bg-white text-slate-100 print:text-black border-slate-800 print:border-black`}
            >
              {/* Text Info */}
              <div className="flex-1 space-y-0.5 overflow-hidden font-mono">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs truncate print:text-black text-sky-300">
                    {item.partNumber}
                  </span>
                  <span className="text-[9px] px-1 bg-slate-800 print:bg-gray-200 print:text-black text-slate-400 rounded">
                    {item.packageType}
                  </span>
                </div>
                <div className="text-[10px] font-sans truncate font-medium print:text-black text-slate-200">
                  {item.name}
                </div>
                {/* Pinout snippet */}
                <div className="text-[9px] text-slate-400 print:text-gray-700 truncate">
                  Pins: {item.pinout.map(p => p.name).join(' | ') || `${item.pinCount} pins`}
                </div>
                {/* Extracted source note */}
                <div className="text-[8px] text-slate-500 print:text-gray-600 truncate">
                  Zdroj: {item.extractedFrom}
                </div>
              </div>

              {/* QR Code Icon with Part ID */}
              <div className="text-center shrink-0">
                {renderQrSvg(item.partNumber)}
                <span className="text-[7px] font-mono block mt-0.5 print:text-black text-slate-400">
                  SCRAP-AI
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
