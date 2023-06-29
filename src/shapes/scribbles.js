import { pickRndColor } from "../helpers";
import { defaultPalette } from "../palettes";
import { Random } from "../random";
const R = new Random();

export class Scribbles {
  constructor(w, h, palette = defaultPalette, isNoisy, isCascade, isOverstitch, isGlitch) {
    this.width = w;
    this.height = h;
    this.palette = palette;
    this.isNoisy = isNoisy;
    this.isCascade = isCascade;
    this.isOverstitch = isOverstitch;
    this.isGlitch = isGlitch;

    // Props
    this.isVertical = R.random_bool(0.5);
    this.lineSize = this.isVertical ? this.height : this.width;
    this.containerSize = this.isVertical ? this.width : this.height;
    this.curveSize = R.random_int(2, 8);
    this.lineCount = Math.ceil(this.containerSize / this.curveSize) - 1;
    this.primaryCol = pickRndColor(this.palette);
    this.secondaryColArr = [];

    this.toggleRotInit = R.random_bool(0.5);
    this.toggleRotArr = [];

    this.dividerArr = [];

    this.lineThickArr = [];
    this.offsetArr = [];
    this.curveTypeArr = [];
    this.noiseArr = [];
  }

  generate() {
    const QUARTER_PI = 0.7853982;
    const HALF_PI = QUARTER_PI * 2;
    const PI = HALF_PI * 2;

    for (let l = 0; l < this.lineCount; l++) {
      this.lineThickArr.push(R.random_int(1, 3));

      if (this.isGlitch) {
        this.toggleRotArr.push(R.random_bool(0.5));
        this.dividerArr.push(R.random_int(1, 100));
        this.secondaryColArr.push(pickRndColor(this.palette));
      }

      const offset = R.random_int(1, 10);
      this.offsetArr.push(offset);
      this.curveTypeArr.push(R.random_choice([QUARTER_PI, HALF_PI, PI]));

      this.noiseArr.push([]);

      for (let i = offset; i < this.lineSize - offset; i += 1) {
        const noise = this.isNoisy ? R.random_dec() : 0;
        this.noiseArr[l].push(noise);
      }
    }
  }

  show(drawScale = 1) {
    noFill();

    const col = this.primaryCol;
    stroke(color(col.r, col.g, col.b));

    let lineTranslate = this.curveSize;

    push();

    for (let l = 0; l < this.lineCount; l++) {
      strokeWeight(this.lineThickArr[l] * drawScale);

      if (this.isVertical) {
        translate(lineTranslate * drawScale, 0);
      } else {
        translate(0, lineTranslate * drawScale);
      }

      if (this.isGlitch) {
        const rotation = radians(l / this.dividerArr[l]);
        const newRotation = this.toggleRotArr[l] ? -rotation : rotation;
        rotate(newRotation);

        const col = this.secondaryColArr[l];
        stroke(color(col.r, col.g, col.b));
      }

      const offset = this.offsetArr[l];
      const curveType = this.curveTypeArr[l];

      beginShape();

      for (let i = offset; i < this.lineSize - offset; i += 1) {
        let x, y;
        let noise = this.noiseArr[l][i];

        if (this.isVertical) {
          if (this.isOverstitch && !this.isCascade) {
            x = tan(i * radians(curveType)) * this.curveSize + noise;
          } else {
            x = cos(i * radians(curveType)) * this.curveSize + noise;
          }
          y = i * 1;
        } else {
          if (this.isOverstitch && this.isCascade) {
            y = tan(i * radians(curveType)) * this.curveSize + noise;
          } else {
            y = cos(i * radians(curveType)) * this.curveSize + noise;
          }
          x = i * 1;
        }

        vertex(x * drawScale, y * drawScale);
      }

      endShape();
      lineTranslate = +this.curveSize;
    }
    pop();
  }
}
