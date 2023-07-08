import { config } from "./config";
import { calculateFeatures } from "./meta";
import { Random, tokenData } from "./random";

const R = new Random();
const cfg = config;

/* eslint-disable */

let audioContext;
let frequencyData;
let analyserNode;
let currentHue = 0;
let maxFrequencyTarget = 0;
let audio;
let progress = 0;

let normalizedFreq = 0;

const audioFile = "assets/audio/nova.mp3";

// Draw a basic polygon, handles triangles, squares, pentagons, etc
function polygon(x, y, radius, sides = 3, angle = 0) {
  beginShape();
  for (let i = 0; i < sides; i++) {
    const a = angle + TWO_PI * (i / sides);
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;

    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function mousePressed() {
  // Only initiate audio upon a user gesture
  if (!audioContext) {
    audioContext = new AudioContext();

    // Make a stream source, i.e. MP3, microphone, etc
    // In this case we choose an <audio> element
    audio = document.createElement("audio");

    // Upon loading the audio, let's play it
    audio.addEventListener(
      "canplay",
      () => {
        // First, ensure the context is in a resumed state
        audioContext.resume();
        // Now, play the audio
        audio.play();
      },
      { once: true }
    );

    // Enable looping
    audio.loop = true;

    // Set source
    audio.crossOrigin = "Anonymous";
    audio.src = audioFile;

    // Connect source into the WebAudio context
    const source = audioContext.createMediaElementSource(audio);
    source.connect(audioContext.destination);

    analyserNode = audioContext.createAnalyser();

    const detail = 4;
    analyserNode.fftSize = 2048 * detail;

    analyserNode.minDecibels = -100;
    analyserNode.maxDecibels = -50;
    frequencyData = new Float32Array(analyserNode.frequencyBinCount);

    source.connect(analyserNode);
  } else {
    audio.pause();
    audioContext.close();
    audioContext = null;
  }
}

// Convert the frequency in Hz to an index in the array
function frequencyToIndex(frequencyHz, sampleRate, frequencyBinCount) {
  const nyquist = sampleRate / 2;
  const index = Math.round((frequencyHz / nyquist) * frequencyBinCount);

  return Math.min(frequencyBinCount, Math.max(0, index));
}

// Convert an index in a array to a frequency in Hz
function indexToFrequency(index, sampleRate, frequencyBinCount) {
  return (index * sampleRate) / (frequencyBinCount * 2);
}

// Get the normalized audio signal (0..1) between two frequencies
function audioSignal(analyser, frequencies, minHz, maxHz) {
  if (!analyser) return 0;

  const sampleRate = analyser.context.sampleRate;
  const binCount = analyser.frequencyBinCount;

  let start = frequencyToIndex(minHz, sampleRate, binCount);
  const end = frequencyToIndex(maxHz, sampleRate, binCount);
  const count = end - start;

  let sum = 0;

  for (; start < end; start++) {
    sum += frequencies[start];
  }

  const minDb = analyserNode.minDecibels;
  const maxDb = analyserNode.maxDecibels;

  const valueDb = count === 0 || !isFinite(sum) ? minDb : sum / count;

  return map(valueDb, minDb, maxDb, 0, 1, true);
}

// Find the frequency band that has the most peak signal
function audioMaxFrequency(analyserNode, frequencies) {
  let maxSignal = -Infinity;
  let maxSignalIndex = 0;
  for (let i = 0; i < frequencies.length; i++) {
    const signal = frequencies[i];
    if (signal > maxSignal) {
      maxSignal = signal;
      maxSignalIndex = i;
    }
  }
  return indexToFrequency(maxSignalIndex, analyserNode.context.sampleRate, analyserNode.frequencyBinCount);
}

function damp(a, b, lambda, dt) {
  return lerp(a, b, 1 - Math.exp(-lambda * dt));
}

const kandinskyPalette = [
  [255, 0, 0], // Red
  [0, 255, 0], // Green
  [0, 0, 255], // Blue
  [255, 255, 0], // Yellow
  [255, 0, 255], // Magenta
  [0, 255, 255], // Cyan
  [255, 128, 0], // Orange
  [128, 0, 255], // Purple
  [0, 255, 128], // Light Green
  [128, 255, 0], // Lime
  [0, 128, 255], // Sky Blue
  [255, 0, 128], // Pink
];

// Define color thresholds for different frequency bands
const colorThresholds = [
  { frequency: 100, color: [255, 0, 0] }, // Red
  { frequency: 200, color: [0, 255, 0] }, // Green
  { frequency: 300, color: [0, 0, 255] }, // Blue
  { frequency: 400, color: [255, 255, 0] }, // Yellow
  { frequency: 500, color: [255, 0, 255] }, // Magenta
  { frequency: 600, color: [0, 255, 255] }, // Cyan
  { frequency: 700, color: [255, 128, 0] }, // Orange
  { frequency: 800, color: [128, 0, 255] }, // Purple
  { frequency: 900, color: [0, 255, 128] }, // Light Green
  { frequency: 1000, color: [128, 255, 0] }, // Lime
  { frequency: 1100, color: [0, 128, 255] }, // Sky Blue
  { frequency: 1200, color: [255, 0, 128] }, // Pink
  // Add more frequency bands and colors as needed
];

let waveform, waveform_two;
let initialSize = 0;
const growthRate = 0.0001; // Controls the speed of growth.
const maxLifespan = 20000; // Time (in frames) until a circle disappears.
const count = 20000;
const minBaseHz = 0;
const maxBaseHz = count;

// Setup Canvas
window.setup = () => {
  createCanvas(windowWidth, windowHeight);

  // Optional:
  // If the user inserts/removes bluetooth headphones or pushes
  // the play/pause media keys, we can use the following to ignore the action
  navigator.mediaSession.setActionHandler("pause", () => {});

  // Initialize the first circle.
  waveform = { x: width / 2, y: height / 2, size: initialSize, lifespan: maxLifespan };
  waveform_two = { x: width / 2, y: height / 2, size: initialSize, lifespan: maxLifespan };
};

let scaleSize = 9000;

let signalHistory = Array(25).fill(0);
let secondSignalHistory = Array(25).fill(0);

window.draw = () => {
  // fill background
  background("black");

  if (analyserNode) {
    analyserNode.getFloatFrequencyData(frequencyData);

    maxFrequencyTarget = map(audioMaxFrequency(analyserNode, frequencyData), 0, scaleSize, 0, 720, true);
    const maxFreq = audioMaxFrequency(analyserNode, frequencyData);

    normalizedFreq = damp(normalizedFreq, map(maxFreq, 0, scaleSize, 0, 1), 0.1, deltaTime);
  }

  // Update and draw waveforms.

  const maxSize = Math.min(width, height) / 32;

  // Update size and lifespan.
  if (waveform.size >= height) {
    waveform.size -= Math.min(waveform.size + growthRate * normalizedFreq, maxSize); //
  } else {
    waveform.size += Math.min(waveform.size + growthRate * normalizedFreq, maxSize); // The waveform grows faster when the music is louder.
  }

  // Draw waveform.

  beginShape();

  const historyLength = signalHistory.length;

  for (let i = 0; i < count; i++) {
    const minHz = map(count - i, 0, count, minBaseHz, maxBaseHz);
    const maxHz = map(count - i + 1, 0, count, minBaseHz, maxBaseHz);

    let signal = analyserNode ? audioSignal(analyserNode, frequencyData, minHz, maxHz) : 0;

    signalHistory[i % historyLength] = signal;

    const averageSignal = signalHistory.reduce((a, b) => a + b, 0) / historyLength;

    const baseSize = map(i, 0, count - 1, waveform.size, waveform.size) * normalizedFreq * 0.05;

    const size = baseSize + waveform.size * averageSignal;

    const angle = map(i, 0, 360, 0, PI);

    const x = waveform.x + size * cos(-angle);
    const y = waveform.y + size * sin(angle);

    stroke(255, 255, 255, 45);

    noFill();

    vertex(x, y);
  }

  endShape(CLOSE);

  // //diff freqs
  // beginShape();

  // for (let i = 0; i < count; i++) {
  //   const minHz = map(count - i, 0, count, 0, 500);
  //   const maxHz = map(count - i + 1, 0, count, 0, 500);

  //   let signal = analyserNode ? audioSignal(analyserNode, frequencyData, minHz, maxHz) : 0;

  //   secondSignalHistory[i % secondSignalHistoryLength] = signal;

  //   const averageSignal = secondSignalHistory.reduce((a, b) => a + b, 0) / historyLength;

  //   const baseSize = map(i, 0, count - 1, initialSize, initialSize) * normalizedFreq * 0.05;

  //   const size = baseSize + initialSize * averageSignal;

  //   const angle = map(i, 0, 360, 0, PI);

  //   const x = waveform.x + size * cos(angle);
  //   const y = waveform.y + size * sin(angle);

  //   stroke(255, 255, 255, 10);
  //   // vertex(x, y);
  // }

  // endShape(CLOSE);

  if (!audioContext) {
    const dim = min(width, height);
    fill("white");
    noStroke();
    polygon(width / 2, height / 2, dim * 0.1, 3);
  }
};

window.onload = () => {
  mousePressed();
};

window.windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
};

calculateFeatures(tokenData);
