import { normalise, pickRndColor, reduceDenominator } from "../helpers";
import { defaultPalette } from "../palettes";
import { Random } from "../random";
import { flowerOptions } from "./shape-options";
const R = new Random();

export class Flower {
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
    this.strokeSize = 1;

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
  }

  show() {
    const strokeSize = Math.round(10 * normalise(this.radius, width - 80, 0));
    console.log(this.radius, this.width, strokeSize);

    noFill();
    noStroke();
    push();
    translate(-this.innerContainerWidth / 2, -this.innerContainerHeight / 2);

    // FLOWER BACKGROUND
    const flowerBg = R.random_choice(flowerOptions);
    const bgM = flowerBg.m;
    const bgN = flowerBg.n;
    // const bgO = flowerBg.o; // draw offset
    // const bgC = flowerBg.c; // draw crop
    const bgK = bgM / bgN;
    const bgTheta = 0.002;
    // const bgDetailCount = bgM * 2;
    const bgScale = 1.9; //R.random_num(2, 3.5);
    const bgLineStep = TWO_PI * reduceDenominator(bgM, bgN);

    fill(
      color(
        this.palette.background.r,
        this.palette.background.g,
        this.palette.background.b
      )
    );
    strokeWeight(strokeSize);

    beginShape();
    for (let i = 0; i < bgLineStep; i += bgTheta) {
      const noiseX = R.random_dec() * 2; //this.isNoisy ? R.random_dec() : 0;
      const noiseY = R.random_dec() * 2; //this.isNoisy ? R.random_dec() : 0;
      const size = (this.radius / bgScale) * Math.sin(i * bgK);
      const x = size * Math.cos(i) + this.innerContainerWidth + noiseX;
      const y = size * Math.sin(i) + this.innerContainerHeight + noiseY;
      curveVertex(x, y);
    }
    endShape();
    // FLOWER BACKGROUND - END

    // FLOWER OUTER
    const flowerOuter = flowerBg;
    const outerM = flowerOuter.m;
    const outerN = flowerOuter.n;
    const outerO = flowerOuter.o; // draw offset
    const outerC = flowerOuter.c; // draw crop
    const outerK = outerM / outerN;
    const outerTheta = 0.002;
    const outerDetailCount = outerM * 2;
    const outerScale = 2.1; //R.random_num(2, 3.5);
    const outerLineStep = TWO_PI * reduceDenominator(outerM, outerN);

    let col = pickRndColor(this.palette);
    stroke(
      color(
        this.palette.background.r,
        this.palette.background.g,
        this.palette.background.b
      )
    );
    strokeWeight(strokeSize);

    col = pickRndColor(this.palette);
    fill(color(col.r, col.g, col.b));

    beginShape();
    for (let i = 0; i < outerLineStep; i += outerTheta) {
      const noiseX = this.isNoisy ? R.random_dec() : 0;
      const noiseY = this.isNoisy ? R.random_dec() : 0;

      let size = (this.radius / outerScale) * Math.sin(i * outerK);
      let x = size * Math.cos(i) + this.innerContainerWidth + noiseX;
      let y = size * Math.sin(i) + this.innerContainerHeight + noiseY;
      curveVertex(x, y);
    }
    endShape();
    // FLOWER OUTER - END

    // FLOWER INNER
    const flowerInner = R.random_choice(flowerOptions);
    const innerM = flowerInner.m;
    const innerN = flowerInner.n;
    const innerO = flowerInner.o; // draw offset
    const innerC = flowerInner.c; // draw crop
    const innerK = innerM / innerN;
    const innerTheta = outerTheta;
    const innerDetailCount = innerM * 2;
    const innerScale = 3; //R.random_num(2, 2.5);
    const innerLineStep = TWO_PI * reduceDenominator(innerM, innerN);

    stroke(
      color(
        this.palette.background.r,
        this.palette.background.g,
        this.palette.background.b
      )
    );
    strokeWeight(strokeSize);

    col = pickRndColor(this.palette);
    fill(color(col.r, col.g, col.b));

    beginShape();
    for (let i = 0; i < innerLineStep; i += innerTheta) {
      const noiseX = this.isNoisy ? R.random_dec() : 0;
      const noiseY = this.isNoisy ? R.random_dec() : 0;

      let size = (this.radius / innerScale) * Math.sin(i * innerK);
      let x = size * Math.cos(i) + this.innerContainerWidth + noiseX;
      let y = size * Math.sin(i) + this.innerContainerHeight + noiseY;
      curveVertex(x, y);
    }
    endShape();
    // FLOWER INNER - END

    // FLOWER INNER DETAILS

    // FLOWER INNER DETAILS - END
    pop();
  }
}
