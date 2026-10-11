import React from 'react';
import {
  Wand2,
  Boxes,
  Usb,
  Eye,
  Film,
  Package,
  ShieldAlert,
  Activity,
  Terminal,
  Cpu,
  Zap,
  FlaskConical,
  Globe,
  Image as ImageIcon,
  Box,
  Tag,
  Flame,
  Sparkles,
  Bot,
  Compass
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

export type ActiveNavTab =
  | 'copilot'
  | 'pinout_explorer'
  | 'cost_savings'
  | 'mastering'
  | 'build'
  | 'what_can_i_build'
  | 'web_serial'
  | 'cad_3d'
  | 'desolder'
  | 'labels'
  | 'vision'
  | 'video'
  | 'inventory'
  | 'safety'
  | 'science'
  | 'search'
  | 'image_studio'
  | 'agents'
  | 'deploy';

interface HeaderProps {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  salvageValue: number;
  partsCount: number;
  lang: Language;
  onToggleLang: (newLang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  salvageValue,
  partsCount,
  lang,
  onToggleLang
}) => {
  const t = TRANSLATIONS[lang];

  const navItems: { id: ActiveNavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'copilot', label: t.navCopilot, icon: <Bot className="w-4 h-4 text-indigo-400" /> },
    { id: 'pinout_explorer', label: t.navPinoutExplorer, icon: <Compass className="w-4 h-4 text-sky-400" /> },
    { id: 'cost_savings', label: t.navCostSavings, icon: <Zap className="w-4 h-4 text-emerald-400" /> },
    { id: 'mastering', label: t.navMastering, icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'build', label: t.navBuild, icon: <Wand2 className="w-4 h-4" /> },
    { id: 'what_can_i_build', label: t.navWhatCanIBuild, icon: <Boxes className="w-4 h-4 text-emerald-400" /> },
    { id: 'web_serial', label: t.navWebSerial, icon: <Usb className="w-4 h-4 text-sky-400" /> },
    { id: 'cad_3d', label: t.navCad3d, icon: <Box className="w-4 h-4 text-purple-400" /> },
    { id: 'desolder', label: t.navDesolder, icon: <Flame className="w-4 h-4 text-rose-400" /> },
    { id: 'labels', label: t.navLabels, icon: <Tag className="w-4 h-4 text-amber-400" /> },
    { id: 'vision', label: t.navVision, icon: <Eye className="w-4 h-4" /> },
    { id: 'video', label: t.navVideo, icon: <Film className="w-4 h-4" /> },
    { id: 'inventory', label: `${t.navInventory} (${partsCount})`, icon: <Package className="w-4 h-4" /> },
    { id: 'safety', label: t.navSafety, icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'science', label: t.navScience, icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'search', label: t.navSearch, icon: <Globe className="w-4 h-4" /> },
    { id: 'image_studio', label: t.navImageStudio, icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'agents', label: t.navAgents, icon: <Activity className="w-4 h-4" /> },
    { id: 'deploy', label: t.navDeploy, icon: <Terminal className="w-4 h-4" /> }
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top Branding Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 p-0.5 shadow-lg shadow-sky-500/10 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-100 tracking-tight">
                  {t.appTitle}
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-sky-950 text-sky-300 border border-sky-800 rounded">
                  {t.titanBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Telemetry & Language Switcher */}
          <div className="flex items-center gap-2.5 text-xs font-mono">
            {/* Language Switcher Button */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => onToggleLang('cs')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  lang === 'cs'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Přepnout do češtiny"
              >
                <span>🇨🇿</span>
                <span>CZ</span>
              </button>
              <button
                onClick={() => onToggleLang('en')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  lang === 'en'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to English"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.localEngineOnline}</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-500">{t.salvageYield}</span>
              <span className="text-emerald-400 font-bold">
                {lang === 'cs' ? `${(salvageValue * 24).toFixed(0)} Kč` : `$${salvageValue.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 text-xs border-t border-slate-900 pt-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                activeTab === item.id
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
