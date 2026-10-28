import React, { useState } from 'react';
import {
  RotateCcw,
  Compass,
  Eye,
  Info,
  Maximize2,
  Sparkles,
  Layers,
  HelpCircle,
  X,
  Volume2,
} from 'lucide-react';
import { SceneCanvas } from './components/SceneCanvas';
import { PingalaInspector } from './components/PingalaInspector';
import { SriYantraInspector } from './components/SriYantraInspector';
import { soundEngine } from './utils/soundEngine';

export default function App() {
  // Navigation Modes: 'pingala' | 'sri-yantra'
  const [mode, setMode] = useState('pingala');

  // Camera & Scene Controls
  const [autoRotate, setAutoRotate] = useState(false);
  const [cameraPreset, setCameraPreset] = useState('iso');

  // Mode 1: Pingala State
  const [maxRows, setMaxRows] = useState(7);
  const [selectedCell, setSelectedCell] = useState({ n: 4, k: 2 }); // default selection C(4,2)=6
  const [showFibonacci, setShowFibonacci] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState(null);

  // Mode 2: Sri Yantra State
  const [elevation, setElevation] = useState(1.0); // 0 (2D Bhu) to 1.0 (3D Meru)
  const [selectedTierId, setSelectedTierId] = useState(1);

  // Help & Educational Modal
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleSelectMode = (newMode) => {
    soundEngine.playSelectSound();
    setMode(newMode);
  };

  const handleCameraPreset = (preset) => {
    soundEngine.playSelectSound();
    setCameraPreset(preset);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#08090f] text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3.5 glass-panel border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#08090f] rounded-[10px] flex items-center justify-center">
              <span className="font-cinzel text-amber-400 font-black text-lg">मे</span>
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white font-cinzel m-0 p-0 flex items-center gap-2">
              Meru Prastara
              <span className="text-xs font-normal text-amber-400/90 font-sans px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                मेरु प्रस्तार
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Interactive 3D Sacred Combinatorics & Architectural Elevation
            </p>
          </div>
        </div>

        {/* Central Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-700/80 shadow-inner">
          <button
            onClick={() => handleSelectMode('pingala')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'pingala'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md gold-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Pingala's Combinatorial Pyramid
          </button>
          <button
            onClick={() => handleSelectMode('sri-yantra')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'sri-yantra'
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-bold shadow-md cyan-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Sri Yantra Maha Meru
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Historical Context
          </button>
        </div>
      </header>

      {/* Main 3D Viewport with Left Floating Camera Dock and Right Inspector Panel */}
      <div className="relative w-full h-full flex pt-16">
        {/* Floating Camera Presets Dock (Left) */}
        <div className="absolute left-6 top-24 z-10 flex flex-col gap-2 p-2 rounded-2xl glass-panel">
          <span className="text-[10px] uppercase font-bold text-slate-400 text-center tracking-wider mb-1">
            Camera
          </span>
          <button
            onClick={() => handleCameraPreset('iso')}
            className={`p-2.5 rounded-xl transition-all ${
              cameraPreset === 'iso'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300'
            }`}
            title="Isometric Mountain View"
          >
            <MountainIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleCameraPreset('top')}
            className={`p-2.5 rounded-xl transition-all ${
              cameraPreset === 'top'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300'
            }`}
            title="Top-Down Bhu Prastara View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleCameraPreset('front')}
            className={`p-2.5 rounded-xl transition-all ${
              cameraPreset === 'front'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300'
            }`}
            title="Front Elevation View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-700/60 my-0.5" />
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-xl transition-all ${
              autoRotate
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300'
            }`}
            title={autoRotate ? 'Stop Rotation' : 'Auto Rotate Scene'}
          >
            <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 3D WebGL Canvas Area */}
        <div className="w-full h-full relative">
          <SceneCanvas
            mode={mode}
            autoRotate={autoRotate}
            cameraPreset={cameraPreset}
            // Mode 1
            maxRows={maxRows}
            selectedCell={selectedCell}
            onSelectCell={setSelectedCell}
            showFibonacci={showFibonacci}
            highlightedRow={highlightedRow}
            // Mode 2
            elevation={elevation}
            selectedTierId={selectedTierId}
            onSelectTier={setSelectedTierId}
          />

          {/* Quick HUD Hint on bottom left */}
          <div className="absolute bottom-5 left-6 z-10 glass-panel-subtle px-3 py-1.5 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Click any 3D element to inspect • Left-click + drag to orbit • Scroll to zoom</span>
          </div>
        </div>

        {/* Right HUD Inspector Panel (Glassmorphism Sidebar) */}
        <aside className="w-96 h-full z-10 glass-panel border-l border-amber-500/20 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white font-cinzel m-0 p-0">
                {mode === 'pingala' ? "Pingala's Chhandas Inspector" : 'Maha Meru Avarana Inspector'}
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {mode === 'pingala' ? '200 BCE' : 'Sacred Elevation'}
            </span>
          </div>

          <div className="flex-1">
            {mode === 'pingala' ? (
              <PingalaInspector
                selectedCell={selectedCell}
                maxRows={maxRows}
                setMaxRows={setMaxRows}
                showFibonacci={showFibonacci}
                setShowFibonacci={setShowFibonacci}
                highlightedRow={highlightedRow}
                setHighlightedRow={setHighlightedRow}
              />
            ) : (
              <SriYantraInspector
                elevation={elevation}
                setElevation={setElevation}
                selectedTierId={selectedTierId}
                onSelectTier={setSelectedTierId}
              />
            )}
          </div>
        </aside>
      </div>

      {/* Historical Context Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-cinzel text-xl font-bold">
                मेरु
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-cinzel m-0">
                  The Dual Heritage of Meru Prastara
                </h2>
                <p className="text-xs text-amber-400">
                  Mathematics of Sanskrit Prosody & Sacred Hindu Architecture
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 space-y-1.5">
                <h4 className="font-semibold text-amber-300 text-sm">
                  1. Pingala's Chhandas-shastra (c. 200 BCE)
                </h4>
                <p>
                  Long before Blaise Pascal (1654 CE), Indian scholar Pingala formalized binomial coefficients in his work on poetic meters (*Chhandas-shastra*).
                  In the 10th century CE, commentator <strong>Halayudha</strong> coined the exact term <em>Meru Prastara</em> ("Staircase of Mount Meru") to describe the stepped pyramidal diagram:
                </p>
                <blockquote className="border-l-2 border-amber-500 pl-3 py-1 italic text-slate-400">
                  "Pare pūrṇaṃ dvitīyādau tūbhayam... The first row is filled with unity; in the second and succeeding rows, each chamber is filled with the sum of the two above it."
                </blockquote>
                <p>
                  The shallow diagonals form the <em>Matra Meru</em> sequence, identified by Acharya Virahanka (c. 600 CE) centuries before Fibonacci.
                </p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 space-y-1.5">
                <h4 className="font-semibold text-sky-300 text-sm">
                  2. Tantric & Architectural Maha Meru
                </h4>
                <p>
                  In Tantric sacred geometry, <em>Meru Prastara</em> is the 3D stepped pyramidal manifestation of the 2D <em>Sri Yantra</em> (known as <em>Bhu Prastara</em> when flat).
                  The 9 interlocking levels (<em>Avaranas</em>) rise from the square earthly <em>Bhupura</em> fortress through concentric lotus rings and 43 interlocking triangles to the apex <em>Bindu</em>, representing cosmic manifestation from the non-dual supreme source.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Close & Return to 3D Space
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
