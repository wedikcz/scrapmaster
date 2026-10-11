import React, { useState } from 'react';
import { ScrapComponent, ComponentCategory } from '../types/scrap';
import {
  Package,
  Search,
  Plus,
  Zap,
  Download,
  Upload,
  ShieldAlert,
  HelpCircle,
  X,
  Check,
  Cpu,
  Trash2,
  DollarSign
} from 'lucide-react';

interface ScrapInventoryProps {
  inventory: ScrapComponent[];
  onAddPart: (part: ScrapComponent) => void;
  onRemovePart: (id: string) => void;
  onSelectForBuild: (part: ScrapComponent) => void;
  onImportInventory: (parts: ScrapComponent[]) => void;
}

export const ScrapInventory: React.FC<ScrapInventoryProps> = ({
  inventory,
  onAddPart,
  onRemovePart,
  onSelectForBuild,
  onImportInventory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // New Part form state
  const [newPartName, setNewPartName] = useState('');
  const [newPartNumber, setNewPartNumber] = useState('');
  const [newCategory, setNewCategory] = useState<ComponentCategory>('ic');
  const [newPackage, setNewPackage] = useState('DIP-8');
  const [newExtractedFrom, setNewExtractedFrom] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);
  const [newTestProcedure, setNewTestProcedure] = useState('');
  const [newValueEstimate, setNewValueEstimate] = useState(2.0);

  const categories = [
    { id: 'all', label: 'All Components' },
    { id: 'ic', label: 'ICs & Chips' },
    { id: 'motor', label: 'Motors & Steppers' },
    { id: 'power', label: 'Power & Batteries' },
    { id: 'passive', label: 'Passives & Diodes' },
    { id: 'sensor', label: 'Sensors & Switches' },
    { id: 'hazard', label: 'High Voltage / Hazard' }
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.partNumber.toLowerCase().includes(query) ||
      item.extractedFrom.toLowerCase().includes(query) ||
      item.packageType.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const totalValue = inventory.reduce((acc, curr) => acc + curr.salvageValueEstimate * curr.quantity, 0);
  const totalCount = inventory.reduce((acc, curr) => acc + curr.quantity, 0);
  const hazardCount = inventory.filter(i => i.hazardLevel === 'critical' || i.hazardLevel === 'dangerous').length;

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(inventory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scrapmaster_inventory_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportInventory(parsed);
          alert(`Successfully imported ${parsed.length} components into scrap bin!`);
        }
      } catch {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveNewPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim()) return;

    const newComp: ScrapComponent = {
      id: `comp-${Date.now()}`,
      name: newPartName,
      partNumber: newPartNumber || 'GENERIC',
      category: newCategory,
      packageType: newPackage,
      extractedFrom: newExtractedFrom || 'Salvage Junk Drawer',
      condition: 'working',
      quantity: Number(newQuantity) || 1,
      pinCount: 8,
      pinout: [],
      specs: {},
      testProcedure: newTestProcedure || 'Visual check and continuity verified.',
      salvageValueEstimate: Number(newValueEstimate) || 1.5,
      dateAdded: new Date().toISOString().slice(0, 10)
    };

    onAddPart(newComp);
    setShowAddModal(false);
    // Reset form
    setNewPartName('');
    setNewPartNumber('');
    setNewExtractedFrom('');
    setNewTestProcedure('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-slate-100">
                Local Inventory &amp; Scrap Bin Manager
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Organize rescued ICs, stepper motors, lithium cells, and passives harvested from e-waste.
            </p>
          </div>

          {/* Value and Stock Metrics */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500">Rescued Yield: </span>
              <span className="text-emerald-400 font-bold">${totalValue.toFixed(2)}</span>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500">Total Units: </span>
              <span className="text-sky-300 font-bold">{totalCount}</span>
            </div>
            {hazardCount > 0 && (
              <div className="bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-800/80 text-rose-300">
                <span>{hazardCount} Hazards Monitored</span>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar: Search, Filters, Add Part, Backup */}
        <div className="mt-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search parts by name, number (e.g. 555, LM317), donor device..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowCheatSheet(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>DMM Test Guide</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export JSON</span>
            </button>
            <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Salvaged Part</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-slate-800 border-sky-500 text-sky-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map(item => {
          const isHazard = item.hazardLevel === 'critical' || item.hazardLevel === 'dangerous';
          return (
            <div
              key={item.id}
              className={`bg-slate-900 border rounded-xl p-4 flex flex-col justify-between transition-all ${
                isHazard ? 'border-rose-900/60' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-sky-400 font-semibold">
                      {item.category} | {item.packageType}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 leading-snug">{item.name}</h3>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">
                      Part: <span className="text-slate-200 font-semibold">{item.partNumber}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      ${item.salvageValueEstimate} ea
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-500">Extracted from: </span>
                  <span>{item.extractedFrom}</span>
                </div>

                {item.safetyWarning && (
                  <div className="p-2 bg-rose-950/40 border border-rose-900/50 rounded-lg text-[11px] text-rose-300 flex items-start gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{item.safetyWarning}</span>
                  </div>
                )}

                <div className="p-2 bg-slate-950 border border-slate-800/80 rounded-lg text-[11px] text-slate-300 space-y-0.5 font-mono">
                  <div className="text-slate-500 text-[10px]">MULTIMETER TEST:</div>
                  <p className="line-clamp-2 leading-relaxed">{item.testProcedure}</p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectForBuild(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5 text-sky-400" />
                  <span>Build Project</span>
                </button>
                <button
                  onClick={() => onRemovePart(item.id)}
                  title="Remove from scrap bin"
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs">
          No scrap components found matching your filter. Click &ldquo;Add Salvaged Part&rdquo; or run the Computer Vision Dissector.
        </div>
      )}

      {/* Add Part Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">Add Salvaged Electronic Part</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPart} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Component Name</label>
                <input
                  type="text"
                  required
                  value={newPartName}
                  onChange={e => setNewPartName(e.target.value)}
                  placeholder="e.g. 5V Relay Module, 18650 Battery, NE555 Timer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Part / Marking No.</label>
                  <input
                    type="text"
                    value={newPartNumber}
                    onChange={e => setNewPartNumber(e.target.value)}
                    placeholder="e.g. LM317T, NE555, 1N4007"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as ComponentCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="ic">IC &amp; Microcontroller</option>
                    <option value="motor">Motor &amp; Stepper</option>
                    <option value="power">Power Supply &amp; Battery</option>
                    <option value="passive">Passive (Cap/Resistor/Diode)</option>
                    <option value="sensor">Sensor &amp; Switch</option>
                    <option value="hazard">High Voltage Hazard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Package Type</label>
                  <input
                    type="text"
                    value={newPackage}
                    onChange={e => setNewPackage(e.target.value)}
                    placeholder="e.g. TO-220, DIP-8, SOIC-16, 18650"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newQuantity}
                    onChange={e => setNewQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Extracted From (Donor Device)</label>
                <input
                  type="text"
                  value={newExtractedFrom}
                  onChange={e => setNewExtractedFrom(e.target.value)}
                  placeholder="e.g. Dead Microwave Control Board, HP Inkjet Printer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Multimeter Testing Procedure</label>
                <textarea
                  rows={2}
                  value={newTestProcedure}
                  onChange={e => setNewTestProcedure(e.target.value)}
                  placeholder="e.g. Diode check between pin 1 and 2 shows 0.65V forward drop..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-lg"
                >
                  Save to Bin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Multimeter Cheat Sheet Modal */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Multimeter Testing Cheat Sheet for Salvaged Electronics</span>
              </h3>
              <button
                onClick={() => setShowCheatSheet(false)}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="font-semibold text-sky-400">1. Testing Bipolar Transistors (NPN / PNP)</div>
                <p>
                  Put DMM in Diode Test mode. For NPN: Red probe to Base, Black to Collector &rarr; ~0.6V-0.7V. Red probe to Base, Black to Emitter &rarr; ~0.65V-0.75V. Any other probe combination must read &ldquo;OL&rdquo;. If 0.00V, transistor is shorted.
                </p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="font-semibold text-sky-400">2. Testing N-Channel MOSFETs (e.g. IRFZ44N)</div>
                <p>
                  Diode mode: Black probe to Source, Red to Drain (reads OL). Momentarily touch Red to Gate (charges gate capacitance). Now touch Red to Drain: MOSFET switches ON (~0.1V)! Touch Black to Gate to discharge: switches OFF immediately.
                </p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="font-semibold text-sky-400">3. Testing Stepper Motor Phases</div>
                <p>
                  Set DMM to 200 Ω Resistance. Probe pins in pairs. A 4-wire bipolar motor will show two independent pairs reading ~10 Ω to 30 Ω each. Pins across different coils will read infinite (&ldquo;OL&rdquo;).
                </p>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="font-semibold text-sky-400">4. Testing High-Voltage Capacitors</div>
                <p className="text-rose-300">
                  DANGER: Check DC Voltage first! If reading &gt; 5V, discharge through a 10k 5W resistor. Once 0.0V, switch to Resistance mode: reading should start near zero and continuously climb to &ldquo;OL&rdquo; as the meter battery charges the cap.
                </p>
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setShowCheatSheet(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
