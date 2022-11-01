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
    isGlitch
  ) {
    this.width = w;
    this.height = h;
    this.palette = palette;
    this.isNoisy = isNoisy;
    this.isCascade = isCascade;
    this.isOverstitch = isOverstitch;
    this.isGlitch = isGlitch;

    // Store
    this.isLineVertical = R.random_bool(0.5);
    this.curveSize = R.random_int(2, 8);

    this.thicknessArr = [];
    this.toggleRotArr = [];
    this.dividersArr = [];
    this.offsetArr = [];
    this.curveTypeArr = [];

  }

  show(drawScale = 1, redraw = false) {

    console.log(drawScale)
    noFill();

    const col = pickRndColor(this.palette);
    stroke(color(col.r, col.g, col.b));

    const containerSize = this.isLineVertical
      ? this.width * drawScale
      : this.height * drawScale;
    const lineCountOffset = 1;
    const lineCount =
      Math.ceil(containerSize / (this.curveSize * drawScale)) - lineCountOffset;

    let lineTranslate = this.curveSize;
    let toggleRot = R.random_bool(0.5);
    let divider = 100;

    push();

    for (let l = 0; l < lineCount; l++) {
      const thickness = R.random_int(1, 3);
      strokeWeight(thickness);

      if (this.isLineVertical) {
        translate(lineTranslate, 0);
      } else {
        translate(0, lineTranslate);
      }

      if (this.isGlitch) {
        toggleRot = R.random_bool(0.5);
        divider = R.random_int(1, 100);

        const rotation = radians(l / divider);
        const newRotation = toggleRot ? -rotation : rotation;
        rotate(newRotation);

        const col = pickRndColor(this.palette);
        stroke(color(col.r, col.g, col.b));
      }

      // SAVE
      this.toggleRotArr.push(toggleRot);

      const offset = R.random_num(1, 10);
      const curveType = R.random_choice([QUARTER_PI, HALF_PI, PI]);

      beginShape();

      for (let i = offset; i < containerSize - offset; i += 1) {
        let x, y;
        let noise = this.isNoisy ? R.random_dec() : 0;

        if (this.isLineVertical) {
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

        vertex(x, y);
      }

      endShape();
      lineTranslate = +this.curveSize;
    }
    pop();
  }
}
