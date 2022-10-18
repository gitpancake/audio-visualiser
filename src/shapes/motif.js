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
    strokeWeight(3);

    const density = R.random_int(5,30); // Less is more
    const rows = this.height / density;
    const cols = this.width / density;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        for (let i = 0; i < 1; i++) {
          const col = pickRndColor(this.palette);
          stroke(color(col.r, col.g, col.b));

          const noiseX = R.random_dec() * density;
          const noiseY = R.random_dec() * density;

          let x = Math.sin(i) + c * density + noiseX;
          let y = Math.cos(i) + r * density + noiseY;

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
