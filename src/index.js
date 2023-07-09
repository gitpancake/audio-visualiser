import { Hash } from "./hash";
import { Waveform } from "./modules/waveform";
import { Random, tokenData } from "./random";

new Hash().initialize();

const r = new Random();

function hashToRGB(hashValue, step) {
  // Extract the red, green, and blue components from the hash
  const red = parseInt(hashValue.substr(2 + step, 2), 16);
  const green = parseInt(hashValue.substr(4 + step, 2), 16);
  const blue = parseInt(hashValue.substr(6 + step, 2), 16);

  return [red, green, blue];
}

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

let waveform, waveform_two, waveform_three;
let initialSize = 0;
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

  navigator.mediaSession.setActionHandler("pause", () => {});

  waveform = { x: width / 2, y: height / 2, size: initialSize };
  waveform_two = { x: width / 2, y: height / 2, size: 10 };
  waveform_three = { x: width / 2, y: height / 2, size: 20 };
};

window.draw = () => {
  // fill background
  background("black");

  if (analyserNode) {
    if (!waveformClasses.length) {
      const firstColors = hashToRGB(tokenData.hash, 0);
      const secondColors = hashToRGB(tokenData.hash, 2);
      const thirdColors = hashToRGB(tokenData.hash, 4);

      const firstWaveForm = new Waveform({
        waveform,
        analyserNode,
        frequencyData,
        scaleSize: r.random_int(100, 400),
        strokeColor: { r: firstColors[0], g: firstColors[1], b: firstColors[2], o: r.random_int(70, 90) },
        historyLength: r.random_int(20, 30),
        minBaseHz: r.random_int(14000, 16000),
        maxBaseHz: r.random_int(19000, 21000),
        angleDeviation: r.random_int(5, 15),
      });
      const secondWaveForm = new Waveform({
        waveform: waveform_two,
        analyserNode,
        frequencyData,
        scaleSize: r.random_int(100, 400),
        strokeColor: { r: secondColors[0], g: secondColors[1], b: secondColors[2], o: r.random_int(90, 100) },
        historyLength: r.random_int(50, 60),
        minBaseHz: r.random_int(0, 100),
        maxBaseHz: r.random_int(13000, 16000),
        angleDeviation: r.random_int(360, 420),
      });
      const thirdWaveForm = new Waveform({
        waveform: waveform_three,
        analyserNode,
        frequencyData,
        scaleSize: r.random_int(100, 400),
        strokeColor: { r: thirdColors[0], g: thirdColors[1], b: thirdColors[2], o: r.random_int(40, 60) },
        historyLength: r.random_int(80, 100),
        minBaseHz: r.random_int(2000, 3000),
        maxBaseHz: r.random_int(4500, 6000),
        angleDeviation: r.random_int(680, 760),
      });

      waveformClasses.push(firstWaveForm, secondWaveForm, thirdWaveForm);
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
