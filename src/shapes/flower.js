import { normalise, pickRndColor, reduceDenominator } from "../helpers";
import { defaultPalette } from "../palettes";
import { Random } from "../random";
import { flowerOptions } from "./shape-options";
import { Dots } from "./dots";
const R = new Random();

export class Flower {
  constructor(
    w,
    h,
    palette = defaultPalette,
    isNoisy,
    isCascade,
    isOverstitch,
    isGlitch
  ) {
    this.width = w;
    this.height = h;
    this.palette = palette;
    this.isNoisy = isNoisy;
    this.isCascade = isCascade;
    this.isOverstitch = isOverstitch;
    this.isGlitch = isGlitch;

    this.radius = this.width;
    this.isQuadrilateral = false;
    this.innerContainerWidth = this.width;
    this.innerContainerHeight = this.height;

    // If width is greater than height + percentage
    const p = 0.5; // percentage - 0.1 = 10% etc..

    if (w > h + h * p) {
      // width is longer than height
      this.radius = this.height;
      this.innerContainerWidth = this.width;
      const p1 = 0.01; // percentage - 0.1 = 10% etc..
      const h1 = this.innerContainerHeight;
      const w1 = this.innerContainerWidth;

      if (h1 > w1 + w1 * p1) {
        this.radius = this.innerContainerWidth;
      } else {
        this.radius = this.innerContainerHeight;
      }
    } else if (h > w + w * p) {
      // height is longer than width
      this.innerContainerHeight = this.height;
      const p2 = 0.01; // percentage - 0.1 = 10% etc..
      const h2 = this.innerContainerHeight;
      const w2 = this.innerContainerWidth;

      if (h2 > w2 + w2 * p2) {
        this.radius = this.innerContainerWidth;
      } else {
        this.radius = this.innerContainerHeight;
      }
    } else {
      // container is quad
      this.isQuadrilateral = true;
      const p3 = 0.01; // percentage - 0.1 = 10% etc..
      const h3 = this.innerContainerHeight;
      const w3 = this.innerContainerWidth;

      if (h3 > w3 + w3 * p3) {
        this.radius = this.innerContainerWidth;
      } else {
        this.radius = this.innerContainerHeight;
      }
    }

    // props

    const QUARTER_PI = 0.7853982;
    const HALF_PI = QUARTER_PI * 2;
    const PI = HALF_PI * 2;
    const TAU = PI * 2;

    this.strokeSize = Math.round(
      10 * normalise(this.radius, window.innerWidth - 80, 0)
    );
    this.flowerBg = R.random_choice(flowerOptions);
    this.bgScale = R.random_num(1.8, 2);
    this.bgM = this.flowerBg.m;
    this.bgN = this.flowerBg.n;
    this.bgK = this.bgM / this.bgN;
    this.bgTheta = 0.002;
    this.bgLineStep = TAU * reduceDenominator(this.bgM, this.bgN);

    this.flowerBGNoiseX = [];
    this.flowerBGNoiseY = [];

    this.flowerOuter = this.flowerBg;
    this.outerM = this.flowerOuter.m;
    this.outerN = this.flowerOuter.n;
    this.outerK = this.outerM / this.outerN;
    this.outerTheta = 0.002;
    this.outerScale = this.bgScale + 0.25;
    this.outerLineStep = TAU * reduceDenominator(this.outerM, this.outerN);

    this.flowerOuterStroke = pickRndColor(this.palette);
    this.flowerOuterFill = pickRndColor(this.palette);
    this.flowerInnerFill = pickRndColor(this.palette);
    this.flowerOuterNoiseX = [];
    this.flowerOuterNoiseY = [];

    this.flowerInner = R.random_choice(flowerOptions);
    this.innerM = this.flowerInner.m;
    this.innerN = this.flowerInner.n;
    this.innerO = this.flowerInner.o; // draw offset
    this.innerC = this.flowerInner.c; // draw crop
    this.innerK = this.innerM / this.innerN;
    this.innerTheta = this.outerTheta;
    this.innerDetailCount = this.innerM * 2;
    this.innerScale = R.random_num(2.1, 3);
    this.innerLineStep = TAU * reduceDenominator(this.innerM, this.innerN);
    this.flowerInnerNoiseX = [];
    this.flowerInnerNoiseY = [];

    this.flowerDetailsNoiseX = [];
    this.flowerDetailsNoiseY = [];
    this.translateNoise = this.isGlitch ? R.random_int(-2, 2) : 2;

    this.flowerOutline = R.random_bool(0.5);

    this.dotMotif = new Dots(
      this.width,
      this.height,
      this.palette,
      this.isNoisy,
      this.isCascade,
      this.isOverstitch,
      this.isGlitch
    );
  }

