import React, { useState } from 'react';
import {
  Search,
  Globe,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface GroundingSource {
  title: string;
  url: string;
}

const SAMPLE_SEARCH_QUERIES = [
  'NE555 timer latest pinout, frequency formulas and modern equivalents',
  'PL15S DVD stepper motor coil pinout and max step rate',
  'TP4056 lithium charging module safety cutoff voltage and Rprog values',
  'Current market salvage price per gram of gold and copper in PCB e-waste',
  'LM317 vs LM338 vs LM350 linear regulator pinout differences and thermal limits'
];

export const SearchGroundingPanel: React.FC = () => {
  const [query, setQuery] = useState(SAMPLE_SEARCH_QUERIES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [executedQueries, setExecutedQueries] = useState<string[]>([]);
  const [groundingStatus, setGroundingStatus] = useState<string>('idle');

  const handleExecuteSearch = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setResultText(null);
    setSources([]);
    setExecutedQueries([]);
    setGroundingStatus('searching');

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          promptContext:
            'Focus on accurate electronic hardware parameters, pinouts, maximum voltage limits, and safety precautions for hardware salvagers.'
        })
      });

      const data = await res.json();
      setResultText(data.text || data.fallbackText || 'No grounded answer returned.');
      setSources(data.sources || []);
      setExecutedQueries(data.queries || []);
      setGroundingStatus(data.status || 'success');
    } catch (err: any) {
      setResultText(`Search grounding query encountered error: ${err.message}`);
      setGroundingStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">
                  Real-Time Google Search Grounding Engine
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  gemini-3.5-flash + googleSearch
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Up-to-date pinouts, manufacturer datasheets, replacement cross-references &amp; live e-waste market values.
              </p>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleExecuteSearch()}
              placeholder="Search live hardware datasheets, pinouts, or scrap values..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>
          <button
            onClick={() => handleExecuteSearch()}
            disabled={isLoading || !query.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Searching Live Web...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Grounded Search</span>
              </>
            )}
          </button>
        </div>

        {/* Quick query chips */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span className="text-slate-500">Suggested queries:</span>
          {SAMPLE_SEARCH_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(q);
                handleExecuteSearch(q);
              }}
              className="text-slate-300 hover:text-blue-300 text-left hover:underline text-xs"
            >
              {q.slice(0, 42)}...
              {idx < SAMPLE_SEARCH_QUERIES.length - 1 && <span className="ml-2 text-slate-600">|</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Grounded Response View */}
      {resultText && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Grounded with Google Search Tool</span>
            </div>
            {executedQueries.length > 0 && (
              <span className="text-[11px] font-mono text-slate-400">
                Queries: {executedQueries.join(', ')}
              </span>
            )}
          </div>

          {/* Formatted Answer */}
          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans selection:bg-blue-500/20">
            {resultText}
          </div>

          {/* Source Citations */}
          {sources.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified Web Sources ({sources.length}):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center justify-between gap-2 text-slate-300 transition-colors"
                  >
                    <span className="truncate text-blue-300 font-medium">{src.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
