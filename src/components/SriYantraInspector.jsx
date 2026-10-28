import React from 'react';
import { Compass, Sparkles, ChevronRight, Mountain } from 'lucide-react';
import { SRI_YANTRA_TIERS } from '../data/sriYantraData';

export function SriYantraInspector({
  elevation,
  setElevation,
  selectedTierId,
  onSelectTier,
}) {
  const selectedTier = SRI_YANTRA_TIERS.find((t) => t.id === selectedTierId) || SRI_YANTRA_TIERS[0];

  return (
    <div className="p-4 space-y-4">
      {/* 2D to 3D Elevation / Exploded View Slider */}
      <div className="bg-slate-900/60 p-3.5 rounded-xl border border-amber-500/30 gold-glow space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-amber-300 flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5" />
            Elevation (प्रस्तार उन्नयन)
          </span>
          <span className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded text-[11px]">
            {elevation === 0
              ? 'Flat 2D (भू-प्रस्तार)'
              : elevation === 1
              ? 'Full 3D (महा मेरु)'
              : `${Math.round(elevation * 100)}%`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={elevation}
          onChange={(e) => setElevation(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <button
            onClick={() => setElevation(0)}
            className="hover:text-amber-400 transition-colors"
          >
            Flat 2D (Bhu)
          </button>
          <button
            onClick={() => setElevation(0.5)}
            className="hover:text-amber-400 transition-colors"
          >
            Mid (50%)
          </button>
          <button
            onClick={() => setElevation(1.0)}
            className="hover:text-amber-400 transition-colors"
          >
            Mountain (Meru)
          </button>
        </div>
      </div>

      {/* Selected Avarana Tier Card */}
      <div className="bg-slate-900/50 p-4 rounded-xl border border-sky-500/40 cyan-glow space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">
            Avarana Tier {selectedTier.id} of 9
          </span>
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTier.color }} />
        </div>

        <div>
          <h3 className="text-base font-bold text-white font-cinzel">
            {selectedTier.sanskritName}
          </h3>
          <p className="text-xs text-amber-400 font-medium">
            {selectedTier.englishName}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-700/60 space-y-1.5 text-xs">
          <p className="text-slate-300 leading-relaxed">
            <span className="text-slate-400 font-semibold">Geometry: </span>
            {selectedTier.geometry}
          </p>
          <p className="text-slate-300 leading-relaxed">
            <span className="text-slate-400 font-semibold">Spiritual Significance: </span>
            {selectedTier.symbolism}
          </p>
        </div>
      </div>

      {/* 9 Avarana Tiers Selector List */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1">
          Explore 9 Sacred Avaranas:
        </span>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {SRI_YANTRA_TIERS.map((tier) => (
            <button
              key={`tier-btn-${tier.id}`}
              onClick={() => onSelectTier(tier.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-all ${
                selectedTierId === tier.id
                  ? 'bg-amber-500/20 border border-amber-500/60 text-amber-200'
                  : 'bg-slate-900/40 hover:bg-slate-800/60 text-slate-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-[10px] text-slate-400">0{tier.id}</span>
                <span className="truncate">{tier.sanskritName}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
