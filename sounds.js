let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(frequency, duration, type, volume) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume || 0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
  }
}

function playButtonSound() {
  playTone(500, 0.05, 'sine', 0.04);
}

function playRunSound() {
  playTone(660, 0.1, 'sine', 0.1);
}

function playBoundarySound() {
  playTone(880, 0.15, 'sine', 0.12);
  setTimeout(function () { playTone(1100, 0.15, 'sine', 0.1); }, 100);
}

function playWicketSound() {
  playTone(300, 0.3, 'sawtooth', 0.08);
  setTimeout(function () { playTone(150, 0.4, 'sawtooth', 0.06); }, 150);
}

function playWinSound() {
  [523, 659, 784, 1047].forEach(function (freq, i) {
    setTimeout(function () { playTone(freq, 0.25, 'sine', 0.1); }, i * 150);
  });
}

function playChaseSound() {
  [523, 659, 784].forEach(function (freq, i) {
    setTimeout(function () { playTone(freq, 0.2, 'sine', 0.08); }, i * 120);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    playButtonSound,
    playRunSound,
    playBoundarySound,
    playWicketSound,
    playWinSound,
    playChaseSound,
  };
}
