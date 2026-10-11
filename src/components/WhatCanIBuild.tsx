import React, { useState } from 'react';
import { ProjectRecipe, ScrapComponent } from '../types/scrap';
import { PROJECT_RECIPES } from '../data/projectRecipes';
import { INITIAL_SCRAP_DATABASE } from '../data/scrapDatabase';
import { Language, TRANSLATIONS } from '../i18n/translations';
import {
  Boxes,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  Wand2,
  AlertTriangle,
  Cpu,
  Plus,
  RefreshCw,
  Search
} from 'lucide-react';

interface WhatCanIBuildProps {
  lang: Language;
  userInventory: ScrapComponent[];
  onSelectProjectToBuild: (recipe: ProjectRecipe) => void;
}

export const WhatCanIBuild: React.FC<WhatCanIBuildProps> = ({
  lang,
  userInventory,
  onSelectProjectToBuild
}) => {
  const t = TRANSLATIONS[lang];

  // Available selectable items catalog
  const allSelectableParts = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; partNumber: string; category: string }>();
    INITIAL_SCRAP_DATABASE.forEach(comp => {
      map.set(comp.partNumber.toLowerCase(), {
        id: comp.id,
        name: comp.name,
        partNumber: comp.partNumber,
        category: comp.category
      });
    });
    // Add any extra items currently in user inventory
    userInventory.forEach(comp => {
      map.set(comp.partNumber.toLowerCase(), {
        id: comp.id,
        name: comp.name,
        partNumber: comp.partNumber,
        category: comp.category
      });
    });
    return Array.from(map.values());
  }, [userInventory]);

  // Initially select items that are in user's inventory
  const [selectedPartNumbers, setSelectedPartNumbers] = useState<Set<string>>(() => {
    return new Set(userInventory.map(p => p.partNumber.toLowerCase()));
  });

  const [partSearch, setPartSearch] = useState('');

  const togglePart = (partNumber: string) => {
    const p = partNumber.toLowerCase();
    setSelectedPartNumbers(prev => {
      const next = new Set(prev);
      if (next.has(p)) {
        next.delete(p);
      } else {
        next.add(p);
      }
      return next;
    });
  };

  // Quick Preset Junk Boxes
  const applyPreset = (presetName: string) => {
    if (presetName === 'dvd') {
      setSelectedPartNumbers(new Set(['pl15s-020', 'l298hn', 'atmega328p-pu', 'l7805cv', '1n4007']));
    } else if (presetName === 'vape') {
      setSelectedPartNumbers(new Set(['inr18650-22p', 'tp4056-prot', 'mod-boost-5v', 'led-white-1w']));
    } else if (presetName === 'psu') {
      setSelectedPartNumbers(new Set(['lm317t', '1n4007', 'cap-400v-470uf', 'pot-5k']));
    } else if (presetName === 'watering') {
      setSelectedPartNumbers(new Set(['ne555p', 'irfz44n', '1n4007', 'solenoid-12v']));
    }
  };

  // Compute match percentage for all recipes
  const evaluatedRecipes = React.useMemo(() => {
    return PROJECT_RECIPES.map(recipe => {
      let matchedCount = 0;
      const missingParts: string[] = [];

      recipe.requiredParts.forEach(req => {
        const isMatched =
          selectedPartNumbers.has(req.partNumber.toLowerCase()) ||
          req.alternatives.some(alt =>
            Array.from(selectedPartNumbers).some(sp => sp.includes(alt.toLowerCase()))
          );

        if (isMatched) {
          matchedCount++;
        } else {
          missingParts.push(req.componentName);
        }
      });

      const totalParts = recipe.requiredParts.length;
      const matchPercent = Math.round((matchedCount / totalParts) * 100);

      return {
        recipe,
        matchedCount,
        totalParts,
        matchPercent,
        missingParts
      };
    }).sort((a, b) => b.matchPercent - a.matchPercent);
  }, [selectedPartNumbers]);

  const filteredParts = allSelectableParts.filter(
    p =>
      p.name.toLowerCase().includes(partSearch.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(partSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-100">{t.whatCanIBuildTitle}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{t.whatCanIBuildDesc}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">{t.selectedParts}</span>
            <span className="px-2.5 py-1 bg-sky-950 text-sky-300 border border-sky-800 rounded font-bold">
              {selectedPartNumbers.size} ks / items
            </span>
          </div>
        </div>

        {/* Quick Junk Presets */}
        <div className="mt-4 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-medium">{t.quickSelectJunkBox}</span>
          <button
            onClick={() => applyPreset('dvd')}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-sky-300 border border-slate-800 rounded transition-colors cursor-pointer"
          >
            DVD Mechanika (Krokovy motor)
          </button>
          <button
            onClick={() => applyPreset('vape')}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-slate-800 rounded transition-colors cursor-pointer"
          >
            Vape Li-Po &amp; Baterie (TP4056 + USB)
          </button>
          <button
            onClick={() => applyPreset('psu')}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded transition-colors cursor-pointer"
          >
            Regulovany Zdroj (LM317 + Můstek)
          </button>
          <button
            onClick={() => applyPreset('watering')}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-purple-300 border border-slate-800 rounded transition-colors cursor-pointer"
          >
            Závlaha Květin (555 Časovač + Solenoid)
          </button>
        </div>
      </div>

      {/* Main Grid: Parts Checklist (Left) & Instant Match Projects (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Parts Multi-Select (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                {lang === 'cs' ? 'Zaškrtněte zachráněné součástky:' : 'Check salvaged parts in your box:'}
              </span>
              <button
                onClick={() => setSelectedPartNumbers(new Set())}
                className="text-[11px] text-slate-500 hover:text-rose-400 cursor-pointer"
              >
                {lang === 'cs' ? 'Odznačit vše' : 'Clear all'}
              </button>
            </div>

            {/* Search filter for parts */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={partSearch}
                onChange={e => setPartSearch(e.target.value)}
                placeholder={lang === 'cs' ? 'Hledat součástku (555, LM317, motor...)' : 'Search part...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            {/* Scrollable checklist */}
            <div className="max-h-[460px] overflow-y-auto space-y-1.5 pr-1">
              {filteredParts.map(part => {
                const isChecked = selectedPartNumbers.has(part.partNumber.toLowerCase());
                return (
                  <div
                    key={part.partNumber}
                    onClick={() => togglePart(part.partNumber)}
                    className={`p-2.5 rounded-lg border flex items-center justify-between transition-all cursor-pointer text-xs ${
                      isChecked
                        ? 'bg-sky-950/40 border-sky-600 text-slate-100 shadow-sm'
                        : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-sky-500 border-sky-400 text-slate-950'
                            : 'border-slate-700'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{part.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{part.partNumber}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {part.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Instant Match Projects Ranking (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-4">
            {evaluatedRecipes.map(item => {
              const isFullMatch = item.matchPercent === 100;
              const isHighMatch = item.matchPercent >= 60;

              return (
                <div
                  key={item.recipe.id}
                  className={`bg-slate-900 border rounded-xl p-5 shadow-lg transition-all space-y-3 ${
                    isFullMatch
                      ? 'border-emerald-500/80 bg-slate-900 shadow-emerald-500/5'
                      : isHighMatch
                      ? 'border-slate-800 hover:border-slate-700'
                      : 'border-slate-800/60 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono mb-1">
                        <span className="text-sky-400 font-semibold uppercase">
                          {item.recipe.category}
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-400">{item.recipe.difficulty.toUpperCase()}</span>
                        <span className="text-slate-600">|</span>
                        <span className="text-emerald-400 font-medium">
                          {lang === 'cs' ? `Ušetří ~${item.recipe.salvageSavingsEstimate * 24} Kč` : `Saves ~$${item.recipe.salvageSavingsEstimate}`}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-100">{item.recipe.title}</h3>
                    </div>

                    {/* Match percentage gauge badge */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold font-mono ${
                            isFullMatch
                              ? 'text-emerald-400'
                              : isHighMatch
                              ? 'text-sky-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {item.matchPercent}% {t.matchPercentage}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {item.matchedCount} / {item.totalParts} {lang === 'cs' ? 'součástek' : 'parts'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {item.recipe.description}
                  </p>

                  {/* Status Banner */}
                  {isFullMatch ? (
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/70 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.allPartsFound}</span>
                    </div>
                  ) : item.missingParts.length > 0 ? (
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                      <div className="text-[11px] font-mono text-amber-400 font-semibold">
                        {t.missingParts} ({item.missingParts.length}):
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans">
                        {item.missingParts.join(', ')}
                      </div>
                    </div>
                  ) : null}

                  {/* Action Button: 1-Click transfer to Prompt-to-Build Engine */}
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => onSelectProjectToBuild(item.recipe)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isFullMatch
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                          : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                      }`}
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>{t.generateBlueprint}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
