import { config } from "./config";
import { calculateFeatures } from "./meta";
import { Waveform } from "./modules/waveform";
import { Random, tokenData } from "./random";

const R = new Random();
const cfg = config;

let audioContext;
let frequencyData;
let analyserNode;
let audio;

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

function createAudioContext() {
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

    audio.src = soundFile.url;

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

let waveform, waveform_two;
let initialSize = 0;
const maxLifespan = 20000; // Time (in frames) until a circle disappears.
let soundFile;
let inputButton;

const waveformClasses = [];

function soundFileLoaded() {
  inputButton.hide();

  // Hide the controls and show the canvas when the sound file is loaded
  select("#controls").hide();

  createAudioContext();

  select("canvas").show();
}

function loadSoundFile(file) {
  if (file.type.startsWith("audio")) {
    soundFile = loadSound(file.data, soundFileLoaded);
  } else {
    alert("Not a valid audio file!");
  }
}

// Setup Canvas
window.setup = () => {
  inputButton = createFileInput(loadSoundFile);

  inputButton.parent("controls");
  inputButton.attribute("accept", "audio/*");

  createCanvas(windowWidth, windowHeight);

  // Optional:
  // If the user inserts/removes bluetooth headphones or pushes
  // the play/pause media keys, we can use the following to ignore the action
  navigator.mediaSession.setActionHandler("pause", () => {});

  // Initialize the first circle.
  waveform = { x: width / 2, y: height / 2, size: initialSize, lifespan: maxLifespan };
  waveform_two = { x: width / 2, y: height / 2, size: initialSize, lifespan: 100 };
};

let scaleSize = 500;

window.draw = () => {
  // fill background
  background("black");

  if (analyserNode) {
    if (!waveformClasses.length) {
      const firstWaveForm = new Waveform({
        waveform,
        analyserNode,
        frequencyData,
        scaleSize,
        strokeColor: { r: 128, g: 0, b: 255, o: 75 },
        historyLength: 25,
        minBaseHz: 15000,
        maxBaseHz: 20000,
        angleDeviation: 10,
      });
      const secondWaveForm = new Waveform({
        waveform: waveform_two,
        analyserNode,
        frequencyData,
        scaleSize,
        strokeColor: { r: 128, g: 0, b: 255, o: 100 },
        historyLength: 50,
        minBaseHz: 0,
        maxBaseHz: 15000,
        angleDeviation: 360,
      });
      const thirdWaveForm = new Waveform({
        waveform: waveform_two,
        analyserNode,
        frequencyData,
        scaleSize,
        strokeColor: { r: 128, g: 0, b: 255, o: 50 },
        historyLength: 100,
        minBaseHz: 2500,
        maxBaseHz: 5000,
        angleDeviation: 720,
      });
      const fourthWaveForm = new Waveform({
        waveform: waveform_two,
        analyserNode,
        frequencyData,
        scaleSize,
        strokeColor: { r: 255, g: 255, b: 255, o: 10 },
        historyLength: 11,
        minBaseHz: 0,
        maxBaseHz: 20000,
        angleDeviation: 1400,
      });

      waveformClasses.push(firstWaveForm, secondWaveForm, thirdWaveForm, fourthWaveForm);
    }
  }

  for (const wavey of waveformClasses) {
    wavey.draw();
  }

  if (!audioContext) {
    const dim = min(width, height);
    fill("white");
    noStroke();
    polygon(width / 2, height / 2, dim * 0.1, 3);
  }
};

window.windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
};

calculateFeatures(tokenData);
