import React, { useState } from 'react';
import {
  FlaskConical,
  Atom,
  Search,
  BookOpen,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Check,
  AlertTriangle
} from 'lucide-react';

interface ChemicalCompound {
  name: string;
  formula: string;
  cid: number;
  weight: number;
  smiles: string;
  commonSources: string;
  toxicityLevel: 'safe' | 'low' | 'moderate' | 'high' | 'extreme';
  hazardNotes: string;
  recyclingMethod: string;
  chemicalReaction: string;
}

const COMMON_SCRAP_COMPOUNDS: ChemicalCompound[] = [
  {
    name: 'Lithium Cobalt Oxide',
    formula: 'LiCoO2',
    cid: 11090400,
    weight: 97.88,
    smiles: '[Li+].[O-][Co]=O',
    commonSources: 'Lithium-ion batteries (18650, vape pouch cells, phone batteries)',
    toxicityLevel: 'high',
    hazardNotes: 'Carcinogen via dust inhalation. Skin sensitizer. Keep submerged or handle in wet state.',
    recyclingMethod: 'Organic acid hydrometallurgical leaching (Citric acid + H2O2) yielding high-purity Cobalt Oxalate precipitate.',
    chemicalReaction: '2LiCoO2 + 3C6H8O7 + H2O2 → 2Li+ + 2Co2+ + 3C6H5O7(3-) + O2 + 4H2O'
  },
  {
    name: 'Beryllium Oxide',
    formula: 'BeO',
    cid: 14775,
    weight: 25.01,
    smiles: '[Be+2].[O-2]',
    commonSources: 'RF power transistors, microwave magnetron heat spreaders (white porcelain-like ceramic washers)',
    toxicityLevel: 'extreme',
    hazardNotes: 'EXTREMELY DANGEROUS: Inhaling Beryllium dust causes incurable Chronic Beryllium Disease (CBD) and lung cancer. NEVER sand, drill, or pulverize!',
    recyclingMethod: 'Do not attempt amateur chemical recycling. Seal intact in double ziplock bag and surrender to hazardous e-waste facility.',
    chemicalReaction: 'BeO + 2H2SO4 → BeSO4 + H2O (Industrial autoclave required; DO NOT PERFORM)'
  },
  {
    name: 'Lead(II) Oxide (Leaded Solder / CRT Funnel Glass)',
    formula: 'PbO',
    cid: 14827,
    weight: 223.2,
    smiles: 'O=[Pb]',
    commonSources: '60/40 vintage tin-lead solder joints, CRT TV deflection glass (20% Pb content)',
    toxicityLevel: 'high',
    hazardNotes: 'Neurotoxin. Bioaccumulative heavy metal. Wash hands thoroughly after desoldering.',
    recyclingMethod: 'Pyrometallurgical reduction with carbon charcoal or electrolytic molten salt recovery.',
    chemicalReaction: '2PbO + C → 2Pb (molten metal) + CO2 ↑ (at 850°C)'
  },
  {
    name: 'Gallium Nitride',
    formula: 'GaN',
    cid: 82253,
    weight: 83.73,
    smiles: '[Ga]#N',
    commonSources: 'Fast USB-C chargers, high-frequency RF power amplifiers, blue/violet laser diodes in Blu-ray drives',
    toxicityLevel: 'low',
    hazardNotes: 'Relatively non-toxic in solid crystal form. Decomposes to toxic ammonia if exposed to concentrated hot alkalis.',
    recyclingMethod: 'Thermal chlorination or electrochemical etching to recover precious Gallium metal.',
    chemicalReaction: '2GaN + 3Cl2 → 2GaCl3 + N2'
  },
  {
    name: 'Neodymium Iron Boron Magnet Alloy',
    formula: 'Nd2Fe14B',
    cid: 139598285,
    weight: 1081.2,
    smiles: 'Rare-earth intermetallic matrix',
    commonSources: 'Hard drive voice-coil actuators, DVD optical pickup lens motors, brushless spindle hubs',
    toxicityLevel: 'low',
    hazardNotes: 'Pyrophoric when ground into fine powder (spontaneous fire risk). Nickel plating prevents rapid corrosion.',
    recyclingMethod: 'Hydrogen decrepitation followed by oxalic acid leaching to selectively separate Neodymium from Iron.',
    chemicalReaction: 'Nd2Fe14B + xH2 → 2NdH2.7 + Fe + B (interstitial hydriding decrepitation)'
  }
];

