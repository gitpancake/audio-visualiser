import { pickRndColor, reduceDenominator } from "../helpers";
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
    noFill();

    translate(-this.innerContainerWidth / 2, -this.innerContainerHeight / 2);

    const flowerOuter = R.random_choice(flowerOptions);
    const outerM = flowerOuter.m;
    const outerN = flowerOuter.n;
    const outerO = flowerOuter.o; // draw offset
    const outerC = flowerOuter.c; // draw crop
    const outerK = outerM / outerN;
    const outerTheta = 0.02;
    const outerDetailCount = outerM * 2;
    const outerScale = 1; //R.random_num(2, 3.5);
    const outerLineStep = TWO_PI * reduceDenominator(outerM, outerN);

    // BACKGROUND
    fill(
      color(
        this.palette.background.r,
        this.palette.background.g,
        this.palette.background.b
      )
    );
    stroke(
      color(
        this.palette.background.r,
        this.palette.background.g,
        this.palette.background.b
      )
    );
    strokeWeight(20)
    beginShape();
    for (let i = 0; i < outerLineStep; i += outerTheta) {
      const noiseX = R.random_dec()*2//this.isNoisy ? R.random_dec() : 0;
      const noiseY = R.random_dec()*2//this.isNoisy ? R.random_dec() : 0;

      let size = (this.radius / outerScale) * Math.sin(i * outerK);
      let x = size * Math.cos(i) + this.innerContainerWidth + noiseX;
      let y = size * Math.sin(i) + this.innerContainerHeight + noiseY;
      curveVertex(x, y);
    }
    endShape();

    const col = pickRndColor(this.palette);
    stroke(color(col.r, col.g, col.b));
    strokeWeight(1);

    // OVERLAY
    noFill()
    beginShape();
    for (let i = 0; i < outerLineStep; i += outerTheta) {
      const noiseX = this.isNoisy ? R.random_dec() : 0;
      const noiseY = this.isNoisy ? R.random_dec() : 0;

      let size = (this.radius / outerScale) * Math.sin(i * outerK);
      let x = size * Math.cos(i) + this.innerContainerWidth + noiseX;
      let y = size * Math.sin(i) + this.innerContainerHeight + noiseY;
      vertex(x, y);
    }
    endShape();

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

    beginShape();
    for (let i = 0; i < innerLineStep; i += innerTheta) {
      const noiseX = this.isNoisy ? R.random_dec() : 0;
      const noiseY = this.isNoisy ? R.random_dec() : 0;

      let size = (this.radius / innerScale) * Math.sin(i * innerK);
      let x = size * Math.cos(i) + this.innerContainerWidth + noiseX;
      let y = size * Math.sin(i) + this.innerContainerHeight + noiseY;
      vertex(x, y);
    }
    endShape();
  }
}
