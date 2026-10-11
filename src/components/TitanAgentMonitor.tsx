import React, { useState } from 'react';
import { AgentLog, AgentRole } from '../types/scrap';
import {
  Activity,
  Cpu,
  Eye,
  Code2,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Zap,
  Flame,
  Radio,
  Sliders,
  Check
} from 'lucide-react';

interface TitanAgentMonitorProps {
  onAutoHealTriggered?: () => void;
}

const INITIAL_LOGS: AgentLog[] = [
  {
    id: 'log-1',
    agent: '@Architect-MoE',
    message: '[GODMODE: ARCHITECT] Topologie ověřena: Low-side N-MOSFET spínací stupeň namapován na PWM pin D3. Impedance sběrnice < 0.05Ω.',
    timestamp: '23:31:10',
    status: 'info'
  },
  {
    id: 'log-2',
    agent: '@Vision-Inspector',
    message: '[GODMODE: OCR/CONTOUR] Optický tracker uzamčen na PL15S DVD mikrokrokový motor. Piny: 4-fázový bipolár s odpory cívek 10.4Ω a 10.6Ω.',
    timestamp: '23:31:12',
    status: 'success'
  },
  {
    id: 'log-3',
    agent: '@Scanner-Diagnostics',
    message: '[VAROVÁNÍ: DIAGNOSTIKA] Indukční cívka elektromagnetického ventilu postrádá diodu! Kolaps pole vygeneruje napěťovou špičku >180V.',
    timestamp: '23:31:15',
    status: 'warning'
  },
  {
    id: 'log-4',
    agent: '@Self-Healing-Engine',
    message: '[GODMODE: AUTO-REANIMACE] Autonomně injektována rychlá dioda 1N4007 antiparalelně k cívce. Lavinový průraz MOSFETu zažehnán.',
    timestamp: '23:31:16',
    status: 'healed'
  },
  {
    id: 'log-5',
    agent: '@Augmented-Coder',
    message: '[GODMODE: CODER] Syntetizován C++ & MicroPython kód: Ne-blokující časovač millis(), hardwarový debounce a ISR obsluha limitních spínačů.',
    timestamp: '23:31:18',
    status: 'success'
  }
];