  generate() {
    this.dotMotif.generate();

    for (let i = 0; i < this.bgLineStep; i += this.bgTheta) {
      this.flowerBGNoiseX.push(R.random_dec() * 2);
      this.flowerBGNoiseY.push(R.random_dec() * 2);
    }
    for (let i = 0; i < this.outerLineStep; i += this.outerTheta) {
      const noiseX = this.isNoisy ? R.random_dec() : 0;
      const noiseY = this.isNoisy ? R.random_dec() : 0;
      this.flowerOuterNoiseX.push(noiseX);
      this.flowerOuterNoiseY.push(noiseY);
    }
    for (let i = 0; i < this.innerLineStep; i += this.innerTheta) {
      const noiseX = this.isNoisy ? R.random_dec() : 0;
      const noiseY = this.isNoisy ? R.random_dec() : 0;
      this.flowerInnerNoiseX.push(noiseX);
      this.flowerInnerNoiseY.push(noiseY);
    }
    for (let j = this.innerO; j < this.innerDetailCount - this.innerC; j++) {
      this.flowerDetailsNoiseX.push([]);
      this.flowerDetailsNoiseY.push([]);
      for (let i = 0; i < this.innerDetailCount; i++) {
        const noiseX = this.isNoisy ? R.random_dec() : 0;
        const noiseY = this.isNoisy ? R.random_dec() : 0;
        let index = j - this.innerO;
        this.flowerDetailsNoiseX[index].push(noiseX);
        this.flowerDetailsNoiseY[index].push(noiseY);
      }
    }
  }

  show(drawScale = 1) {
    if (this.flowerOutline) {
      noFill();
      noStroke();
      this.dotMotif.show(drawScale);
    } else {
      this.dotMotif.show(drawScale);
      noFill();
      noStroke();
    }

    push();
    translate(
      (-this.innerContainerWidth / this.translateNoise) * drawScale,
      (-this.innerContainerHeight / this.translateNoise) * drawScale
    );
    // FLOWER BACKGROUND
    fill(
      color(
        this.palette.background.r,
        this.palette.background.g,
        this.palette.background.b
      )
    );
    strokeWeight(this.strokeSize * drawScale);

    beginShape();
    for (let i = 0; i < this.bgLineStep; i += this.bgTheta) {
      const noiseX = this.flowerBGNoiseY[Math.ceil(i)];
      const noiseY = this.flowerBGNoiseY[Math.ceil(i)];
      const size = (this.radius / this.bgScale) * Math.sin(i * this.bgK);
      const x = size * Math.sin(i) + this.innerContainerWidth + noiseX;
      const y = size * Math.cos(i) + this.innerContainerHeight + noiseY;
      curveVertex(x * drawScale, y * drawScale);
    }
    endShape();
    // FLOWER BACKGROUND - END

    // FLOWER OUTER
    let col = this.flowerOuterStroke;
    stroke(
      color(
        this.palette.background.r,
        this.palette.background.g,
        this.palette.background.b
      )
    );

    col = this.flowerOuterFill;
    fill(color(col.r, col.g, col.b));

    beginShape();
    for (let i = 0; i < this.outerLineStep; i += this.outerTheta) {
      const noiseX = this.flowerOuterNoiseX[Math.ceil(i)];
      const noiseY = this.flowerOuterNoiseY[Math.ceil(i)];
      let size = (this.radius / this.outerScale) * Math.sin(i * this.outerK);
      let x = size * Math.sin(i) + this.innerContainerWidth + noiseX;
      let y = size * Math.cos(i) + this.innerContainerHeight + noiseY;
      curveVertex(x * drawScale, y * drawScale);
    }
    endShape();
    // FLOWER OUTER - END

    // FLOWER INNER
    stroke(
      color(
        this.palette.background.r,
        this.palette.background.g,
        this.palette.background.b
      )
    );
    col = this.flowerInnerFill;
    fill(color(col.r, col.g, col.b));
    beginShape();
    for (let i = 0; i < this.innerLineStep; i += this.innerTheta) {
      const noiseX = this.flowerInnerNoiseX[Math.ceil(i)];
      const noiseY = this.flowerInnerNoiseY[Math.ceil(i)];
      let size = (this.radius / this.innerScale) * Math.sin(i * this.innerK);
      let x = size * Math.sin(i) + this.innerContainerWidth + noiseX;
      let y = size * Math.cos(i) + this.innerContainerHeight + noiseY;
      curveVertex(x * drawScale, y * drawScale);
    }
    endShape();
    // FLOWER INNER - END

    // FLOWER INNER DETAILS
    col = this.palette.background;
    stroke(color(col.r, col.g, col.b));
    for (let j = this.innerO; j < this.innerDetailCount - this.innerC; j++) {
      let angle = j;
      let size =
        (this.radius / this.innerDetailCount / this.innerScale / 4) * j;
      strokeWeight((size / 1.7) * drawScale);

      // DOT STYLE
      for (let i = 0; i < this.innerDetailCount; i++) {
        let index = j - this.innerO;
        const noiseX = this.flowerDetailsNoiseX[index][i];
        const noiseY = this.flowerDetailsNoiseY[index][i];

        let x = size * sin(angle) + this.innerContainerWidth + noiseX;
        let y = size * cos(angle) + this.innerContainerHeight + noiseY;
        point(x * drawScale, y * drawScale);
        angle += TAU / this.innerDetailCount;
      }
    }
    // FLOWER INNER DETAILS - END

    pop();
  }
}
