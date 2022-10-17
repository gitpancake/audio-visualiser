import { pickRndColor, reduceDenominator } from "../helpers";
import { defaultPalette } from "../palettes";
import { Random } from "../random";
import { motifOptions } from "./shape-options";
const R = new Random();

export class Motif {
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
    stroke(color(col.r, col.g, col.b));
    strokeWeight(2);

    const shape = R.random_choice(motifOptions);
    console.log(shape)

    const denominator = shape.d;
    const numerator = shape.n;
    const k = numerator / denominator;
    const theta = 0.002;

    push();

    const lineStep = TWO_PI * reduceDenominator(numerator, denominator);

    beginShape();
    for (let i = 0; i < lineStep; i += theta) {

      let noise = this.isNoisy ? R.random_dec() : 0;

      let sPos = (this.width * Math.cos(k * i)) / 2;
      let xPos = sPos * Math.tan(i*k) * Math.cos(i) + this.width / 2 + noise;
      let yPos = sPos * Math.sin(i) * Math.cos(i)  + this.height / 2 + noise;

      let xBounds = this.width;
      let yBounds = this.height;

      // if (xPos > xBounds) xPos = xBounds + noise;
      // if (xPos < 0) xPos = -noise;

      // if (yPos > yBounds) yPos = yBounds + noise;
      // if (yPos < 0) yPos = -noise;

      curveVertex(xPos, yPos);
    }
    endShape();

    pop();
  }
}
