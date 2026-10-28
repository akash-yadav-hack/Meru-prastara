import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Binary, Layers } from 'lucide-react';
import { nCr, generateProsodyCombinations } from '../utils/mathUtils';
import { soundEngine } from '../utils/soundEngine';

export function PingalaInspector({
  selectedCell,
  maxRows,
  setMaxRows,
  showFibonacci,
  setShowFibonacci,
  highlightedRow,
  setHighlightedRow,
}) {
  const [activeMeterIndex, setActiveMeterIndex] = useState(null);
  const [isPlayingRhythm, setIsPlayingRhythm] = useState(false);
  const [activeProsodyStr, setActiveProsodyStr] = useState(null);

  if (!selectedCell) {
    return (
      <div className="p-4 space-y-4">
        <div className="text-center py-6 border border-dashed border-amber-500/30 rounded-xl bg-amber-500/5">
          <Binary className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-pulse" />
          <p className="text-sm text-slate-300 font-medium">Select any 3D Meru Block</p>
          <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto">
            Click any stepped block to reveal Pingala's combinatorics, Halayudha's sum rule, and Sanskrit prosody meters.
          </p>
        </div>

        {/* Global Controls */}
        <div className="space-y-3 pt-2 border-t border-slate-700/50">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Pyramid Rows (n):</span>
              <span className="font-mono text-amber-400 font-bold">{maxRows}</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              value={maxRows}
              onChange={(e) => setMaxRows(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-300">Matra Meru (Fibonacci Diagonals):</span>
            <button
              onClick={() => setShowFibonacci(!showFibonacci)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                showFibonacci
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 gold-glow'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
              }`}
            >
              {showFibonacci ? 'Active' : 'Off'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { n, k } = selectedCell;
  const val = nCr(n, k);
  const p1Val = n > 0 && k > 0 ? nCr(n - 1, k - 1) : 0;
  const p2Val = n > 0 && k < n ? nCr(n - 1, k) : 0;

  // Syllables combinations
  const prosodyCombos = generateProsodyCombinations(n, k);

  const handlePlayRhythm = (meterStr) => {
    setActiveProsodyStr(meterStr);
    setIsPlayingRhythm(true);
    soundEngine.playMeterSequence(
      meterStr,
      (activeIdx) => setActiveMeterIndex(activeIdx),
      () => {
        setIsPlayingRhythm(false);
        setActiveMeterIndex(null);
        setActiveProsodyStr(null);
      }
    );
  };

  const handleStopRhythm = () => {
    soundEngine.stopSequence();
    setIsPlayingRhythm(false);
    setActiveMeterIndex(null);
    setActiveProsodyStr(null);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Selected Header */}
      <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-sky-500/30 cyan-glow">
        <div>
          <span className="text-[10px] tracking-wider uppercase text-sky-400 font-semibold">Selected Cell</span>
          <h3 className="text-lg font-bold text-white font-code">
            C({n}, {k}) = <span className="text-amber-400 text-xl">{val}</span>
          </h3>
          <p className="text-xs text-slate-400">
            Row <span className="text-slate-200 font-mono">{n}</span> • Laghu Count <span className="text-slate-200 font-mono">{k}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase">Guru (Long)</span>
          <p className="text-sm font-bold text-emerald-400 font-mono">{n - k}</p>
        </div>
      </div>

      {/* Halayudha's Addition Rule formula */}
      <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/60 text-xs">
        <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider">
          Halayudha's Addition Rule (c. 950 CE)
        </span>
        <div className="mt-1 font-code text-slate-200 text-sm flex items-center justify-between">
          <span>
            {n === 0 ? (
              <span>Apex = 1</span>
            ) : (
              <span>
                <span className="text-amber-300">{p1Val}</span> + <span className="text-amber-300">{p2Val}</span> = <span className="text-sky-300 font-bold">{val}</span>
              </span>
            )}
          </span>
          <span className="text-[11px] text-slate-400">
            {n === 0 ? 'प्रस्तार शीर्ष' : `C(${n-1},${k-1}) + C(${n-1},${k})`}
          </span>
        </div>
      </div>

      {/* Sanskrit Prosody Meters (Chhandas) */}
      <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-semibold text-sky-400 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Sanskrit Meters (छन्दः प्रस्तार)
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {prosodyCombos.length} {prosodyCombos.length === 1 ? 'Form' : 'Forms'}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
          Permutations of <span className="text-sky-300 font-medium">{k} Laghu (L, 1-beat)</span> and{' '}
          <span className="text-emerald-300 font-medium">{n - k} Guru (G, 2-beats)</span>:
        </p>

        {/* Syllable Combinations Pills */}
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          {prosodyCombos.map((combo, idx) => {
            const isPlayingThis = isPlayingRhythm && activeProsodyStr === combo;
            return (
              <button
                key={`combo-${idx}`}
                onClick={() => (isPlayingThis ? handleStopRhythm() : handlePlayRhythm(combo))}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-code text-xs transition-all ${
                  isPlayingThis
                    ? 'bg-sky-500 text-slate-900 font-bold shadow-md shadow-sky-500/50'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/70'
                }`}
                title="Click to play acoustic bell rhythm for this meter"
              >
                <span>
                  {combo.split('').map((char, cIdx) => (
                    <span
                      key={cIdx}
                      className={
                        isPlayingThis && activeMeterIndex === cIdx
                          ? 'text-yellow-300 underline font-extrabold text-sm'
                          : char === 'L'
                          ? 'text-sky-300'
                          : 'text-amber-300'
                      }
                    >
                      {char}
                    </span>
                  ))}
                </span>
                {isPlayingThis ? (
                  <VolumeX className="w-3 h-3 text-slate-900 animate-pulse" />
                ) : (
                  <Volume2 className="w-3 h-3 opacity-40 group-hover:opacity-100 text-slate-400 group-hover:text-amber-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row Tier Focus & Row Powers of 2 */}
      <div className="space-y-2 pt-2 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300">Highlight Tier {n} (Row Sum):</span>
          <button
            onClick={() => setHighlightedRow(highlightedRow === n ? null : n)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              highlightedRow === n
                ? 'bg-amber-500 text-slate-900 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {highlightedRow === n ? `Σ = 2^${n} (${Math.pow(2, n)})` : `Focus Row ${n}`}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-300">Fibonacci Diagonals:</span>
          <button
            onClick={() => setShowFibonacci(!showFibonacci)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              showFibonacci
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {showFibonacci ? 'Active' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  );
}
