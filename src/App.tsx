/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScrapComponent, ProjectRecipe } from './types/scrap';
import { INITIAL_SCRAP_DATABASE } from './data/scrapDatabase';
import { PROJECT_RECIPES } from './data/projectRecipes';
import { Header, ActiveNavTab } from './components/Header';
import { PromptToBuild } from './components/PromptToBuild';
import { WhatCanIBuild } from './components/WhatCanIBuild';
import { WebSerialTerminal } from './components/WebSerialTerminal';
import { VisionInspector } from './components/VisionInspector';
import { InverseVideoLab } from './components/InverseVideoLab';
import { ScrapInventory } from './components/ScrapInventory';
import { SafetyDiagnosticScanner } from './components/SafetyDiagnosticScanner';
import { ScienceMaterialsLab } from './components/ScienceMaterialsLab';
import { SearchGroundingPanel } from './components/SearchGroundingPanel';
import { HardwareImageStudio } from './components/HardwareImageStudio';
import { ParametricCadGenerator } from './components/ParametricCadGenerator';
import { DesolderingAdvisor } from './components/DesolderingAdvisor';
import { StorageLabelGenerator } from './components/StorageLabelGenerator';
import { TitanAgentMonitor } from './components/TitanAgentMonitor';
import { LocalDeploymentGuide } from './components/LocalDeploymentGuide';
import { CostCalculator } from './components/CostCalculator';
import { DIYMasteringSuite } from './components/DIYMasteringSuite';
import { PinoutExplorer } from './components/PinoutExplorer';
import { AutonomousGenAICopilot } from './components/AutonomousGenAICopilot';
import { Language, TRANSLATIONS } from './i18n/translations';
import { Check, Cpu, ShieldCheck } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'scrapmaster_inventory_v1';
const LANG_STORAGE_KEY = 'scrapmaster_lang_v1';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'cs' || saved === 'en') return saved;
    } catch {}
    return 'cs'; // Default to Czech for bastlíře
  });

  const [inventory, setInventory] = useState<ScrapComponent[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_SCRAP_DATABASE;
  });

  const [activeTab, setActiveTab] = useState<ActiveNavTab>('build');
  const [activeProject, setActiveProject] = useState<ProjectRecipe | null>(null);
  const [droppedPartForBuild, setDroppedPartForBuild] = useState<ScrapComponent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const t = TRANSLATIONS[lang];

  // Sync inventory
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inventory));
    } catch {}
  }, [inventory]);

  // Sync language
  const handleToggleLang = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {}
    showToast(newLang === 'cs' ? 'Jazyk přepnut na češtinu 🇨🇿' : 'Language switched to English 🇬🇧');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleAddPart = (part: ScrapComponent) => {
    setInventory(prev => {
      const existing = prev.find(p => p.id === part.id || p.partNumber === part.partNumber);
      if (existing) {
        return prev.map(p =>
          p.id === existing.id ? { ...p, quantity: p.quantity + (part.quantity || 1) } : p
        );
      }
      return [part, ...prev];
    });
    showToast(lang === 'cs' ? `Přidáno "${part.name}" do šrotoviště!` : `Added "${part.name}" to Scrap Bin!`);
  };

  const handleRemovePart = (id: string) => {
    setInventory(prev => prev.filter(p => p.id !== id));
    showToast(lang === 'cs' ? 'Součástka odebrána ze skladu.' : 'Component removed from inventory.');
  };

  const handleSelectForBuild = (part: ScrapComponent) => {
    setActiveTab('build');
    showToast(lang === 'cs' ? `Generuji zapojení pro ${part.name}...` : `Synthesizing circuit ideas for ${part.name}...`);
  };

  const handleRepurposeBuild = (idea: any) => {
    setActiveTab('build');
    showToast(lang === 'cs' ? `Generuji hardware pro "${idea.title}"...` : `Synthesizing custom hardware for "${idea.title}"...`);
  };

  const handleLoadProjectBlueprint = (projectId: string) => {
    const found = PROJECT_RECIPES.find(p => p.id === projectId);
    if (found) {
      setActiveProject(found);
      setActiveTab('build');
      showToast(lang === 'cs' ? `Načten projekt "${found.title}" do návrháře!` : `Loaded "${found.title}" into Prompt-to-Build!`);
    }
  };

  const handleSelectFromWhatCanIBuild = (recipe: ProjectRecipe) => {
    setActiveProject(recipe);
    setActiveTab('build');
    showToast(lang === 'cs' ? `Načteno kompletní schéma a firmware pro "${recipe.title}"!` : `Loaded blueprint & firmware for "${recipe.title}"!`);
  };

  const totalSalvageValue = inventory.reduce(
    (acc, curr) => acc + curr.salvageValueEstimate * curr.quantity,
    0
  );
  const totalPartsCount = inventory.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-sky-950/95 border border-sky-600/80 text-sky-200 rounded-xl shadow-2xl text-xs font-mono backdrop-blur transition-all animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-sky-400 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        salvageValue={totalSalvageValue}
        partsCount={totalPartsCount}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Dynamic Main Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'copilot' && (
          <AutonomousGenAICopilot
            lang={lang}
            inventory={inventory}
            activeProject={activeProject}
            onNavigateTab={setActiveTab}
            onSetBuildPrompt={(promptText) => {
              setActiveTab('build');
              showToast(
                lang === 'cs'
                  ? `Zadání načteno do Prompt-to-Build!`
                  : `Prompt loaded into Prompt-to-Build!`
              );
            }}
          />
        )}

        {activeTab === 'pinout_explorer' && (
          <PinoutExplorer
            lang={lang}
            onDropToBuild={(part) => {
              setDroppedPartForBuild(part);
              setActiveTab('build');
              showToast(
                lang === 'cs'
                  ? `Pinout ${part.partNumber} vložen do návrhu zapojení!`
                  : `Pinout ${part.partNumber} injected into Prompt-to-Build!`
              );
            }}
            onAddToScrapBin={handleAddPart}
          />
        )}

        {activeTab === 'cost_savings' && (
          <CostCalculator
            inventory={inventory}
            lang={lang}
            onSelectForBuild={handleSelectForBuild}
          />
        )}

        {activeTab === 'mastering' && (
          <DIYMasteringSuite
            lang={lang}
            inventory={inventory}
            onAddPart={handleAddPart}
            onSendToBuild={(promptText) => {
              setActiveTab('build');
              showToast(lang === 'cs' ? `Zadání odesláno: "${promptText.slice(0, 32)}..."` : `Prompt dispatched: "${promptText.slice(0, 32)}..."`);
            }}
          />
        )}

        {activeTab === 'build' && (
          <PromptToBuild
            userInventory={inventory}
            onAddPartToInventory={handleAddPart}
            activeProject={activeProject}
            droppedPart={droppedPartForBuild}
            lang={lang}
          />
        )}

        {activeTab === 'what_can_i_build' && (
          <WhatCanIBuild
            lang={lang}
            userInventory={inventory}
            onSelectProjectToBuild={handleSelectFromWhatCanIBuild}
          />
        )}

        {activeTab === 'web_serial' && (
          <WebSerialTerminal lang={lang} />
        )}

        {activeTab === 'cad_3d' && (
          <ParametricCadGenerator lang={lang} />
        )}

        {activeTab === 'desolder' && (
          <DesolderingAdvisor lang={lang} />
        )}

        {activeTab === 'labels' && (
          <StorageLabelGenerator lang={lang} inventory={inventory} />
        )}

        {activeTab === 'vision' && (
          <VisionInspector
            onAddCompToInventory={handleAddPart}
            onSendToBuildPrompt={handleSelectForBuild}
          />
        )}

        {activeTab === 'video' && (
          <InverseVideoLab
            onLoadProject={handleLoadProjectBlueprint}
            onSendToBuild={handleRepurposeBuild}
          />
        )}

        {activeTab === 'inventory' && (
          <ScrapInventory
            inventory={inventory}
            onAddPart={handleAddPart}
            onRemovePart={handleRemovePart}
            onSelectForBuild={handleSelectForBuild}
            onImportInventory={imported => setInventory(imported)}
          />
        )}

        {activeTab === 'safety' && <SafetyDiagnosticScanner />}
        {activeTab === 'science' && <ScienceMaterialsLab />}
        {activeTab === 'search' && <SearchGroundingPanel />}
        {activeTab === 'image_studio' && <HardwareImageStudio />}

        {activeTab === 'agents' && (
          <TitanAgentMonitor
            onAutoHealTriggered={() =>
              showToast(lang === 'cs' ? 'Titan Autonomní diagnostika zkontrolovala obvod!' : 'Titan Self-Healing Diagnostic verified circuit!')
            }
          />
        )}

        {activeTab === 'deploy' && <LocalDeploymentGuide />}
      </main>

      {/* Industrial Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>ScrapMaster AI v1.5.0</span>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <span>MANUS-TITAN-CORE</span>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <span className="text-emerald-400">{t.zeroPaidApis}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.localPrivate}</span>
            </span>
            <span aria-hidden="true" className="text-slate-800">|</span>
            <span>{t.syncedStorage}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
