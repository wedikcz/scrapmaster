import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Upload,
  Download,
  Wand2,
  RefreshCw,
  Sliders,
  Layers,
  Check,
  X
} from 'lucide-react';

const SAMPLE_IMAGE_PROMPTS = [
  'Photorealistic 3D studio render of a mini 2-axis CNC drawing robot assembled from salvaged optical DVD drive steppers',
  'Clear technical illustration of a 18650 lithium battery power bank with TP4056 charger board in an Altoids tin',
  'Exploded engineering view of a 3-stage planetary reduction gearbox from an 18V cordless drill with labeled sun and planet gears',
  'Modern variable bench power supply prototype built from an ATX power supply with digital LED voltmeter display'
];

export const HardwareImageStudio: React.FC = () => {
  const [prompt, setPrompt] = useState(SAMPLE_IMAGE_PROMPTS[0]);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageNotes, setImageNotes] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      setReferenceImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setImageNotes(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          referenceImageBase64: referenceImage || undefined,
          mimeType: referenceImage?.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'
        })
      });

      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setImageNotes(data.text || data.note || null);
      } else {
        alert('Image generation response had no image.');
      }
    } catch (err: any) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `scrapmaster_hardware_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">
                  Hardware Concept &amp; Schematic Image Studio
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  gemini-nano-banana-2.1
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate photo concepts, wiring diagrams, 3D enclosure renderings, or edit uploaded hardware photos using text instructions.
              </p>
            </div>
          </div>
        </div>

        {/* Input & Prompt Area */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the electronic hardware, enclosure, or visual edit..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-sans"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors disabled:opacity-50 cursor-pointer shrink-0"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Image...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{referenceImage ? 'Edit with Nano Banana' : 'Generate with Nano Banana'}</span>
                </>
              )}
            </button>
          </div>

          {/* Optional Reference Image Upload for image editing */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>{referenceImage ? 'Change Reference Image' : 'Add Image to Edit (Optional)'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {referenceImage && (
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-[11px]">Reference image loaded</span>
                <button
                  onClick={() => setReferenceImage(null)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Preset Prompts */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 pt-1">
            <span className="text-slate-500">Preset ideas:</span>
            {SAMPLE_IMAGE_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(p)}
                className="text-slate-300 hover:text-amber-300 text-left hover:underline text-xs"
              >
                {p.slice(0, 38)}...
                {idx < SAMPLE_IMAGE_PROMPTS.length - 1 && <span className="ml-2 text-slate-600">|</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Image Stage */}
      {generatedImage ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>gemini-nano-banana-2.1 Output</span>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Image</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            {referenceImage && (
              <div className="space-y-1 text-center">
                <div className="text-[11px] font-mono text-slate-500">Original Reference</div>
                <img
                  src={referenceImage}
                  alt="Reference"
                  className="max-h-72 rounded-lg border border-slate-800 object-contain shadow-lg"
                />
              </div>
            )}
            <div className="space-y-1 text-center flex-1 flex flex-col items-center">
              <div className="text-[11px] font-mono text-amber-400">Generated / Edited Hardware Render</div>
              <img
                src={generatedImage}
                alt="Generated Hardware Visual"
                className="max-h-96 rounded-xl border border-amber-900/40 object-contain shadow-2xl"
              />
            </div>
          </div>

          {imageNotes && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono">
              {imageNotes}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500 text-xs space-y-2">
          <ImageIcon className="w-8 h-8 mx-auto text-slate-600" />
          <p>Enter a prompt above and click &ldquo;Generate with Nano Banana&rdquo; to create photorealistic hardware visuals or schematic diagrams.</p>
        </div>
      )}
    </div>
  );
};
