// audio.js

export const OSCILLATOR_TYPES = {
  SINE: "sine",
  SQUARE: "square",
  TRIANGLE: "triangle",
  SAWTOOTH: "sawtooth",
};

const BEEP_OSCILLATOR_TYPE = OSCILLATOR_TYPES.TRIANGLE; // Kind of harsh, high-pitched
const BEEP_FREQUENCY_HZ = 880; // kind of high frequency
const BEEP_DURATION_SECONDS = 0.15;
const BEEP_GAIN = 1; // Gain for the beep sound 1 = 100% volume
const BEEP_GAIN_SMALLEST = 0.001; // for exponential fade

// Create and reuse a global AudioContext
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Plays a short beep sound using Web Audio API.
 */
export function playBeep() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.type = BEEP_OSCILLATOR_TYPE;
  oscillator.frequency.value = BEEP_FREQUENCY_HZ;

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  // Fade to prevent click/pop at end
  gain.gain.setValueAtTime(BEEP_GAIN, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    BEEP_GAIN_SMALLEST,
    audioCtx.currentTime + BEEP_DURATION_SECONDS
  );

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + BEEP_DURATION_SECONDS);
}
