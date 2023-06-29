import { defaultPalette } from "../palettes";
import { Random } from "../random";
const R = new Random();

export class Strokes {
  constructor(w, h, palette = defaultPalette) {
    this.width = w;
    this.height = h;
    this.palette = palette;

    // Props
    this.density = R.random_int(3, 4); // Less is more
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
        this.pointSizes[r].push(R.random_int(1, 4));
        this.noiseXArr[r].push(R.random_dec() * this.density);
        this.noiseYArr[r].push(R.random_dec() * this.density);
      }
    }
  }

  show(drawScale = 1) {
    const randomColor = R.random_choice(this.palette.colors);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const size = this.pointSizes[r][c];

        stroke(color(randomColor.r, randomColor.g, randomColor.b));

        strokeWeight(size * drawScale);

        const noiseX = this.noiseXArr[r][c];
        const noiseY = this.noiseYArr[r][c];

        let x = c * this.density + noiseX;
        let y = r * this.density + noiseY;

        line(5, y * drawScale, x * drawScale, y * drawScale, 10);

        strokeWeight(0.2);
        stroke("black");
        line(5, y * drawScale + 0.2, x * drawScale + 0.2, y * drawScale + 0.2);

        strokeWeight(0.1);
        stroke("white");
        line(5, y * drawScale + 0.4, x * drawScale + 0.4, y * drawScale + 0.4);
      }
    }
  }
}
