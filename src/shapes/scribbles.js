import { pickRndColor } from "../helpers";
import { defaultPalette } from "../palettes";
import { Random } from "../random";
const R = new Random();

export class Scribbles {
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

    const col = pickRndColor(this.palette);
    stroke(color(col.r, col.g, col.b));
    strokeWeight(2);

    const isLineVertical = R.random_bool(0.5);
    const lineSize = isLineVertical ? this.height : this.width;
    const lineDiv = this.isGlitch && !this.isFree ? R.random_num(1.1, 2) : 1;
    const containerSize = isLineVertical ? this.width : this.height;
    const curveSize = R.random_num(1, 5);
    const lineCount = containerSize / curveSize / lineDiv;
    const toggleRot = R.random_bool(0.5);
    let lineTranslate = curveSize;

    // console.table({
    //   isLineVertical,
    //   lineSize,
    //   lineDiv,
    //   containerSize,
    //   curveSize,
    //   lineCount,
    //   lineTranslate,
    //   toggleRot
    // });

    push();

    for (let l = 0; l < lineCount; l++) {
      let divider = R.random_int(10, 1000);
      let rotation = radians(l / divider);

      const offset = R.random_num(1, 10);
      const curveType = R.random_choice([HALF_PI, PI, TAU]);

      if (isLineVertical) {
        translate(lineTranslate, 0);
      } else {
        translate(0, lineTranslate);
      }

      if (this.isFree) {
        if (this.isGlitch) {
          const newRotation = toggleRot ? -rotation : rotation;
          rotate(newRotation);
        } else {
          rotate(-rotation);
        }
      }

      beginShape();

      for (let i = offset; i < lineSize - offset; i += 1) {
        let x, y;
        let noise = this.isNoisy ? R.random_dec() : 0;

        if (isLineVertical) {
          if (this.isOverstitch && !this.isCascade) {
            x = tan(i * radians(curveType)) * curveSize + noise;
          } else {
            x = cos(i * radians(curveType)) * curveSize + noise;
          }
          y = i * 1;
        } else {
          if (this.isOverstitch && this.isCascade) {
            y = tan(i * radians(curveType)) * curveSize + noise;
          } else {
            y = cos(i * radians(curveType)) * curveSize + noise;
          }
          x = i * 1;
        }

        vertex(x, y);
      }

      endShape();
      lineTranslate = +curveSize;
    }
    pop();
  }
}
