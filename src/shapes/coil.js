import { normalise, pickRndColor } from "../helpers";
import { defaultPalette } from "../palettes";
import { Random } from "../random";
const R = new Random();

export class Coils {
  constructor(
    w,
    h,
    palette = defaultPalette,
    isNoisy,
    isCascade,
    isOverstitch,
    isGlitch,
  ) {
    this.width = w;
    this.height = h;
    this.palette = palette;
    this.isNoisy = isNoisy;
    this.isCascade = isCascade;
    this.isOverstitch = isOverstitch;
    this.isGlitch = isGlitch;
  }

  show() {
    noFill();

    const isOrientationVertical = R.random_bool(0.5);
    const theta = 0.7;
    const thetaDots = 0.7;

    const containerSize = isOrientationVertical ? this.width : this.height;
    const radian = R.random_choice([HALF_PI, PI, TAU]);
    const coilSpacing = 2;
    const coilAmount = R.random_int(2, 10);
    const coilWidth = containerSize / coilAmount / coilSpacing;
    const coilLength = isOrientationVertical ? this.height : this.width;

    let coilTranslate = coilWidth;
    const strokeSize = Math.round(10 * normalise(containerSize, width, 0));
    strokeWeight(strokeSize);

    let col = pickRndColor(this.palette);
    stroke(color(col.r, col.g, col.b));

    for (let c = 0; c < coilAmount; c++) {
      push();

      const altTranslate = coilTranslate / (coilAmount * 4);

      if (isOrientationVertical) {
        if (this.isGlitch) {
          const transY = R.random_bool(0.5) ? altTranslate : -altTranslate;
          translate(coilTranslate, transY);
        } else {
          translate(coilTranslate, 0);
        }
      } else {
        if (this.isGlitch) {
          const transX = R.random_bool(0.5) ? altTranslate : -altTranslate;
          translate(transX, coilTranslate);
        } else {
          translate(0, coilTranslate);
        }
      }

      let dotStep = R.random_int(5, 10);

      // top curve
      beginShape();
      for (let i = 0; i < coilLength; i += theta) {
        const noiseX = this.isNoisy ? R.random_dec() * 2 : 0;
        const noiseY = this.isNoisy ? R.random_dec() * 2 : 0;
        let xPos = i;
        let yPos = cos(i * radians(radian)) * coilWidth;

        if (isOrientationVertical) {
          xPos = sin(i * radians(radian)) * coilWidth;
          if (this.isOverstitch) {
            xPos = tan(i * radians(radian)) * coilWidth;
          }
          yPos = i;
        }

        curveVertex(xPos + noiseX, yPos + noiseY);
      }
      endShape();

      // bottom curve
      beginShape();
      for (let i = coilLength; i > 0; i -= theta) {
        const noiseX = this.isNoisy ? R.random_dec() * 2 : 0;
        const noiseY = this.isNoisy ? R.random_dec() * 2 : 0;

        let xPos = i;
        let yPos = -sin(i * radians(radian)) * coilWidth;

        if (isOrientationVertical) {
          xPos = -sin(i * radians(radian)) * coilWidth;
          if (this.isOverstitch) {
            xPos = -tan(i * radians(radian)) * coilWidth;
          }
          yPos = i;
        }
        curveVertex(xPos + noiseX, yPos + noiseY);
      }
      endShape();

      if (!this.isGlitch) {
        col = pickRndColor(this.palette);
        stroke(color(col.r, col.g, col.b));
      }

      const thickness = R.random_int(1, 3);
      strokeWeight(thickness);

      // top curve - dots
      beginShape();
      for (let i = 0; i < coilLength; i += thetaDots) {
        if (this.isGlitch) {
          col = pickRndColor(this.palette);
          stroke(color(col.r, col.g, col.b));
        }

        let xPos = i;
        let yPos = cos(i * radians(radian)) * coilWidth;

        if (isOrientationVertical) {
          xPos = sin(i * radians(radian)) * coilWidth;
          yPos = i;
        }

        const noise = this.isNoisy ? R.random_dec() * 4 : R.random_dec();

        if (Math.round(i) % dotStep == 0) {
          if (isOrientationVertical) {
            point(xPos + noise, yPos);
          } else {
            point(xPos, yPos + noise);
          }
        }
      }
      endShape();

      // bottom curve - dots
      beginShape();
      for (let i = coilLength; i > 0; i -= thetaDots) {
        if (this.isGlitch) {
          col = pickRndColor(this.palette);
          stroke(color(col.r, col.g, col.b));
        }

        let xPos = i;
        let yPos = -cos(i * radians(radian)) * coilWidth;

        if (isOrientationVertical) {
          xPos = -sin(i * radians(radian)) * coilWidth;
          yPos = i;
        }

        const noise = this.isNoisy ? R.random_dec() * 4 : R.random_dec();

        if (Math.round(i) % dotStep == 0) {
          if (isOrientationVertical) {
            point(xPos - noise, yPos);
          } else {
            point(xPos, yPos - noise);
          }
        }
      }
      endShape();

      pop();

      coilTranslate += coilWidth * coilSpacing;
    }
  }
}
