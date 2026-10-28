// Web Audio API synthesizer for Sanskrit Chhandas prosody rhythms
// Laghu (L) = 1 matra (short tone, ~180ms, crisp bell/mridangam treble)
// Guru (G) = 2 matras (long tone, ~360ms, resonant bronze bell/damaru deep pitch)

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.activeTimeouts = [];
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play a metallic bell / singing bowl / mridangam chime
  playTone(freq, duration, type = 'sine', gainVal = 0.3) {
    this.init();
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Warm envelope with natural acoustic decay
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Add harmonic subtle overtone
    const overtone = ctx.createOscillator();
    const overGain = ctx.createGain();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2.76, now);
    overGain.gain.setValueAtTime(gainVal * 0.25, now + 0.02);
    overGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    overtone.connect(overGain);
    overGain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);

    osc.stop(now + duration);
    overtone.stop(now + duration);
  }

  // Play short Laghu syllable
  playLaghu() {
    // 587.33 Hz (D5) - crisp, bright
    this.playTone(587.33, 0.22, 'sine', 0.28);
  }

  // Play long Guru syllable
  playGuru() {
    // 293.66 Hz (D4) - deeper, prolonged resonance
    this.playTone(293.66, 0.48, 'triangle', 0.35);
  }

  // Play click / select feedback
  playSelectSound() {
    this.playTone(880, 0.1, 'sine', 0.15);
  }

  // Play full sequence of Laghu (L) and Guru (G) syllables
  playMeterSequence(sequenceStr, onSyllableActive = null, onFinish = null) {
    this.init();
    this.stopSequence();
    this.isPlaying = true;

    const letters = sequenceStr.split('');
    let cumulativeDelay = 100; // start after 100ms
    const laghuDuration = 260; // ms
    const guruDuration = 480; // ms
    const pauseBetween = 80; // ms

    letters.forEach((char, index) => {
      const isGuru = char === 'G';
      const stepDuration = isGuru ? guruDuration : laghuDuration;

      const tId = setTimeout(() => {
        if (!this.isPlaying) return;
        if (onSyllableActive) onSyllableActive(index);
        if (isGuru) {
          this.playGuru();
        } else {
          this.playLaghu();
        }
      }, cumulativeDelay);

      this.activeTimeouts.push(tId);
      cumulativeDelay += stepDuration + pauseBetween;
    });

    const finalId = setTimeout(() => {
      this.isPlaying = false;
      if (onSyllableActive) onSyllableActive(null);
      if (onFinish) onFinish();
    }, cumulativeDelay + 100);

    this.activeTimeouts.push(finalId);
  }

  stopSequence() {
    this.isPlaying = false;
    this.activeTimeouts.forEach((id) => clearTimeout(id));
    this.activeTimeouts = [];
  }
}

export const soundEngine = new SoundEngine();
