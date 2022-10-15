import { pickRndColor } from "../helpers";
import { defaultPalette } from "../palettes";
import { Random } from "../random";
const R = new Random();

export class Scribbles {
  constructor(w, h, isNoisy, palette = defaultPalette) {
    this.width = w;
    this.height = h;
    this.isNoisy = isNoisy;
    this.palette = palette;
  }

  show() {
    noFill();

    const col = pickRndColor(this.palette);
    stroke(color(col.r, col.g, col.b));
    strokeWeight(2);

    const isLineVertical = R.random_bool(0.5);
    const lineSize = isLineVertical ? this.height : this.width;

    // If vertical use width else use height
    // const lineDiv = this.isNoisy ? R.random_int(1, 5) : 1;
    const lineDiv = R.random_int(1, 2);

    const lineContainerSize = isLineVertical ? this.width : this.height;
    const curveSize = R.random_int(1, 4);
    const lines = lineContainerSize / curveSize - 1;

    let lineTranslate = curveSize;
    push()

    for (let l = 0; l < lines; l++) {

      const theta = 1;
      const offset = R.random_int(1, 5);
      const curveType = R.random_choice([QUARTER_PI, HALF_PI]);

      if (isLineVertical) {
        translate(lineTranslate, 0);
      } else {
        translate(0, lineTranslate);
      }

      beginShape();

      for (let i = offset; i < lineSize - offset; i += theta) {

        let x, y;
        let noise = this.isNoisy ? R.random_dec() : 0;

        if (isLineVertical) {
          x = cos(i * radians(curveType)) * curveSize + noise;
          y = i * 1;
        } else {
          x = i * 1;
          y = cos(i * radians(curveType)) * curveSize + noise;
        }

        vertex(x, y);
      }

      endShape();

      lineTranslate =+ curveSize;
    }
    pop()
  }
}