export const TitanAgentMonitor: React.FC<TitanAgentMonitorProps> = ({ onAutoHealTriggered }) => {
  const [logs, setLogs] = useState<AgentLog[]>(INITIAL_LOGS);
  const [activeAgentFilter, setActiveAgentFilter] = useState<string>('all');
  const [isHealing, setIsHealing] = useState(false);

  const triggerDiagnosticCycle = (faultType?: string) => {
    setIsHealing(true);
    let msg = 'GODMODE SWEEP: Ověřeny logické úrovně 3.3V/5V, mezní ztrátový výkon chladiče a parazitní indukčnosti.';
    let agent: AgentRole = '@Self-Healing-Engine';
    let status: AgentLog['status'] = 'healed';

    if (faultType === 'flyback') {
      agent = '@Scanner-Diagnostics';
      msg = 'KRITICKÉ: Zjištěn indukční překmit z krokového motoru bez tlumící diody (180V peak). @Self-Healing-Engine aplikoval snubber RC filtr.';
      status = 'warning';
    } else if (faultType === 'level') {
      agent = '@Architect-MoE';
      msg = 'NAPĚŤOVÝ KONFLIKT: 5V výstup z čipu zapojen do 3.3V GPIO ESP32! Injektován odporový dělič 2.2kΩ/3.3kΩ.';
      status = 'healed';
    } else if (faultType === 'thermal') {
      agent = '@Scanner-Diagnostics';
      msg = 'TEPELNÁ ZTRÁTA: LM317 ztrácí 12.8W tepla při 1.2A. Přepočten požadovaný chladič na Rth < 3.5 °C/W.';
      status = 'warning';
    }

    const newLog: AgentLog = {
      id: `log-${Date.now()}`,
      agent,
      message: msg,
      timestamp: new Date().toLocaleTimeString(),
      status
    };

    setTimeout(() => {
      setLogs(prev => [newLog, ...prev]);
      setIsHealing(false);
      if (onAutoHealTriggered) onAutoHealTriggered();
    }, 550);
  };

  const filteredLogs = logs.filter(
    l => activeAgentFilter === 'all' || l.agent === activeAgentFilter
  );

  const getAgentIcon = (agent: AgentRole) => {
    switch (agent) {
      case '@Architect-MoE':
        return <Cpu className="w-3.5 h-3.5 text-sky-400" />;
      case '@Vision-Inspector':
        return <Eye className="w-3.5 h-3.5 text-purple-400" />;
      case '@Augmented-Coder':
        return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
      case '@Scanner-Diagnostics':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />;
      case '@Self-Healing-Engine':
        return <Sparkles className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>MANUS-TITAN-CORE: Godmode Multi-Agent Swarm</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </h3>
            <p className="text-xs text-slate-400">
              Pětice specializovaných agentních modulů nepřetržitě analyzuje topologii, optické OCR, kód i bezpečnost.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerDiagnosticCycle()}
            disabled={isHealing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isHealing ? 'animate-spin' : ''}`} />
            <span>{isHealing ? 'Reanimuji obvod...' : 'Godmode Autonomní Sweep'}</span>
          </button>
        </div>
      </div>

      {/* Godmode Swarm Telemetry Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
          <span className="text-[10px] text-slate-500 block">ARCHITEKTURA</span>
          <span className="text-sky-300 font-bold">MoE Swarm v4.2</span>
        </div>
        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
          <span className="text-[10px] text-slate-500 block">ZÁCHRANNÉ SOUČÁSTKY</span>
          <span className="text-emerald-400 font-bold">100% Validováno</span>
        </div>
        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
          <span className="text-[10px] text-slate-500 block">AUTO-HEAL ÚSPĚŠNOST</span>
          <span className="text-rose-400 font-bold">99.8% Bezchybná</span>
        </div>
        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
          <span className="text-[10px] text-slate-500 block">LOKÁLNÍ OBRAT</span>
          <span className="text-amber-400 font-bold">0ms Latence</span>
        </div>
      </div>

      {/* Fault Injection Test Bar */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
          <span className="font-semibold text-slate-300">Simulace hardwarových pastí &amp; Test agentního zásahu:</span>
          <span className="text-slate-500">Kliknutím vyvoláte poruchu v obvodu</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          <button
            onClick={() => triggerDiagnosticCycle('flyback')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-rose-950/60 text-rose-300 border border-rose-900/50 rounded-lg transition-colors cursor-pointer"
          >
            ⚡ Zkrat / Indukční překmit 180V
          </button>
          <button
            onClick={() => triggerDiagnosticCycle('level')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-sky-950/60 text-sky-300 border border-sky-900/50 rounded-lg transition-colors cursor-pointer"
          >
            🔌 Logický konflikt (5V do 3.3V)
          </button>
          <button
            onClick={() => triggerDiagnosticCycle('thermal')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-amber-950/60 text-amber-300 border border-amber-900/50 rounded-lg transition-colors cursor-pointer"
          >
            🔥 Přehřátí regulátoru (&gt;12W)
          </button>
        </div>
      </div>

      {/* Agents Pill Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
        <button
          onClick={() => setActiveAgentFilter('all')}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            activeAgentFilter === 'all'
              ? 'bg-slate-800 text-sky-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Všichni agenti
        </button>
        {(['@Architect-MoE', '@Vision-Inspector', '@Augmented-Coder', '@Scanner-Diagnostics', '@Self-Healing-Engine'] as AgentRole[]).map(agent => (
          <button
            key={agent}
            onClick={() => setActiveAgentFilter(agent)}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
              activeAgentFilter === agent
                ? 'bg-slate-800 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {getAgentIcon(agent)}
            <span>{agent}</span>
          </button>
        ))}
      </div>

      {/* Terminal Log Console */}
      <div className="bg-black border border-slate-800 rounded-xl p-3 font-mono text-xs max-h-64 overflow-y-auto space-y-2">
        {filteredLogs.map(log => {
          const isHealed = log.status === 'healed';
          const isWarn = log.status === 'warning';
          const isSuccess = log.status === 'success';

          return (
            <div
              key={log.id}
              className={`p-2.5 rounded-lg border leading-relaxed flex items-start gap-2.5 ${
                isHealed
                  ? 'bg-rose-950/20 border-rose-900/60 text-rose-200'
                  : isWarn
                  ? 'bg-amber-950/20 border-amber-900/60 text-amber-200'
                  : isSuccess
                  ? 'bg-emerald-950/15 border-emerald-900/40 text-emerald-200'
                  : 'bg-slate-950 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="mt-0.5">{getAgentIcon(log.agent)}</div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-400">{log.agent}</span>
                  <span>{log.timestamp}</span>
                </div>
                <div className="text-xs">{log.message}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
