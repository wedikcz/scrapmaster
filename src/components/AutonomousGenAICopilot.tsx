import React, { useState, useRef, useEffect } from 'react';
import { ScrapComponent, ProjectRecipe } from '../types/scrap';
import { Language, TRANSLATIONS } from '../i18n/translations';
import {
  Bot,
  Sparkles,
  Send,
  Zap,
  Cpu,
  Terminal,
  ShieldCheck,
  FileCode,
  Box,
  Compass,
  Wand2,
  Trash2,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot' | 'system';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'open_tab' | 'insert_prompt' | 'add_part';
    target: string;
    label: string;
  };
}

interface AutonomousGenAICopilotProps {
  lang: Language;
  inventory: ScrapComponent[];
  activeProject?: ProjectRecipe | null;
  onNavigateTab: (tab: any) => void;
  onSetBuildPrompt?: (prompt: string) => void;
}

export const AutonomousGenAICopilot: React.FC<AutonomousGenAICopilotProps> = ({
  lang,
  inventory,
  activeProject,
  onNavigateTab,
  onSetBuildPrompt
}) => {
  const t = TRANSLATIONS[lang];
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init-1',
      sender: 'copilot',
      text: lang === 'cs'
        ? 'Ahoj! Jsem tvůj exekutivně autonomní GenAI Kopilot pro elektroinženýrství, reverzní inženýrství a DIY stavbu. Mám plný přístup k tvému šrotovišti, schématům, kódovým generátorům i 3D CAD OpenSCADu. Jaký projekt dnes postavíme nebo jakou součástku otestujeme?'
        : 'Hello! I am your Autonomous GenAI Copilot specialized in Electrical Engineering, Hardware Reverse-Engineering, and DIY Salvage. I have live access to your scrap inventory, schematic synthesizers, and OpenSCAD parametric engines. What are we building or testing today?',
      timestamp: new Date().toLocaleTimeString(),
      suggestedAction: {
        type: 'insert_prompt',
        target: 'Mini 2-Axis CNC Laser / Pen Plotter from DVD steppers',
        label: lang === 'cs' ? 'Navrhnout CNC kreslič z DVD mechanik' : 'Synthesize DVD Plotter'
      }
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeechSpeaking, setIsSpeechSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    lang === 'cs' ? 'Jak bezpečně vybít 400V kondenzátor ze zdroje?' : 'How to safely discharge a 400V primary capacitor?',
    lang === 'cs' ? 'Jaký kroutící moment má krokový motor z DVD a jak ho zapojit?' : 'What is the torque of a DVD stepper motor and pinout?',
    lang === 'cs' ? 'Navrhni zapojení pro nabíjení Li-Ion 18650 s ochranou DW01' : 'Design 18650 charge circuit with DW01 protection',
    lang === 'cs' ? 'Jak vygenerovat 3D držák pro servo SG90 v OpenSCADu?' : 'Generate SG90 servo bracket in OpenSCAD'
  ];

  const handleSendMessage = async (customText?: string) => {
    const query = (customText || inputQuery).trim();
    if (!query) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputQuery('');
    setIsThinking(true);

    // Call server-side search grounding / LLM or local expert engine
    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          promptContext: `You are the lead hardware reverse-engineering autonomous copilot. User inventory contains: ${inventory
            .map(i => `${i.name} (${i.partNumber})`)
            .join(', ')}. Answer with practical engineering formulas, pinout advice, safety warnings, and code snippets.`
        })
      });

      const data = await res.json();
      const botText = data.text || data.fallbackText || 'Hardware analysis complete.';

      let suggestedAction: CopilotMessage['suggestedAction'];
      if (query.toLowerCase().includes('dvd') || query.toLowerCase().includes('kresli') || query.toLowerCase().includes('cnc')) {
        suggestedAction = {
          type: 'open_tab',
          target: 'build',
          label: lang === 'cs' ? 'Otevřít Návrhář CNC v Prompt-to-Build' : 'Open CNC in Prompt-to-Build'
        };
      } else if (query.toLowerCase().includes('pinout') || query.toLowerCase().includes('vývod')) {
        suggestedAction = {
          type: 'open_tab',
          target: 'pinout_explorer',
          label: lang === 'cs' ? 'Otevřít Pinout Explorer' : 'Open Pinout Explorer'
        };
      } else if (query.toLowerCase().includes('3d') || query.toLowerCase().includes('scad') || query.toLowerCase().includes('držák')) {
        suggestedAction = {
          type: 'open_tab',
          target: 'cad_3d',
          label: lang === 'cs' ? 'Otevřít 3D CAD Generátor' : 'Open 3D CAD Generator'
        };
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'copilot',
          text: botText,
          timestamp: new Date().toLocaleTimeString(),
          suggestedAction
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          sender: 'copilot',
          text: `[Lokální Inženýrské Jádro]: Pro dotaz "${query}" doporučuji ověřit polarity, oddělit silovou 12V zem od 5V logické země a osadit blokovací kondenzátory 100nF u každého napájecího pinu IC.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoicePlay = async (text: string) => {
    try {
      const res = await fetch('/api/tts/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 350), voice: 'Kore' })
      });
      const data = await res.json();
      if (data.audioData) {
        const audio = new Audio(data.audioData);
        audio.play();
      }
    } catch {
      // Speech synthesis fallback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text.slice(0, 250)));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 text-slate-950 rounded-lg shadow-md font-bold">
              <Bot className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">
                  {lang === 'cs' ? 'Autonomní GenAI Inženýrský Kopilot (ALL-ENG + RE)' : 'Autonomous GenAI Engineering Copilot (ALL-ENG + RE)'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                  Gemini 3.8 + Grounding
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'cs'
                  ? 'Plnohodnotný AI asistent pro elektroinženýrství, reverzní inženýrství, identifikaci neznámých čipů a generování stavebních instrukcí.'
                  : 'Executive autonomous AI copilot with live grounding, scrap inventory synthesis, circuit diagnostics, and firmware compilation.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Vyčistit konverzaci"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Question Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-mono text-[11px] shrink-0">Doporučené dotazy:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-sky-500 hover:text-sky-300 transition-colors whitespace-nowrap cursor-pointer text-xs"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-xs select-text bg-slate-950/60">
          {messages.map(msg => {
            const isBot = msg.sender === 'copilot';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isBot ? 'bg-indigo-600 text-white shadow-md' : 'bg-sky-500 text-slate-950'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : 'VY'}
                </div>

                <div
                  className={`p-3.5 rounded-xl border space-y-2 leading-relaxed ${
                    isBot
                      ? 'bg-slate-900 border-slate-800 text-slate-200'
                      : 'bg-sky-600 text-white border-sky-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-75 font-mono">
                    <span>{isBot ? 'GenAI Copilot' : 'Vy'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-line text-xs">{msg.text}</p>

                  {/* Audio Voice Readout */}
                  {isBot && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => handleVoicePlay(msg.text)}
                        className="text-[11px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Přečíst hlasem (TTS)</span>
                      </button>

                      {msg.suggestedAction && (
                        <button
                          onClick={() => {
                            if (msg.suggestedAction?.type === 'open_tab') {
                              onNavigateTab(msg.suggestedAction.target);
                            } else if (msg.suggestedAction?.type === 'insert_prompt' && onSetBuildPrompt) {
                              onSetBuildPrompt(msg.suggestedAction.target);
                              onNavigateTab('build');
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[10px] transition-colors cursor-pointer"
                        >
                          {msg.suggestedAction.label} &rarr;
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>GenAI Kopilot analyzuje schéma a datasheety...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder={lang === 'cs' ? 'Zeptejte se na pinouty, návrh zapojení, řešení závady nebo firmware...' : 'Ask about pinouts, circuit fixes, firmware, or teardown protocols...'}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
          />
          <button
            type="submit"
            disabled={isThinking || !inputQuery.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Odeslat</span>
          </button>
        </form>
      </div>
    </div>
  );
};
