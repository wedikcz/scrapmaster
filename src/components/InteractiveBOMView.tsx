import React, { useState } from 'react';
import { ProjectRecipe, ScrapComponent } from '../types/scrap';
import { Language, TRANSLATIONS } from '../i18n/translations';
import {
  ListFilter,
  Download,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Share2,
  FileSpreadsheet,
  FileCode,
  DollarSign,
  Copy,
  Check,
  Search
} from 'lucide-react';

interface InteractiveBOMViewProps {
  recipe: ProjectRecipe;
  userInventory: ScrapComponent[];
  lang: Language;
  onAddFoundPart?: (part: ScrapComponent) => void;
}

export const InteractiveBOMView: React.FC<InteractiveBOMViewProps> = ({
  recipe,
  userInventory,
  lang,
  onAddFoundPart
}) => {
  const t = TRANSLATIONS[lang];
  const [filterMode, setFilterMode] = useState<'all' | 'missing' | 'found'>('all');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Sourcing link resolver
  const getSourcingLink = (partName: string, partNumber: string) => {
    const query = encodeURIComponent(`${partNumber} ${partName}`);
    return `https://www.digikey.com/en/products/result?keywords=${query}`;
  };

  const getAlternativeSourcingLink = (partNumber: string) => {
    const query = encodeURIComponent(partNumber);
    return `https://www.mouser.com/c/?q=${query}`;
  };

  // Price estimator for parts
  const getPartPrice = (part: any) => {
    if (part.estUnitPrice && part.estUnitPrice > 0) return part.estUnitPrice;
    if (part.category === 'motor') return 14.5;
    if (part.category === 'power') return 6.0;
    if (part.category === 'ic') return 3.2;
    return 0.8;
  };

  const filteredParts = recipe.requiredParts.filter(part => {
    if (filterMode === 'missing') return !part.inInventory;
    if (filterMode === 'found') return part.inInventory;
    return true;
  });

  const totalCostMissing = recipe.requiredParts
    .filter(p => !p.inInventory)
    .reduce((acc, p) => acc + getPartPrice(p) * p.quantity, 0);

  // Export to CSV
  const handleExportCSV = () => {
    let csv = 'Part Number,Component Name,Category,Quantity,In Scrap Bin,Estimated Retail (USD),DigiKey Sourcing URL\n';
    recipe.requiredParts.forEach(p => {
      const url = p.sourcingUrl || getSourcingLink(p.componentName, p.partNumber);
      const inBin = p.inInventory ? 'YES' : 'NO';
      const price = getPartPrice(p);
      csv += `"${p.partNumber}","${p.componentName}","${p.category}",${p.quantity},"${inBin}",${price},"${url}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.id}_interactive_bom.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to JSON
  const handleExportJSON = () => {
    const data = {
      projectTitle: recipe.title,
      exportedAt: new Date().toISOString(),
      currency: 'USD',
      totalEstimatedCostMissing: totalCostMissing,
      bom: recipe.requiredParts.map(p => ({
        partNumber: p.partNumber,
        componentName: p.componentName,
        category: p.category,
        quantity: p.quantity,
        inInventory: p.inInventory,
        alternatives: p.alternatives,
        estimatedUnitPrice: getPartPrice(p),
        sourcingLinks: {
          digikey: getSourcingLink(p.componentName, p.partNumber),
          mouser: getAlternativeSourcingLink(p.partNumber)
        }
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.id}_interactive_bom.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 text-xs font-mono">
      {/* Top action toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterMode === 'all' ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'cs' ? `Všechny díly (${recipe.requiredParts.length})` : `All Parts (${recipe.requiredParts.length})`}
          </button>
          <button
            onClick={() => setFilterMode('missing')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterMode === 'missing' ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'cs'
              ? `Chybějící k nákupu (${recipe.requiredParts.filter(p => !p.inInventory).length})`
              : `Missing to Buy (${recipe.requiredParts.filter(p => !p.inInventory).length})`}
          </button>
          <button
            onClick={() => setFilterMode('found')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterMode === 'found' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'cs'
              ? `V šrotovišti (${recipe.requiredParts.filter(p => p.inInventory).length})`
              : `In Scrap Bin (${recipe.requiredParts.filter(p => p.inInventory).length})`}
          </button>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer font-bold"
            title={lang === 'cs' ? 'Stáhnout kusovník jako CSV tabulku' : 'Download parts list as CSV'}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer font-bold"
            title={lang === 'cs' ? 'Exportovat strukturovaný JSON pro ERP/EDA' : 'Export structured JSON for EDA/ERP'}
          >
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Missing Parts Cost Alert */}
      {totalCostMissing > 0 && (
        <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {lang === 'cs' ? 'Odhadovaná cena dokoupení chybějících dílů: ' : 'Estimated sourcing cost for missing parts: '}
              <strong className="text-amber-300 font-bold">
                ${totalCostMissing.toFixed(2)} USD (~{Math.round(totalCostMissing * 23.5)} Kč)
              </strong>
            </span>
          </div>
          <span className="text-[11px] text-amber-400/80">
            {lang === 'cs' ? 'Odkazy na DigiKey a Mouser níže' : 'Live DigiKey & Mouser links below'}
          </span>
        </div>
      )}

      {/* Parts Table */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto shadow-xl">
        <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Part #</th>
              <th className="py-2.5 px-4">{lang === 'cs' ? 'Název součástky & Náhrady' : 'Component Name & Alternatives'}</th>
              <th className="py-2.5 px-2 text-center">{lang === 'cs' ? 'Počet' : 'Qty'}</th>
              <th className="py-2.5 px-3 text-right">{lang === 'cs' ? 'Cena ks' : 'Unit Price'}</th>
              <th className="py-2.5 px-4 text-center">{lang === 'cs' ? 'Nákupní Odkazy (Sourcing)' : 'Sourcing Links'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredParts.map((part, idx) => {
              const digiKeyUrl = part.sourcingUrl || getSourcingLink(part.componentName, part.partNumber);
              const mouserUrl = getAlternativeSourcingLink(part.partNumber);
              const estPrice = getPartPrice(part);

              return (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3">
                    {part.inInventory ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 w-max font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{lang === 'cs' ? 'V koši' : 'In Bin'}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1 w-max font-bold">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>{lang === 'cs' ? 'Koupit' : 'Missing'}</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-bold text-sky-300">
                    {part.partNumber}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="font-semibold text-slate-200">{part.componentName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {lang === 'cs' ? 'Náhrady: ' : 'Alts: '}{part.alternatives.join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-slate-200">
                    {part.quantity}×
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 font-mono">
                    ${estPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={digiKeyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-slate-900 hover:bg-sky-600 hover:text-slate-950 text-sky-400 border border-slate-800 rounded text-[11px] flex items-center gap-1 transition-colors"
                        title="Otevřít na DigiKey"
                      >
                        <span>DigiKey</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={mouserUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-slate-900 hover:bg-amber-600 hover:text-slate-950 text-amber-400 border border-slate-800 rounded text-[11px] flex items-center gap-1 transition-colors"
                        title="Otevřít na Mouser"
                      >
                        <span>Mouser</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
