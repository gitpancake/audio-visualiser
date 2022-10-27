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
    isGlitch
  ) {
    this.width = w;
    this.height = h;
    this.palette = palette;
    this.isNoisy = isNoisy;
    this.isCascade = isCascade;
    this.isOverstitch = isOverstitch;
    this.isGlitch = isGlitch;
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

    noFill();
    noStroke();
    push();
    translate(-this.innerContainerWidth / 2, -this.innerContainerHeight / 2);

    // FLOWER BACKGROUND
    const flowerBg = R.random_choice(flowerOptions);
    const bgM = flowerBg.m;
    const bgN = flowerBg.n;
    const bgK = bgM / bgN;
    const bgTheta = 0.002;
    const bgScale = R.random_num(1.8, 2);
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
      const x = size * Math.sin(i) + this.innerContainerWidth + noiseX;
      const y = size * Math.cos(i) + this.innerContainerHeight + noiseY;
      curveVertex(x, y);
    }
    endShape();
    // FLOWER BACKGROUND - END

    // FLOWER OUTER
    const flowerOuter = flowerBg;
    const outerM = flowerOuter.m;
    const outerN = flowerOuter.n;
    const outerK = outerM / outerN;
    const outerTheta = 0.002;
    const outerScale = bgScale + 0.25;
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
      let x = size * Math.sin(i) + this.innerContainerWidth + noiseX;
      let y = size * Math.cos(i) + this.innerContainerHeight + noiseY;
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
    const innerScale = R.random_num(2.1, 3);
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
      let x = size * Math.sin(i) + this.innerContainerWidth + noiseX;
      let y = size * Math.cos(i) + this.innerContainerHeight + noiseY;
      curveVertex(x, y);
    }
    endShape();
    // FLOWER INNER - END

    // FLOWER INNER DETAILS
    col = this.palette.background
    stroke(color(col.r, col.g, col.b));
    for (let j = innerO; j < innerDetailCount - innerC; j++) {
      let angle = j;
      let size = (this.radius / innerDetailCount / innerScale / 4) * j;
      strokeWeight(size/1.7);

      // DOT STYLE
      for (let i = 0; i < innerDetailCount; i++) {
        const noiseX = this.isNoisy ? R.random_dec() : 0;
        const noiseY = this.isNoisy ? R.random_dec() : 0;

        let x = size * sin(angle) + this.innerContainerWidth + noiseX;
        let y = size * cos(angle) + this.innerContainerHeight + noiseY;
        point(x, y);
        angle += TWO_PI / innerDetailCount;
      }
    }
    // FLOWER INNER DETAILS - END

    pop();
  }
}
