import { pickRndColor, reduceDenominator } from "../helpers";
import { defaultPalette } from "../palettes";
import { Random } from "../random";
const R = new Random();

import { bamilekeOptions, bamilekeOverlayOptions } from "./shape-options";

export class Bamileke {
  constructor(
    w,
    h,
    palette = defaultPalette,
    isNoisy,
    isCascade,
    isOverstitch,
    isGlitch,
    isFree
  ) {
    this.width = w;
    this.height = h;
    this.palette = palette;
    this.isNoisy = isNoisy;
    this.isCascade = isCascade;
    this.isOverstitch = isOverstitch;
    this.isGlitch = isGlitch;
    this.isFree = isFree;
  }

  show() {
    noFill();
    noStroke();

    const col = pickRndColor(this.palette);
    const colTwo = pickRndColor(this.palette);

    fill(color(col.r, col.g, col.b));

    strokeWeight(1);

    const shape = R.random_choice(bamilekeOptions);
    const denominator = shape.d;
    const numerator = shape.n;
    const k = numerator / denominator;
    const theta = 0.002;

    push();

    const lineStep = PI * reduceDenominator(numerator, denominator);

    beginShape();
    for (let i = 0; i < lineStep; i += theta) {
      let noise = this.isNoisy ? R.random_dec() * 2 : 0;
      let sPos = (this.width * Math.cos(k * i)) / 2 + noise;
      let xPos = sPos * Math.tan(k * i) + this.width / 2 + noise;
      let yPos = sPos * Math.tan(i) + this.height / 2 + noise;

      let xBounds = this.width;
      let yBounds = this.height;

      if (xPos > xBounds) xPos = xBounds + noise;
      if (xPos < 0) xPos = -noise;

      if (yPos > yBounds) yPos = yBounds + noise;
      if (yPos < 0) yPos = -noise;

      curveVertex(xPos, yPos);
    }
    endShape();

    const shape2 = R.random_choice(bamilekeOverlayOptions);
    const denominator2 = shape2.d;
    const numerator2 = shape2.n;
    const k2 = numerator2 / denominator2;

    const lineStep2 = PI * reduceDenominator(numerator2, denominator2);

    noFill()
    stroke(color(colTwo.r, colTwo.g, colTwo.b));

    beginShape();
    for (let i = 0; i < lineStep2; i += theta) {
      let noise = this.isNoisy ? R.random_dec() * 2 : 0;
      let sPos = (this.width * Math.cos(k2 * i)) / 2 + noise;
      let xPos = sPos * Math.tan(k2 * i) + this.width / 2 + noise;
      let yPos = sPos * Math.tan(i) + this.height / 2 + noise;

      let xBounds = this.width;
      let yBounds = this.height;

      if (xPos > xBounds) xPos = xBounds + noise;
      if (xPos < 0) xPos = -noise;

      if (yPos > yBounds) yPos = yBounds + noise;
      if (yPos < 0) yPos = -noise;

      curveVertex(xPos, yPos);
    }
    endShape();

    pop();
  }
}
