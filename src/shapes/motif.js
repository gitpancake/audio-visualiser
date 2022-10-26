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

    const density = R.random_int(5, 30); // Less is more
    const rows = this.height / density;
    const cols = this.width / density;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const col = pickRndColor(this.palette);
        const size = R.random_int(1, 4);
        stroke(color(col.r, col.g, col.b));
        strokeWeight(size);

        const noiseX = R.random_dec() * density;
        const noiseY = R.random_dec() * density;

        let x = c * density + noiseX;
        let y = r * density + noiseY;

        point(x, y);
      }
    }

  }
}
