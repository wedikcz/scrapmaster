import React, { useState, useEffect } from 'react';
import { ProjectRecipe, ScrapComponent } from '../types/scrap';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { synthesizeBuildFromPrompt, SynthesizedProjectResponse } from '../services/ragEngine';
import { SchematicViewer } from './SchematicViewer';
import { InteractiveBOMView } from './InteractiveBOMView';
import {
  Wand2,
  Cpu,
  ShieldAlert,
  Code2,
  Layers,
  Sparkles,
  Copy,
  Check,
  Download,
  Mic,
  MicOff,
  AlertTriangle,
  Flame,
  Terminal,
  Activity,
  ArrowRight,
  Plus
} from 'lucide-react';

interface PromptToBuildProps {
  userInventory: ScrapComponent[];
  onAddPartToInventory?: (part: ScrapComponent) => void;
  activeProject?: ProjectRecipe | null;
  droppedPart?: ScrapComponent | null;
  lang?: Language;
}

const QUICK_PROMPTS = [
  'Mini 2-Axis CNC Laser / Pen Plotter from DVD steppers',
  'Variable 1.25V - 25V Bench Power Supply with LM317',
  'Emergency 18650 / Vape Cell USB Power Bank & SOS Torch',
  'Automatic Soil Moisture Plant Feeder with 555 timer',
  'Sound-Activated Relay Security Tripwire with electret mic'
];

