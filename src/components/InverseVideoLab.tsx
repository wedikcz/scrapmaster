import React, { useState, useRef, useEffect } from 'react';
import {
  VideoEngineeringAnalysis,
  FrameMotionAnalysis,
  MotionVector,
  RepurposingIdea
} from '../types/scrap';
import {
  BENCHMARK_VIDEO_ANALYSES,
  analyzeUploadedVideoFile
} from '../services/inverseVideoEngine';
import {
  Film,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Download,
  Activity,
  Layers,
  Wrench,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Cpu,
  FileCode,
  FileText,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Info
} from 'lucide-react';

interface InverseVideoLabProps {
  onLoadProject: (projectId: string) => void;
  onSendToBuild?: (repurposeIdea: RepurposingIdea) => void;
}

export const InverseVideoLab: React.FC<InverseVideoLabProps> = ({
  onLoadProject,
  onSendToBuild
}) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<VideoEngineeringAnalysis>(
    BENCHMARK_VIDEO_ANALYSES[0]
  );
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ percent: number; log: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'mechanism' | 'vectors' | 'repair' | 'repurpose' | 'iocontract' | 'logs'>('mechanism');
  const [showVectorsOnCanvas, setShowVectorsOnCanvas] = useState(true);
  const [vectorGridFilter, setVectorGridFilter] = useState<'all' | 'high_motion'>('all');
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  const activeKeyFrame =
    selectedAnalysis.keyFrames[activeFrameIndex % selectedAnalysis.keyFrames.length] ||
    selectedAnalysis.keyFrames[0];

  // Playback timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveFrameIndex(prev => {
          const next = prev + 1;
          if (next >= selectedAnalysis.motionTimeline.length) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedAnalysis.motionTimeline.length]);

  // Draw optical flow motion vector field overlay onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!showVectorsOnCanvas) return;

    const vectors = activeKeyFrame.vectorField || [];
    for (const vec of vectors) {
      if (vectorGridFilter === 'high_motion' && vec.magnitude < 5.0) continue;
      const px = (vec.x / 100) * canvas.width;
      const py = (vec.y / 100) * canvas.height;
      const vx = vec.vx * 1.5;
      const vy = vec.vy * 1.5;

      // Color code by velocity / stiction
      const isStiction = vec.magnitude > 20.0;
      const color = isStiction ? '#f43f5e' : vec.magnitude > 8.0 ? '#38bdf8' : '#34d399';

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.8;

      // Draw anchor point
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw vector line
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + vx, py + vy);
      ctx.stroke();

      // Draw vector arrowhead
      const headlen = 5;
      const angle = Math.atan2(vy, vx);
      ctx.beginPath();
      ctx.moveTo(px + vx, py + vy);
      ctx.lineTo(
        px + vx - headlen * Math.cos(angle - Math.PI / 6),
        py + vy - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        px + vx - headlen * Math.cos(angle + Math.PI / 6),
        py + vy - headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }, [activeKeyFrame, showVectorsOnCanvas, vectorGridFilter]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUploadedVideoUrl(url);
    setIsProcessingUpload(true);
    setUploadProgress({ percent: 5, log: 'Reading video container...' });

    try {
      const result = await analyzeUploadedVideoFile(file, (percent, log) => {
        setUploadProgress({ percent, log });
      });
      setSelectedAnalysis(result);
      setActiveFrameIndex(0);
    } catch {
      alert('Could not parse video format.');
    } finally {
      setIsProcessingUpload(false);
      setUploadProgress(null);
    }
  };

  const handleExportCSV = () => {
    let csv = 'Time(s),Velocity(mm/s),Acceleration(mm/s2),StictionDetected\n';
    selectedAnalysis.motionTimeline.forEach(row => {
      csv += `${row.time},${row.velocity},${row.acceleration},${row.stiction ? 1 : 0}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedAnalysis.id}_motion_telemetry.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSONReport = () => {
    const blob = new Blob([JSON.stringify(selectedAnalysis, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedAnalysis.id}_engineering_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeTimelineItem =
    selectedAnalysis.motionTimeline[activeFrameIndex % selectedAnalysis.motionTimeline.length] ||
    selectedAnalysis.motionTimeline[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Film className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-slate-100">
              Inverse Video Engineering &amp; Kinematic Extraction
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Lucas-Kanade optical flow, mechanical mechanism inference, wear diagnostics &amp; DIY repurposing generator.
          </p>
        </div>

        {/* Video Benchmarks Picker & Upload Button */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {BENCHMARK_VIDEO_ANALYSES.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedAnalysis(item);
                setActiveFrameIndex(0);
                setUploadedVideoUrl(null);
              }}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer text-xs ${
                selectedAnalysis.id === item.id
                  ? 'bg-slate-800 border-sky-500 text-sky-400 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.donorCategory}
            </button>
          ))}

          {/* Upload video file */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-lg cursor-pointer transition-colors shadow-sm">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Clip</span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Upload Processing Indicator Banner */}
      {isProcessingUpload && uploadProgress && (
        <div className="bg-slate-900 border border-sky-500/50 rounded-xl p-4 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-sky-300 font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>{uploadProgress.log}</span>
            </span>
            <span className="text-sky-400">{uploadProgress.percent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-400 transition-all duration-300"
              style={{ width: `${uploadProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Grid: Video/Motion Stage (Left) & Kinematic Synthesis (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Viewport & Vector Visualizer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
            {/* Viewport Header */}
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-sky-400 font-semibold">
                  {selectedAnalysis.videoTitle}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">{selectedAnalysis.fps} FPS</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVectorsOnCanvas(!showVectorsOnCanvas)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer border ${
                    showVectorsOnCanvas
                      ? 'bg-sky-950 text-sky-300 border-sky-700'
                      : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}
                >
                  {showVectorsOnCanvas ? 'Vectors: VISIBLE' : 'Vectors: HIDDEN'}
                </button>
              </div>
            </div>

            {/* Canvas / Video Interactive Player */}
            <div className="relative w-full h-[340px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center select-none shadow-inner">
              {/* Optional User Video element */}
              {uploadedVideoUrl ? (
                <video
                  ref={videoPlayerRef}
                  src={uploadedVideoUrl}
                  playsInline
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                /* High-fidelity Kinematic Mechanism Visual Simulation Canvas */
                <div className="relative w-full h-full flex flex-col justify-between p-4 overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle, #38bdf8 1px, transparent 1px),
                        linear-gradient(to right, #1e293b 1px, transparent 1px),
                        linear-gradient(to bottom, #1e293b 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  />
                  {/* Top HUD Telemetry */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] font-mono">
                    <span className="bg-slate-900/90 text-sky-400 px-2 py-0.5 rounded border border-slate-800">
                      T: {activeTimelineItem.time.toFixed(1)}s | Vel: {activeTimelineItem.velocity.toFixed(1)} mm/s
                    </span>
                    {activeTimelineItem.stiction ? (
                      <span className="bg-rose-950/90 text-rose-300 px-2 py-0.5 rounded border border-rose-800 font-semibold animate-pulse">
                        STICTION / DEAD-CENTER DETECTED
                      </span>
                    ) : (
                      <span className="bg-emerald-950/90 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                        LAMINAR FLOW: OK
                      </span>
                    )}
                  </div>

                  {/* Stylized Mechanism Schematic Representation */}
                  <div className="relative z-10 my-auto text-center space-y-1">
                    <div className="inline-block px-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur">
                      <div className="text-[11px] font-mono text-slate-400">
                        Inferred Kinematics:
                      </div>
                      <div className="text-sm font-bold text-slate-100">
                        {selectedAnalysis.inference.name}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                        {activeKeyFrame.detectedMotionType}
                      </div>
                    </div>
                  </div>

                  {/* Bottom legend */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Low Velocity</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        <span>High Translation</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>Friction Stiction</span>
                      </span>
                    </div>
                    <span>Lucas-Kanade 8&times;8 Grid</span>
                  </div>
                </div>
              )}

              {/* Vector Field Overlay Canvas */}
              <canvas
                ref={canvasRef}
                width={640}
                height={340}
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
              />
            </div>

            {/* Playback Controls & Timeline Scrubber */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play Simulation'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={() => setActiveFrameIndex(0)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                  title="Reset to 0.0s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Scrubber slider */}
                <input
                  type="range"
                  min={0}
                  max={selectedAnalysis.motionTimeline.length - 1}
                  value={activeFrameIndex % selectedAnalysis.motionTimeline.length}
                  onChange={e => {
                    setIsPlaying(false);
                    setActiveFrameIndex(Number(e.target.value));
                  }}
                  className="flex-1 accent-sky-400 cursor-pointer"
                />

                <span className="text-xs font-mono text-slate-400 w-16 text-right">
                  {activeTimelineItem.time.toFixed(1)}s / {selectedAnalysis.durationSeconds}s
                </span>
              </div>

              {/* Kinematic Waveform Graph (Velocity vs Time) */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Velocity Derivative Curve (&Delta;x/&Delta;t)</span>
                  <span className="text-sky-400">Peak: {selectedAnalysis.keyFrames[0]?.peakVelocity || 34.0} mm/s</span>
                </div>

                {/* SVG Mini Waveform Chart */}
                <div className="h-12 w-full flex items-end gap-1 pt-2">
                  {selectedAnalysis.motionTimeline.map((item, idx) => {
                    const isCurrent = (activeFrameIndex % selectedAnalysis.motionTimeline.length) === idx;
                    const heightPercent = Math.min(100, Math.max(10, (Math.abs(item.velocity) / 35) * 100));
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveFrameIndex(idx)}
                        style={{ height: `${heightPercent}%` }}
                        className={`flex-1 rounded-t transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-sky-400'
                            : item.stiction
                            ? 'bg-rose-500/70 hover:bg-rose-400'
                            : 'bg-slate-700 hover:bg-slate-500'
                        }`}
                        title={`T: ${item.time}s | Vel: ${item.velocity} mm/s`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Kinematic Inference & Revival Studio (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            {/* Mechanism Header */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span className="uppercase text-sky-400 font-semibold">
                  Kinematic Inference
                </span>
                <span className="text-emerald-400 font-semibold">
                  {Math.round(selectedAnalysis.inference.confidence * 100)}% Confidence
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">
                {selectedAnalysis.inference.name}
              </h3>
              <div className="text-xs text-slate-400 mt-1">
                Source: <span className="text-slate-200">{selectedAnalysis.donorCategory}</span>
              </div>
            </div>

            {/* Modular Tab Bar */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto text-xs">
              <button
                onClick={() => setActiveTab('mechanism')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'mechanism'
                    ? 'bg-slate-800 text-sky-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Operation
              </button>
              <button
                onClick={() => setActiveTab('repair')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'repair'
                    ? 'bg-slate-800 text-sky-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Repair &amp; Service
              </button>
              <button
                onClick={() => setActiveTab('repurpose')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'repurpose'
                    ? 'bg-slate-800 text-sky-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Repurposing ({selectedAnalysis.inference.repurposingOpportunities.length})
              </button>
              <button
                onClick={() => setActiveTab('iocontract')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'iocontract'
                    ? 'bg-slate-800 text-sky-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                I/O Contract
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'logs'
                    ? 'bg-slate-800 text-sky-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Logs
              </button>
            </div>

            {/* TAB 1: Mechanism Operation & Principles */}
            {activeTab === 'mechanism' && (
              <div className="space-y-4 text-xs">
                {/* Mechanical Advantage & Ratings */}
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">MECHANICAL ADVANTAGE</span>
                    <span className="text-slate-200 font-semibold">
                      {selectedAnalysis.inference.mechanicalAdvantage}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">ESTIMATED TORQUE</span>
                    <span className="text-amber-400 font-semibold">
                      {selectedAnalysis.inference.estimatedTorque}
                    </span>
                  </div>
                </div>

                {/* Operating Principles */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-300">How this Mechanism Works:</h4>
                  <div className="space-y-1.5">
                    {selectedAnalysis.inference.operatingPrinciples.map((principle, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg leading-relaxed text-slate-300 flex items-start gap-2"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>{principle}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wear & Backlash Analysis */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <span className="font-semibold text-amber-400 block">
                    Optical Backlash &amp; Wear Analysis:
                  </span>
                  <p className="text-slate-400 leading-relaxed font-sans">
                    {selectedAnalysis.inference.backlashAndWearAnalysis}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Repair & Restoration Steps */}
            {activeTab === 'repair' && (
              <div className="space-y-3 text-xs">
                <div className="font-semibold text-slate-300">
                  Salvage Refurbishment Protocol:
                </div>
                {selectedAnalysis.inference.repairProtocol.map(step => (
                  <div
                    key={step.step}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sky-400 font-bold">
                        Step {step.step}: {step.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Tool: {step.toolRequired}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-sans">
                      {step.action}
                    </p>
                    {step.lubricantOrConsumable && (
                      <div className="text-[11px] font-mono text-emerald-400 pt-1">
                        Lubricant: {step.lubricantOrConsumable}
                      </div>
                    )}
                  </div>
                ))}

                {/* Safety callouts */}
                <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-lg text-rose-300 space-y-1 font-mono text-[11px]">
                  <div className="font-bold flex items-center gap-1.5 text-rose-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Safety Precautions:</span>
                  </div>
                  {selectedAnalysis.inference.safetyProtocols.map((safe, idx) => (
                    <div key={idx}>&bull; {safe}</div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Repurposing & Revival Opportunities */}
            {activeTab === 'repurpose' && (
              <div className="space-y-3 text-xs">
                <div className="font-semibold text-slate-300">
                  High-Utility DIY Repurposing Projects:
                </div>
                {selectedAnalysis.inference.repurposingOpportunities.map((opp, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-100">{opp.title}</h4>
                        <div className="text-[11px] font-mono text-emerald-400">
                          Saves ~${opp.estimatedUtilityValue} vs buying commercial kit
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                        {opp.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-sans">
                      {opp.description}
                    </p>
                    <div className="text-[11px] font-mono text-slate-400">
                      Required Hardware: {opp.targetElectronics.join(', ')}
                    </div>
                    <button
                      onClick={() => {
                        if (onSendToBuild) {
                          onSendToBuild(opp);
                        } else {
                          onLoadProject('project-cnc-plotter');
                        }
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-sky-950/60 hover:bg-sky-900/70 text-sky-300 border border-sky-800 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Synthesize Blueprint in Prompt-to-Build Engine</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: Formal I/O Contract Schema Viewer */}
            {activeTab === 'iocontract' && (
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-300 mb-1">
                    Formal Input / Output Contract Definition
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Standardized JSON payload contract for the Inverse Video Engineering API microservice:
                  </p>
                </div>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-sky-400 font-bold mb-1">Input Format (Payload Schema):</div>
                    <pre className="text-slate-300 overflow-x-auto">
                      {JSON.stringify(selectedAnalysis.ioContract.inputSchema, null, 2)}
                    </pre>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-emerald-400 font-bold mb-1">Output Format (Response Schema):</div>
                    <pre className="text-slate-300 overflow-x-auto">
                      {JSON.stringify(selectedAnalysis.ioContract.outputSchema, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Telemetry Logs & Exporter */}
            {activeTab === 'logs' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">
                    Motion Telemetry Logs ({selectedAnalysis.motionTimeline.length} samples):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={handleExportJSONReport}
                      className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>JSON</span>
                    </button>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                  {selectedAnalysis.motionTimeline.map((row, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-slate-400 py-0.5 border-b border-slate-900"
                    >
                      <span>T: {row.time.toFixed(1)}s</span>
                      <span className="text-slate-300">V: {row.velocity.toFixed(1)} mm/s</span>
                      <span className="text-slate-500">A: {row.acceleration.toFixed(1)}</span>
                      <span
                        className={
                          row.stiction ? 'text-rose-400 font-bold' : 'text-emerald-400'
                        }
                      >
                        {row.stiction ? 'STICTION' : 'SMOOTH'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
