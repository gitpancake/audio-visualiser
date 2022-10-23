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

    const isLineVertical = R.random_bool(0.5);
    const lineSize = isLineVertical ? this.height : this.width;
    const containerSize = isLineVertical ? this.width : this.height;
    const curveSize = R.random_int(2, 6);
    const lineCountOffset = 1;
    const lineCount = Math.ceil(containerSize / curveSize) - lineCountOffset;
    let lineTranslate = curveSize;
    let toggleRot = R.random_bool(0.5);

    push();

    for (let l = 0; l < lineCount; l++) {
      const thickness = R.random_int(1, 3);
      strokeWeight(thickness);

      if (this.isGlitch) {
        toggleRot = R.random_bool(0.5);
      }
      let divider = this.isGlitch ? R.random_int(1, 100) : 100;
      let rotation = radians(l / divider);

      const offset = R.random_num(1, 10);
      const curveType = R.random_choice([HALF_PI, PI, TAU]);

      if (isLineVertical) {
        translate(lineTranslate, 0);
      } else {
        translate(0, lineTranslate);
      }

      if (this.isFree) {
        const newRotation = toggleRot ? -rotation : rotation;
        if (this.isGlitch) {
          rotate(newRotation);
        } else {
          rotate(newRotation);
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
