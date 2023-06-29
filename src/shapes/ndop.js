import { pickRndColor, reduceDenominator } from "../helpers";
import { defaultPalette } from "../palettes";
import { Random } from "../random";
import { ndopOptions, ndopOverlayOptions } from "./shape-options";
import { Strokes } from "./strokes";
const R = new Random();

export class Ndop {
  constructor(w, h, palette = defaultPalette, isNoisy, isCascade, isOverstitch, isGlitch) {
    this.width = w;
    this.height = h;
    this.palette = palette;
    this.isNoisy = isNoisy;
    this.isCascade = isCascade;
    this.isOverstitch = isOverstitch;
    this.isGlitch = isGlitch;

    // Props
    const QUARTER_PI = 0.7853982;
    const HALF_PI = QUARTER_PI * 2;
    const PI = HALF_PI * 2;

    this.col = pickRndColor(this.palette);
    this.colTwo = pickRndColor(this.palette);
    this.shape = R.random_choice(ndopOptions);
    this.denominator = this.shape.d;
    this.numerator = this.shape.n;
    this.k = this.numerator / this.denominator;
    this.theta = 0.002;
    this.lineStep = Math.round(PI * reduceDenominator(this.numerator, this.denominator));
    this.noiseArr = [];
    this.noiseTwoArr = [];

    this.shapeTwo = R.random_choice(ndopOverlayOptions);
    this.denominatorTwo = this.shapeTwo.d;
    this.numeratorTwo = this.shapeTwo.n;
    this.kTwo = this.numeratorTwo / this.denominatorTwo;
    this.lineStepTwo = Math.round(PI * reduceDenominator(this.numeratorTwo, this.denominatorTwo));

    this.dotMotif = new Strokes(this.width, this.height, this.palette, this.isNoisy, this.isCascade, this.isOverstitch, this.isGlitch);
  }

  generate() {
    this.dotMotif.generate();
    for (let i = 0; i < this.lineStep; i += this.theta) {
      const noise = this.isNoisy ? R.random_dec() : 0;
      this.noiseArr.push(noise);
    }
    for (let i = 0; i < this.lineStepTwo; i += this.theta) {
      const noise = this.isNoisy ? R.random_dec() * 2 : 0;
      this.noiseTwoArr.push(noise);
    }
  }

  show(drawScale = 1) {
    this.dotMotif.show(drawScale);

    noFill();
    noStroke();
    fill(color(this.col.r, this.col.g, this.col.b));

    push();
    beginShape();
    for (let i = 0; i < this.lineStep; i += this.theta) {
      let noise = this.noiseArr[Math.round(i)];
      let sPos = (this.width * Math.cos(this.k * i)) / 2 + noise;
      let xPos = sPos * Math.tan(this.k * i) + this.width / 2 + noise;
      let yPos = sPos * Math.tan(i) + this.height / 2 + noise;

      let xBounds = this.width;
      let yBounds = this.height;

      if (xPos > xBounds) xPos = xBounds + noise;
      if (xPos < 0) xPos = -noise;

      if (yPos > yBounds) yPos = yBounds + noise;
      if (yPos < 0) yPos = -noise;

      curveVertex(xPos * drawScale, yPos * drawScale);
    }
    endShape();

    noFill();
    strokeWeight(1);
    stroke(color(this.colTwo.r, this.colTwo.g, this.colTwo.b));

    beginShape();
    for (let i = 0; i < this.lineStepTwo; i += this.theta) {
      let noise = this.noiseTwoArr[Math.round(i)];
      let sPos = (this.width * Math.cos(this.kTwo * i)) / 2 + noise;
      let xPos = sPos * Math.tan(this.kTwo * i) + this.width / 2 + noise;
      let yPos = sPos * Math.tan(i) + this.height / 2 + noise;

      let xBounds = this.width;
      let yBounds = this.height;

      if (xPos > xBounds) xPos = xBounds + noise;
      if (xPos < 0) xPos = -noise;

      if (yPos > yBounds) yPos = yBounds + noise;
      if (yPos < 0) yPos = -noise;

      curveVertex(xPos * drawScale, yPos * drawScale);
    }
    endShape();

    pop();
  }
}
