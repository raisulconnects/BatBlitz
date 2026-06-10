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
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume || 0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
  }
}

function playNoise(duration, volume) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume || 0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
  } catch (e) {
  }
}

function playToneSweep(startFreq, endFreq, duration, type, volume) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume || 0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
  }
}

function playArpeggio(notes, noteDuration, type, volume) {
  notes.forEach(function (freq, i) {
    setTimeout(function () { playTone(freq, noteDuration, type, volume); }, i * (noteDuration * 1000));
  });
}

function playButtonSound() {
  playTone(800, 0.04, 'square', 0.04);
}

function playRunSound() {
  playToneSweep(440, 880, 0.08, 'square', 0.06);
}

function playBoundarySound() {
  playArpeggio([523, 659, 784], 0.1, 'square', 0.07);
}

function playSixSound() {
  playArpeggio([523, 659, 784, 1047], 0.08, 'square', 0.07);
}

function playWicketSound() {
  playToneSweep(300, 100, 0.35, 'triangle', 0.08);
  setTimeout(function () { playNoise(0.1, 0.04); }, 50);
}

function playWinSound() {
  playArpeggio([523, 587, 659, 784, 1047], 0.15, 'square', 0.07);
}

function playChaseSound() {
  playArpeggio([440, 523, 659], 0.12, 'square', 0.06);
}

function playTossRevealSound() {
  playArpeggio([330, 440, 523, 659], 0.06, 'triangle', 0.05);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    playButtonSound,
    playRunSound,
    playBoundarySound,
    playSixSound,
    playWicketSound,
    playWinSound,
    playChaseSound,
    playTossRevealSound,
  };
}
