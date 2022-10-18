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
    strokeWeight(3);

    const rows = this.height / 10;
    const cols = this.width / 10;
    const radius = 5;
    const angle = TWO_PI / 10;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        for (let i = 0; i < 1; i++) {
          const noiseX = this.isNoisy
            ? R.random_dec() * 20
            : R.random_dec() * 10;
          const noiseY = this.isNoisy
            ? R.random_dec() * 20
            : R.random_dec() * 10;

          const x = radius + Math.sin(i) + c * 10 + noiseX;
          const y = radius + Math.cos(i) + r * 10 + noiseY;

          point(x, y);
        }
      }
    }

    push();

    pop();
  }

  draw() {
    const xoff = 10;
    const yoff = 10;
    const col = pickRndColor(this.palette);
    stroke(color(col.r, col.g, col.b));
    for (let j = 0; j < 1; j++) {
      for (let i = 0; i < 6; i++) {

        for (let x = 1; x < this.width - yoff * 2; x++) {
          for (let y = 0; y < this.height - yoff * 2; y++) {
            var n = noise(x * 0.02, y * 0.02);
            if (R.random_num(0, 1) > 0.9 - 0.01 * i - n / 5) {
              strokeWeight(
                R.random_num(
                  0.2 + y / 500 - n / 10,
                  0.3 + y / 100 - n / 10 - j / 5
                )
              );

              point(
                xoff +
                  x +
                  (j * (this.width - yoff * 2)) / 5 +
                  R.random_num(-2, 2),
                yoff + y + R.random_num(-3, 3)
              );
            }
          }
        }
      }
    }
  }
}