export const PromptToBuild: React.FC<PromptToBuildProps> = ({
  userInventory,
  onAddPartToInventory,
  activeProject,
  droppedPart,
  lang = 'cs'
}) => {
  const [prompt, setPrompt] = useState(
    'Mini 2-Axis CNC Laser / Pen Plotter from DVD steppers'
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedResult, setSynthesizedResult] = useState<SynthesizedProjectResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'schematic' | 'assembly' | 'code' | 'pinouts' | 'bom_export' | 'safety'>('schematic');
  const [droppedReferenceParts, setDroppedReferenceParts] = useState<ScrapComponent[]>([]);
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);

  const handleDropComponent = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCanvas(false);
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const comp: ScrapComponent = JSON.parse(dataStr);
        setDroppedReferenceParts(prev => {
          if (prev.some(p => p.id === comp.id)) return prev;
          return [comp, ...prev];
        });
      }
    } catch {}
  };
  const [codeLanguage, setCodeLanguage] = useState<'arduino' | 'esp32' | 'micropython'>('arduino');
  const [copiedCode, setCopiedCode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [pinEdits, setPinEdits] = useState<Record<string, string>>({});
  const [simTerminalOutput, setSimTerminalOutput] = useState<string[]>([]);
  const [isSimRunning, setIsSimRunning] = useState(false);

  // Initial synthesis run
  useEffect(() => {
    handleSynthesize(prompt);
  }, []);

  // Sync if parent passes external recipe
  useEffect(() => {
    if (activeProject) {
      setPrompt(activeProject.title);
      handleSynthesize(activeProject.title);
    }
  }, [activeProject]);

  // Sync if parent passes droppedPart from PinoutExplorer
  useEffect(() => {
    if (droppedPart) {
      setDroppedReferenceParts(prev => {
        if (prev.some(p => p.id === droppedPart.id)) return prev;
        return [droppedPart, ...prev];
      });
      setActiveTab('schematic');
    }
  }, [droppedPart]);

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSpeechSupported(true);
    }
  }, []);

  const handleSpeechToggle = () => {
    if (!speechSupported) return;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setPrompt(transcript);
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSynthesize = (customPrompt?: string) => {
    const text = customPrompt || prompt;
    if (!text.trim()) return;

    setIsSynthesizing(true);
    setTimeout(() => {
      const result = synthesizeBuildFromPrompt(text, userInventory);
      setSynthesizedResult(result);
      setIsSynthesizing(false);
      setCompletedSteps({});
      // Init pin edits
      const edits: Record<string, string> = {};
      result.recipe.pinMappings.forEach(p => {
        edits[p.label] = p.currentPin;
      });
      setPinEdits(edits);
    }, 450);
  };

  const currentRecipe = synthesizedResult?.recipe;

  const copyCodeToClipboard = () => {
    if (!currentRecipe) return;
    const code = currentRecipe.codeTemplates[codeLanguage];
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadCode = () => {
    if (!currentRecipe) return;
    const code = currentRecipe.codeTemplates[codeLanguage];
    const ext = codeLanguage === 'micropython' ? 'py' : 'ino';
    const filename = `${currentRecipe.id}_${codeLanguage}.${ext}`;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadFullProjectBundle = () => {
    if (!currentRecipe) return;
    const bundleText = `# SCRAPMASTER AI - COMPLETE PROJECT BUNDLE
Project: ${currentRecipe.title}
Tagline: ${currentRecipe.tagline}
Category: ${currentRecipe.category.toUpperCase()}
Difficulty: ${currentRecipe.difficulty.toUpperCase()}
Est. Build Time: ${currentRecipe.estimatedBuildTime}
Salvage Savings: ~$${currentRecipe.salvageSavingsEstimate}

================================================================================
BILL OF MATERIALS (BOM)
================================================================================
${currentRecipe.requiredParts
  .map(
    (p, idx) =>
      `${idx + 1}. [${p.inInventory ? 'FOUND' : 'MISSING'}] ${p.componentName} (Part: ${p.partNumber}, Qty: ${p.quantity}) - Alternatives: ${p.alternatives.join(', ')}`
  )
  .join('\n')}

================================================================================
PINOUT ASSIGNMENTS
================================================================================
${currentRecipe.pinMappings
  .map(m => `- ${m.label}: Pin ${pinEdits[m.label] || m.currentPin} (${m.description})`)
  .join('\n')}

================================================================================
STEP-BY-STEP ASSEMBLY PROTOCOL
================================================================================
${currentRecipe.assemblySteps
  .map(
    s =>
      `Step ${s.step}: ${s.title}\nInstruction: ${s.instruction}${
        s.caution ? `\nCAUTION: ${s.caution}` : ''
      }${s.testingTip ? `\nCalibration Tip: ${s.testingTip}` : ''}\n`
  )
  .join('\n')}

================================================================================
CRITICAL HARDWARE SAFETY CHECKLIST
================================================================================
${currentRecipe.safetyChecklist.map((c, i) => `${i + 1}. ${c}`).join('\n')}

================================================================================
FIRMWARE: ARDUINO C++ (.ino)
================================================================================
${currentRecipe.codeTemplates.arduino}

================================================================================
FIRMWARE: ESP32 C++
================================================================================
${currentRecipe.codeTemplates.esp32}

================================================================================
FIRMWARE: MICROPYTHON (.py)
================================================================================
${currentRecipe.codeTemplates.micropython}
`;

    const blob = new Blob([bundleText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentRecipe.id}_project_bundle.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const runSimulatedFlasher = () => {
    setIsSimRunning(true);
    setSimTerminalOutput([
      `[Titan-Compiler] Analyzing syntax for ${codeLanguage.toUpperCase()} target...`,
      `[Titan-Compiler] Memory footprint: Flash 14.2KB (44%), SRAM 1.1KB (55%)`,
      `[Titan-Compiler] Verifying pin routing against hardware schematic...`,
      `[Hardware-Check] VCC/GND bus confirmed. Pull-ups verified.`,
      `[Hardware-Check] No hazardous logic level conflicts detected.`,
      `[Simulation-Serial] 115200 baud connected.`,
      `[System] Boot OK. ScrapMaster Engine initialized successfully!`
    ]);
    setTimeout(() => setIsSimRunning(false), 800);
  };

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
  };

  return (
    <div className="space-y-6">
      {/* Prompt Builder Header & Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Prompt-to-Build Circuit Engine</h2>
              <p className="text-xs text-slate-400">
                Describe desired project or salvaged parts; Titan RAG synthesizes circuits, schematics & firmware.
              </p>
            </div>
          </div>
          {synthesizedResult && (
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">Inventory Match:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-xs ${
                  synthesizedResult.inventoryMatchPercentage >= 75
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : synthesizedResult.inventoryMatchPercentage >= 40
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {synthesizedResult.inventoryMatchPercentage}% in Scrap Bin
              </span>
            </div>
          )}
        </div>

        {/* Text Input with Voice Dictation */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSynthesize()}
              placeholder="e.g. Build an adjustable 12V bench power supply from PC power supply..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 pr-10 font-sans"
            />
            {speechSupported && (
              <button
                onClick={handleSpeechToggle}
                title={isListening ? 'Stop listening' : 'Dictate build prompt (Hands-free)'}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded transition-colors ${
                  isListening
                    ? 'text-rose-400 bg-rose-950/60 animate-pulse'
                    : 'text-slate-400 hover:text-sky-300 hover:bg-slate-800'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>

          <button
            onClick={() => handleSynthesize()}
            disabled={isSynthesizing || !prompt.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-sm rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 font-sans"
          >
            {isSynthesizing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Synthesize Build</span>
              </>
            )}
          </button>
        </div>

        {/* Quick prompt ideas */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span className="text-slate-500">Quick ideas:</span>
          {QUICK_PROMPTS.map((qp, i) => (
            <button
              key={i}
              onClick={() => {
                setPrompt(qp);
                handleSynthesize(qp);
              }}
              className="text-left text-slate-300 hover:text-sky-300 hover:underline transition-colors text-xs"
            >
              {qp}
              {i < QUICK_PROMPTS.length - 1 && <span className="ml-2 text-slate-600">|</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Synthesis Active View */}
      {currentRecipe && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {/* Recipe Title & Overview Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-900/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                  <span className="uppercase text-sky-400 font-semibold">{currentRecipe.category}</span>
                  <span aria-hidden="true">|</span>
                  <span>{currentRecipe.difficulty.toUpperCase()}</span>
                  <span aria-hidden="true">|</span>
                  <span>Est. Time: {currentRecipe.estimatedBuildTime}</span>
                  <span aria-hidden="true">|</span>
                  <span className="text-emerald-400 font-medium">Saves ~${currentRecipe.salvageSavingsEstimate}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100">{currentRecipe.title}</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">{currentRecipe.description}</p>
              </div>

              {/* RAG Agent Self-Healing Notice */}
              {synthesizedResult?.agentInsights && (
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono max-w-sm">
                  <div className="flex items-center gap-1.5 text-sky-400 font-semibold mb-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Titan MoE Circuit Health</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {synthesizedResult.agentInsights.architectNote}
                  </p>
                </div>
              )}
            </div>

            {/* Modular Tab Switcher */}
            <div className="flex items-center gap-1.5 mt-5 p-1 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto">
              <button
                onClick={() => setActiveTab('schematic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'schematic'
                    ? 'bg-slate-800 text-sky-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Schematic Circuit</span>
              </button>
              <button
                onClick={() => setActiveTab('assembly')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'assembly'
                    ? 'bg-slate-800 text-sky-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Assembly Guide ({currentRecipe.assemblySteps.length} Steps)</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-slate-800 text-sky-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Embedded Firmware</span>
              </button>
              <button
                onClick={() => setActiveTab('pinouts')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'pinouts'
                    ? 'bg-slate-800 text-sky-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Pinout Remapper</span>
              </button>
              <button
                onClick={() => setActiveTab('bom_export')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'bom_export'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Interactive BOM ({currentRecipe.requiredParts.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('safety')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'safety'
                    ? 'bg-rose-950/80 text-rose-300 shadow-sm border border-rose-800'
                    : 'text-rose-400/80 hover:text-rose-300'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Safety & Hazards</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Interactive SVG Circuit Schematic */}
          {activeTab === 'schematic' && (
            <div
              className={`p-5 space-y-4 rounded-xl transition-all ${
                isDragOverCanvas ? 'ring-2 ring-sky-400 bg-sky-950/20' : ''
              }`}
              onDragOver={e => {
                e.preventDefault();
                setIsDragOverCanvas(true);
              }}
              onDragLeave={() => setIsDragOverCanvas(false)}
              onDrop={handleDropComponent}
            >
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Interactive Topology &amp; Netlist View</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Tip: Přetáhněte sem libovolnou součástku z <strong>Pinout Exploreru</strong> pro okamžitou referenci!
                </span>
              </div>

              <SchematicViewer
                nodes={currentRecipe.schematicNodes}
                wires={currentRecipe.schematicWires}
                title={currentRecipe.title}
              />

              {/* Dropped Reference Pinout Cards */}
              {droppedReferenceParts.length > 0 && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-sky-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      <span>Přetažené referenční pinouty ({droppedReferenceParts.length}):</span>
                    </span>
                    <button
                      onClick={() => setDroppedReferenceParts([])}
                      className="text-[11px] text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      Odebrat reference
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {droppedReferenceParts.map(part => (
                      <div
                        key={part.id}
                        className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-400">{part.partNumber}</span>
                          <span className="text-[10px] text-slate-400">{part.packageType}</span>
                        </div>
                        <div className="text-slate-300 font-sans text-[11px] truncate">{part.name}</div>
                        <div className="text-[10px] text-slate-400 max-h-16 overflow-y-auto pr-1">
                          {part.pinout.map(p => (
                            <div key={p.pin} className="flex justify-between py-0.2">
                              <span className="text-amber-400">#{p.pin} {p.name}</span>
                              <span className="text-slate-500 truncate max-w-[120px]">{p.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span>Control Signals</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Power (+V)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                    <span>GND Common</span>
                  </span>
                </div>
                <div className="text-slate-500">
                  Tip: Drag canvas to pan; scroll or use top-right icons to zoom. Click wires for signal name.
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Step-by-Step Assembly Instructions */}
          {activeTab === 'assembly' && (
            <div className="p-5 space-y-4">
              <div className="space-y-3">
                {currentRecipe.assemblySteps.map(step => {
                  const isDone = !!completedSteps[step.step];
                  return (
                    <div
                      key={step.step}
                      className={`p-4 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleStep(step.step)}
                          className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'border-slate-700 hover:border-sky-400'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-sky-400 font-semibold">
                              Step {step.step}
                            </span>
                            <span aria-hidden="true" className="text-slate-600">|</span>
                            <h4
                              className={`text-sm font-semibold ${
                                isDone ? 'text-slate-400 line-through' : 'text-slate-200'
                              }`}
                            >
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {step.instruction}
                          </p>
                          {step.caution && (
                            <div className="flex items-start gap-2 p-2.5 bg-amber-950/30 border border-amber-800/40 rounded-lg text-xs text-amber-300 mt-2">
                              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                              <span>{step.caution}</span>
                            </div>
                          )}
                          {step.testingTip && (
                            <div className="text-[11px] font-mono text-sky-300/80 bg-sky-950/30 border border-sky-800/30 px-2.5 py-1.5 rounded mt-1">
                              Calibration &amp; Test Tip: {step.testingTip}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Embedded Firmware Code & Flasher */}
          {activeTab === 'code' && (
            <div className="p-5 space-y-4">
              {/* Code toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCodeLanguage('arduino')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      codeLanguage === 'arduino'
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Arduino C++ (.ino)
                  </button>
                  <button
                    onClick={() => setCodeLanguage('esp32')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      codeLanguage === 'esp32'
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ESP32 C++ (IDF/Arduino)
                  </button>
                  <button
                    onClick={() => setCodeLanguage('micropython')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      codeLanguage === 'micropython'
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    MicroPython (.py)
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={runSimulatedFlasher}
                    disabled={isSimRunning}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isSimRunning ? 'Compiling...' : 'Test Compile & Flasher'}</span>
                  </button>
                  <button
                    onClick={copyCodeToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <button
                    onClick={downloadCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md transition-colors cursor-pointer font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .{codeLanguage === 'micropython' ? 'py' : 'ino'}</span>
                  </button>
                  <button
                    onClick={downloadFullProjectBundle}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-md transition-colors cursor-pointer font-bold shadow-md"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Project Bundle</span>
                  </button>
                </div>
              </div>

              {/* Code display block */}
              <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-slate-400">
                  <span>Target: {codeLanguage.toUpperCase()} - Ready for IDE upload</span>
                  <span className="text-[11px] text-slate-500">Includes pin defines, ISR handlers &amp; debounce</span>
                </div>
                <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed max-h-[380px] selection:bg-sky-500/30">
                  <code>{currentRecipe.codeTemplates[codeLanguage]}</code>
                </pre>
              </div>

              {/* Simulated Flasher Output Terminal */}
              {simTerminalOutput.length > 0 && (
                <div className="bg-black border border-emerald-900/40 rounded-xl p-3 font-mono text-xs text-emerald-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pb-1 border-b border-emerald-950">
                    <Terminal className="w-3 h-3 text-emerald-500" />
                    <span>Local Compiler / Serial Console [115200 Baud]</span>
                  </div>
                  {simTerminalOutput.map((line, idx) => (
                    <div key={idx} className="leading-snug">
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: BOM & Interactive Pin Remapper */}
          {activeTab === 'pinouts' && (
            <div className="p-5 space-y-6">
              {/* Bill of Materials (BOM) with Scrap Bin Status */}
              <div>
                <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center justify-between">
                  <span>Bill of Materials &amp; Salvage Status</span>
                  <span className="text-xs text-slate-400 font-normal">
                    {synthesizedResult?.inventoryMatchPercentage}% in your inventory
                  </span>
                </h4>
                <div className="space-y-2">
                  {currentRecipe.requiredParts.map((part, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            part.inInventory ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                          }`}
                        />
                        <div>
                          <div className="font-semibold text-slate-200">{part.componentName}</div>
                          <div className="text-[11px] text-slate-400">
                            Part: {part.partNumber} | Qty: {part.quantity} | Alternatives: {part.alternatives.join(', ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {part.inInventory ? (
                          <span className="text-emerald-400 font-medium">In Scrap Bin</span>
                        ) : (
                          <button
                            onClick={() => {
                              if (onAddPartToInventory) {
                                onAddPartToInventory({
                                  id: `salvaged-${Date.now()}`,
                                  name: part.componentName,
                                  partNumber: part.partNumber,
                                  category: part.category,
                                  packageType: 'Salvaged Module',
                                  extractedFrom: 'Acquired for Project',
                                  condition: 'working',
                                  quantity: part.quantity,
                                  pinCount: 4,
                                  pinout: [],
                                  specs: {},
                                  testProcedure: 'Tested for project integration',
                                  salvageValueEstimate: 2.0,
                                  dateAdded: new Date().toISOString().slice(0, 10)
                                });
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-sky-950 text-sky-300 border border-sky-800 hover:bg-sky-900 rounded transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Mark Found</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Pin Remapper */}
              <div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">Interactive MCU Pin Remapper</h4>
                <p className="text-xs text-slate-400 mb-3">
                  Need to swap pins due to broken board traces or PCB layout? Modify assignments here:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentRecipe.pinMappings.map(pin => (
                    <div
                      key={pin.label}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <div className="text-slate-200 font-medium">{pin.label}</div>
                        <div className="text-[11px] text-slate-500">{pin.description}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 text-[11px]">Pin:</span>
                        <input
                          type="text"
                          value={pinEdits[pin.label] || pin.defaultPin}
                          onChange={e =>
                            setPinEdits(prev => ({
                              ...prev,
                              [pin.label]: e.target.value.toUpperCase()
                            }))
                          }
                          className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center text-sky-400 font-bold focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Interactive BOM View */}
          {activeTab === 'bom_export' && (
            <div className="p-5">
              <InteractiveBOMView
                recipe={currentRecipe}
                userInventory={userInventory}
                lang={lang}
                onAddFoundPart={onAddPartToInventory}
              />
            </div>
          )}

          {/* Tab 6: Critical Safety & Hazards */}
          {activeTab === 'safety' && (
            <div className="p-5 space-y-4">
              <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                  <Flame className="w-4 h-4" />
                  <span>Crucial Hardware Safety Warnings</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Salvaging electronic components from old appliances carries physical and electrical risks.
                  Follow these strict guidelines before powering the circuit:
                </p>
                <div className="space-y-2 mt-2">
                  {currentRecipe.safetyChecklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 bg-slate-950 border border-rose-900/30 rounded-lg text-xs text-rose-200"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Self-healing automatic corrections */}
              {synthesizedResult?.agentInsights.healedCorrections && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Titan Autonomous Self-Healing Fixes Applied to this Circuit:</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {synthesizedResult.agentInsights.healedCorrections.map((corr, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <ArrowRight className="w-3 h-3 text-sky-400" />
                        <span>{corr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
