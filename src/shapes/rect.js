import { defaultPalette } from "../palettes";
import { Random } from "../random";
const R = new Random();

export class Rect {
  constructor(w, h, palette = defaultPalette) {
    this.width = w;
    this.height = h;
    this.palette = palette;

    // Props
    this.density = R.random_int(5, 6); // Less is more
    this.rows = Math.ceil(this.height / this.density);
    this.cols = Math.ceil(this.width / this.density);
    this.pointColours = [];
    this.pointSizes = [];
    this.noiseXArr = [];
    this.noiseYArr = [];
  }

  generate() {}

  show(drawScale = 1) {
    const randomColor = R.random_choice(this.palette.colors);

    fill(randomColor.r, randomColor.g, randomColor.b);

    rect(0, 0, this.width * drawScale, this.height * drawScale, 10);

    // for (let r = 0; r < this.rows; r++) {
    //   for (let c = 0; c < this.cols; c++) {
    //     const pointColour = this.pointColours[r][c];
    //     const size = this.pointSizes[r][c];

    //     stroke(color(pointColour.r, pointColour.g, pointColour.b));

    //     strokeWeight(size * drawScale);

    //     const noiseX = this.noiseXArr[r][c];
    //     const noiseY = this.noiseYArr[r][c];

    //     let x = c * this.density + noiseX;
    //     let y = r * this.density + noiseY;

    //     point(x * drawScale, y * drawScale);
    //   }
    // }
  }
}
