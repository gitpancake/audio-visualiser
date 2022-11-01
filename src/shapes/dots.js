import { pickRndColor, reduceDenominator } from "../helpers";
import { defaultPalette } from "../palettes";
import { Random } from "../random";
const R = new Random();

export class Dots {
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

    // Props
    this.density = R.random_int(5, 30); // Less is more
    this.rows = Math.ceil(this.height / this.density);
    this.cols = Math.ceil(this.width / this.density);
    this.pointColours = [];
    this.pointSizes = [];
    this.noiseXArr = [];
    this.noiseYArr = [];
  }

  generate() {
    for (let r = 0; r < this.rows; r++) {
      this.pointColours.push([]);
      this.pointSizes.push([]);
      this.noiseXArr.push([]);
      this.noiseYArr.push([]);

      for (let c = 0; c < this.cols; c++) {
        this.pointColours[r].push(pickRndColor(this.palette));
        this.pointSizes[r].push(R.random_int(1, 4));
        this.noiseXArr[r].push(R.random_dec() * this.density);
        this.noiseYArr[r].push(R.random_dec() * this.density);
      }
    }
  }

  show(drawScale = 1) {
    noFill();
    noStroke();

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const col = this.pointColours[r][c];
        const size = this.pointSizes[r][c];
        stroke(color(col.r, col.g, col.b));
        strokeWeight(size * drawScale);

        const noiseX = this.noiseXArr[r][c];
        const noiseY = this.noiseYArr[r][c];

        let x = c * this.density + noiseX;
        let y = r * this.density + noiseY;

        point(x * drawScale, y * drawScale);
      }
    }
  }
}