export const ScienceMaterialsLab: React.FC = () => {
  const [selectedCompound, setSelectedCompound] = useState<ChemicalCompound>(COMMON_SCRAP_COMPOUNDS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingPubChem, setIsSearchingPubChem] = useState(false);
  const [pubChemResult, setPubChemResult] = useState<any | null>(null);

  const handlePubChemSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingPubChem(true);
    setPubChemResult(null);
    try {
      const res = await fetch(`/api/science/materials/${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setPubChemResult(data);
      } else {
        alert(`Compound "${searchQuery}" not found in PubChem.`);
      }
    } catch {
      alert('PubChem query failed. Check connection.');
    } finally {
      setIsSearchingPubChem(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Materials Science &amp; Chemical Metallurgy Lab
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                PubChem chemical properties, urban mining hydrometallurgy equations &amp; toxicology guidelines for e-waste.
              </p>
            </div>
          </div>
        </div>

        {/* Live PubChem Search Bar */}
        <form onSubmit={handlePubChemSearch} className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search PubChem (e.g. Copper, Lead, Lithium)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingPubChem || !searchQuery.trim()}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSearchingPubChem ? 'Querying...' : 'PubChem'}
          </button>
        </form>
      </div>

      {/* Main Grid: Compound Selector & Deep Chemistry Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scrap Compounds List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Common E-Waste Chemical Elements
          </div>
          {COMMON_SCRAP_COMPOUNDS.map(c => {
            const isSelected = selectedCompound.cid === c.cid;
            const isExtreme = c.toxicityLevel === 'extreme' || c.toxicityLevel === 'high';
            return (
              <button
                key={c.cid}
                onClick={() => {
                  setSelectedCompound(c);
                  setPubChemResult(null);
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-slate-800 border-purple-500/80 text-slate-100 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-200">{c.name}</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">{c.formula}</span>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{c.commonSources}</div>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-slate-500">CID: {c.cid}</span>
                  <span aria-hidden="true">|</span>
                  <span
                    className={`font-semibold ${
                      isExtreme ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    Toxicity: {c.toxicityLevel.toUpperCase()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Deep Chemistry & Hydrometallurgical Protocol (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Compound Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs font-mono text-purple-400 font-semibold flex items-center gap-2">
                  <Atom className="w-4 h-4" />
                  <span>PubChem Verified CID #{selectedCompound.cid}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mt-0.5">
                  {selectedCompound.name} ({selectedCompound.formula})
                </h3>
              </div>
              <a
                href={`https://pubchem.ncbi.nlm.nih.gov/compound/${selectedCompound.cid}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-purple-300 border border-slate-800 rounded-lg text-xs font-mono transition-colors self-start"
              >
                <span>View on PubChem</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Physicochemical Specs Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">MOL. FORMULA</span>
                <span className="text-slate-200 font-bold">{selectedCompound.formula}</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">MOL. WEIGHT</span>
                <span className="text-slate-200 font-bold">{selectedCompound.weight} g/mol</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">CANONICAL SMILES</span>
                <span className="text-slate-300 font-mono truncate block" title={selectedCompound.smiles}>
                  {selectedCompound.smiles}
                </span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">TOXICITY LEVEL</span>
                <span
                  className={`font-bold ${
                    selectedCompound.toxicityLevel === 'extreme'
                      ? 'text-rose-400'
                      : selectedCompound.toxicityLevel === 'high'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {selectedCompound.toxicityLevel.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Toxicity & Hazard Warning */}
            <div className="p-3.5 bg-rose-950/30 border border-rose-900/50 rounded-xl space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>Toxicological Hazard Profile</span>
              </div>
              <p className="text-rose-200 leading-relaxed font-sans">{selectedCompound.hazardNotes}</p>
            </div>

            {/* Hydrometallurgy / Chemical Extraction Reaction */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
                <FlaskConical className="w-4 h-4" />
                <span>Balanced Chemical Extraction Equation (Hydrometallurgy):</span>
              </div>
              <div className="p-3 bg-black/60 rounded-lg border border-purple-900/40 font-mono text-xs text-purple-200 overflow-x-auto leading-relaxed">
                {selectedCompound.chemicalReaction}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                <strong>Protocol: </strong>
                {selectedCompound.recyclingMethod}
              </p>
            </div>

            {/* Custom PubChem Live Search Card if active */}
            {pubChemResult && (
              <div className="p-4 bg-purple-950/20 border border-purple-800/60 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-purple-300 font-bold">
                  <span>Live PubChem API Response for &ldquo;{pubChemResult.name}&rdquo;</span>
                  <span>CID #{pubChemResult.cid}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Formula: <strong>{pubChemResult.molecularFormula}</strong></div>
                  <div>Weight: <strong>{pubChemResult.molecularWeight} g/mol</strong></div>
                  <div className="col-span-2 truncate">SMILES: <code>{pubChemResult.smiles}</code></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
