export class Waveform {
  constructor({ size, analyserNode, frequencyData, angleDeviation, frequencyScaleSize, strokeColor, fillColor, historyLength, minBaseHz, maxBaseHz, spins }) {
    this.size = size;
    this.analyserNode = analyserNode;
    this.frequencyData = frequencyData;
    this.frequencyScaleSize = frequencyScaleSize;

    this.minBaseHz = minBaseHz;
    this.maxBaseHz = maxBaseHz;

    this.normalizedFreq = 0;
    this.maxFrequencyTarget = 0;
    this.signalHistory = Array(historyLength).fill(0);

    this.strokeColor = strokeColor;
    this.fillColor = fillColor;
    this.angleDeviation = angleDeviation;

    this.spins = spins;
    this.angle = 0;
  }

  damp(a, b, lambda, dt) {
    return lerp(a, b, 1 - Math.exp(-lambda * dt));
  }

  indexToFrequency(index, sampleRate, frequencyBinCount) {
    return (index * sampleRate) / (frequencyBinCount * 2);
  }

  audioMaxFrequency(analyserNode, frequencies) {
    let maxSignal = -Infinity;
    let maxSignalIndex = 0;

    for (let i = 0; i < frequencies.length; i++) {
      const signal = frequencies[i];
      if (signal > maxSignal) {
        maxSignal = signal;
        maxSignalIndex = i;
      }
    }

    return this.indexToFrequency(maxSignalIndex, analyserNode.context.sampleRate, analyserNode.frequencyBinCount);
  }

  frequencyToIndex(frequencyHz, sampleRate, frequencyBinCount) {
    const nyquist = sampleRate / 2;
    const index = Math.round((frequencyHz / nyquist) * frequencyBinCount);

    return Math.min(frequencyBinCount, Math.max(0, index));
  }

  // Get the normalized audio signal (0..1) between two frequencies
  audioSignal(analyser, frequencies, minHz, maxHz) {
    if (!analyser) return 0;

    const sampleRate = analyser.context.sampleRate;
    const binCount = analyser.frequencyBinCount;

    let start = this.frequencyToIndex(minHz, sampleRate, binCount);
    const end = this.frequencyToIndex(maxHz, sampleRate, binCount);
    const count = end - start;

    let sum = 0;

    for (; start < end; start++) {
      sum += frequencies[start];
    }

    const minDb = this.analyserNode.minDecibels;
    const maxDb = this.analyserNode.maxDecibels;

    const valueDb = count === 0 || !isFinite(sum) ? minDb : sum / count;

    return map(valueDb, minDb, maxDb, 0, 1, true);
  }

  draw() {
    rectMode(CENTER);

    const growthRate = 0.0001; // Controls the speed of growth.
    const count = this.maxBaseHz - this.minBaseHz;
    const minBaseHz = this.minBaseHz;
    const maxBaseHz = this.maxBaseHz;

    if (this.analyserNode) {
      this.analyserNode.getFloatFrequencyData(this.frequencyData);

      this.maxFrequencyTarget = map(this.audioMaxFrequency(this.analyserNode, this.frequencyData), 0, this.frequencyScaleSize, 0, 720, true);
      const maxFreq = this.audioMaxFrequency(this.analyserNode, this.frequencyData);

      this.normalizedFreq = this.damp(this.normalizedFreq, map(maxFreq, 0, this.frequencyScaleSize, 0, 1), 0.1, deltaTime);
    }

    const maxSize = Math.min(width, height) / 32;

    const growth = Math.min(this.size + growthRate * this.normalizedFreq, maxSize);

    if (this.size >= height) {
      this.size -= growth; //
    } else {
      this.size += growth;
    }

    push();

    // Add ambient and directional lighting
    ambientLight(50);

    fill(color(this.strokeColor.r, this.strokeColor.g, this.strokeColor.b, 5));
    stroke(color(this.strokeColor.r, this.strokeColor.g, this.strokeColor.b, this.strokeColor.o));

    beginShape();

    if (this.spins) {
      rotate(100);
    }

    const historyLength = this.signalHistory.length;

    for (let i = 0; i < count; i++) {
      const minHz = map(count - i, 0, count, minBaseHz, maxBaseHz);
      const maxHz = map(count - i + 1, 0, count, minBaseHz, maxBaseHz);

      let signal = this.analyserNode ? this.audioSignal(this.analyserNode, this.frequencyData, minHz, maxHz) : 0;

      this.signalHistory[i % historyLength] = signal;

      const averageSignal = this.signalHistory.reduce((a, b) => a + b, 0) / historyLength;

      const baseSize = map(i, 0, count - 1, this.size, this.size) * this.normalizedFreq * 0.05;

      let size = baseSize + this.size * averageSignal;

      const angle = map(i, 0, this.angleDeviation, 0, TWO_PI);

      const x = 0 + size * sin(angle);
      const y = 0 + size * cos(angle);

      vertex(x, y);
    }

    endShape(CLOSE);
    pop();
  }
}
