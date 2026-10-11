import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Usb,
  Play,
  RotateCcw,
  Download,
  Trash2,
  Send,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Cpu
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface WebSerialTerminalProps {
  lang: Language;
}

interface TerminalMessage {
  id: string;
  timestamp: string;
  type: 'sent' | 'received' | 'system' | 'error';
  text: string;
}

export const WebSerialTerminal: React.FC<WebSerialTerminalProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [isConnected, setIsConnected] = useState(false);
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [messages, setMessages] = useState<TerminalMessage[]>([
    {
      id: 'msg-init-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'system',
      text: lang === 'cs'
        ? '[WebSerial] Připraven k otevření USB COM portu (Arduino, ESP32, CH340, CP2102, FTDI).'
        : '[WebSerial] Ready to open USB COM port (Arduino, ESP32, CH340, CP2102, FTDI).'
    },
    {
      id: 'msg-init-2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'system',
      text: lang === 'cs'
        ? '[WebSerial] Tip: Pokud nemáte připojené fyzické USB zařízení, simulátor automaticky reaguje na zkušební příkazy.'
        : '[WebSerial] Tip: If no physical USB device is plugged in, the hardware simulator automatically responds to test commands.'
    }
  ]);
  const [inputCommand, setInputCommand] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);

  const portRef = useRef<any>(null);
  const readerRef = useRef<any>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Check Web Serial support
  const isWebSerialSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollTop = terminalEndRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const addMessage = (type: 'sent' | 'received' | 'system' | 'error', text: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        type,
        text
      }
    ]);
  };

  // Connect via real Web Serial API
  const handleConnectPort = async () => {
    if (!isWebSerialSupported) {
      setIsSimulated(true);
      setIsConnected(true);
      addMessage('system', lang === 'cs'
        ? '[WebSerial] Prohlížeč nepodporuje Web Serial API. Aktivován virtuální hardwarový simulátor.'
        : '[WebSerial] Browser does not support Web Serial API. Activated virtual hardware simulator.');
      return;
    }

    try {
      const serial = (navigator as any).serial;
      const port = await serial.requestPort();
      await port.open({ baudRate });
      portRef.current = port;
      setIsConnected(true);
      setIsSimulated(false);
      addMessage('system', lang === 'cs'
        ? `[WebSerial] Úspěšně připojeno k USB zařízení na rychlosti ${baudRate} baudů.`
        : `[WebSerial] Successfully connected to USB device at ${baudRate} baud.`);
      
      // Start read loop
      readSerialLoop(port);
    } catch (err: any) {
      console.warn('WebSerial connection cancelled or failed, falling back to simulated mode:', err);
      setIsSimulated(true);
      setIsConnected(true);
      addMessage('system', lang === 'cs'
        ? `[Simulátor] Fyzický USB port nebyl vybrán. Aktivován virtuální Arduino/CNC simulátor.`
        : `[Simulator] Physical USB port not selected. Activated virtual Arduino/CNC simulator.`);
    }
  };

  const readSerialLoop = async (port: any) => {
    try {
      const textDecoder = new TextDecoderStream();
      port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      readerRef.current = reader;
      let lineBuffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          lineBuffer += value;
          const lines = lineBuffer.split(/\r?\n/);
          lineBuffer = lines.pop() || '';
          for (const line of lines) {
            if (line.trim()) {
              addMessage('received', line.trim());
            }
          }
        }
      }
    } catch (err: any) {
      if (isConnected) {
        addMessage('error', `[WebSerial Chyba čtení] ${err.message}`);
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
      }
      if (portRef.current) {
        await portRef.current.close();
      }
    } catch (err) {
      console.error(err);
    } finally {
      portRef.current = null;
      readerRef.current = null;
      setIsConnected(false);
      setIsSimulated(false);
      addMessage('system', lang === 'cs' ? '[WebSerial] Port byl odpojen.' : '[WebSerial] Port disconnected.');
    }
  };

  const sendData = async (cmdToSend: string) => {
    const cmd = cmdToSend.trim();
    if (!cmd) return;

    addMessage('sent', `> ${cmd}`);

    if (isSimulated || !portRef.current) {
      // Simulate hardware microcontroller responses
      setTimeout(() => {
        handleSimulatedResponse(cmd);
      }, 120);
      return;
    }

    try {
      const encoder = new TextEncoder();
      const writer = portRef.current.writable.getWriter();
      await writer.write(encoder.encode(cmd + '\n'));
      writer.releaseLock();
    } catch (err: any) {
      addMessage('error', `[WebSerial Chyba zápisu] ${err.message}`);
    }
  };

  const handleSimulatedResponse = (cmd: string) => {
    const c = cmd.toUpperCase();
    if (c === 'T') {
      addMessage('received', '[ScrapMaster-CNC] Kreslím kalibrační čtverec 15x15mm...');
      addMessage('received', 'PEN_DOWN: 90 deg -> OK');
      addMessage('received', 'STEP_X: +100 steps (15.0mm)');
      addMessage('received', 'STEP_Y: +100 steps (15.0mm)');
      addMessage('received', 'STEP_X: -100 steps');
      addMessage('received', 'STEP_Y: -100 steps');
      addMessage('received', 'PEN_UP: 45 deg -> Čtverec dokončen bez krokových ztrát!');
    } else if (c === 'U') {
      addMessage('received', '[Servo] OK: Pen UP (Zdvih pera aktivní)');
    } else if (c === 'D') {
      addMessage('received', '[Servo] OK: Pen DOWN (Kreslení aktivní)');
    } else if (c === 'G28') {
      addMessage('received', '[CNC-Homing] Hledám koncové mikrospínače X a Y...');
      addMessage('received', 'X-axis limit switch triggered: X=0.00mm');
      addMessage('received', 'Y-axis limit switch triggered: Y=0.00mm -> HOMING DOKONČEN');
    } else if (c.startsWith('X') || c.startsWith('Y')) {
      addMessage('received', `[Krokový motor] OK: Posun osy proveden ${cmd}`);
    } else if (c === 'ADC' || c === 'VOLTS') {
      addMessage('received', '[DMM-Telemetry] A0: 5.02V | A1: 0.12A | Baterie: 3.84V (Zdravý Li-Ion článek)');
    } else if (c === 'RESET') {
      addMessage('system', '[Bootloader] Restarting ATmega328P / ESP32...');
      addMessage('received', '[ScrapMaster AI] Firmware v1.4.2 Ready @ 115200 baud.');
    } else {
      addMessage('received', `[Echo] Přijat příkaz: "${cmd}" -> OK`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;
    sendData(inputCommand);
    setInputCommand('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <Usb className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">{t.webSerialTitle}</h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    isConnected
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 animate-pulse'
                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}
                >
                  {isConnected ? t.portStatusConnected : t.portStatusDisconnected}
                  {isSimulated && ' (SIMULÁTOR)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{t.webSerialDesc}</p>
            </div>
          </div>
        </div>

        {/* Port connection controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[11px]">{t.baudRate}</span>
            <select
              disabled={isConnected}
              value={baudRate}
              onChange={e => setBaudRate(Number(e.target.value))}
              className="bg-slate-900 text-sky-400 font-bold focus:outline-none cursor-pointer rounded px-1.5 py-0.5"
            >
              <option value={9600}>9600</option>
              <option value={19200}>19200</option>
              <option value={38400}>38400</option>
              <option value={57600}>57600</option>
              <option value={115200}>115200</option>
            </select>
          </div>

          {isConnected ? (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              {t.disconnectUsb}
            </button>
          ) : (
            <button
              onClick={handleConnectPort}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Usb className="w-3.5 h-3.5" />
              <span>{t.connectUsb}</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Test Macros */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.quickMacros}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {lang === 'cs' ? 'Kliknutím odešlete příkaz na COM sběrnici' : 'Click to send command over COM port'}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <button
            onClick={() => sendData('G28')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-sky-300 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            G28 (Home X/Y)
          </button>
          <button
            onClick={() => sendData('T')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            T (Test čtverec 15mm)
          </button>
          <button
            onClick={() => sendData('U')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            U (Pero NAHORU)
          </button>
          <button
            onClick={() => sendData('D')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            D (Pero DOLŮ)
          </button>
          <button
            onClick={() => sendData('X 100')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            X +100 Kroků
          </button>
          <button
            onClick={() => sendData('Y 100')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Y +100 Kroků
          </button>
          <button
            onClick={() => sendData('ADC')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-purple-300 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            ADC (Změřit Napětí)
          </button>
          <button
            onClick={() => sendData('RESET')}
            className="px-3 py-1.5 bg-slate-950 hover:bg-rose-950/60 text-rose-300 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            RESET (Restart MCU)
          </button>
        </div>
      </div>

      {/* Terminal Display Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[460px]">
        {/* Terminal top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-semibold">WebSerial Live Console [{baudRate} Baud]</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={e => setAutoScroll(e.target.checked)}
                className="accent-sky-400"
              />
              <span>{t.autoscroll}</span>
            </label>
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1 text-[11px] hover:text-rose-400 transition-colors cursor-pointer"
              title={t.clearTerminal}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearTerminal}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Log Stream */}
        <div
          ref={terminalEndRef}
          className="flex-1 p-4 bg-black overflow-y-auto font-mono text-xs space-y-1.5 select-text"
        >
          {messages.map(msg => {
            const isSent = msg.type === 'sent';
            const isRecv = msg.type === 'received';
            const isErr = msg.type === 'error';

            return (
              <div
                key={msg.id}
                className={`leading-relaxed ${
                  isSent
                    ? 'text-sky-300 font-semibold'
                    : isRecv
                    ? 'text-emerald-300'
                    : isErr
                    ? 'text-rose-400 font-bold'
                    : 'text-slate-500'
                }`}
              >
                <span className="text-[10px] text-slate-600 mr-2">[{msg.timestamp}]</span>
                <span>{msg.text}</span>
              </div>
            );
          })}
        </div>

        {/* Terminal Command Input Form */}
        <form
          onSubmit={handleFormSubmit}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputCommand}
              onChange={e => setInputCommand(e.target.value)}
              placeholder={t.sendPlaceholder}
              className="w-full bg-black border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 font-sans"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.sendCommand}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
