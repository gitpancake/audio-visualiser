import { pickRndColor } from "../helpers";
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
    isGlitch
  ) {
    this.width = w;
    this.height = h;
    this.palette = palette;
    this.isNoisy = isNoisy;
    this.isCascade = isCascade;
    this.isOverstitch = isOverstitch;
    this.isGlitch = isGlitch;

    const QUARTER_PI = 0.7853982;
    const HALF_PI = QUARTER_PI * 2;
    const PI = HALF_PI * 2;
    const TAU = PI * 2;

    // Props
    this.isVertical = R.random_bool(0.5);
    this.strokeSize = R.random_int(1,10);
    this.radian = R.random_choice([HALF_PI, PI, TAU]);
    this.primaryColor = pickRndColor(this.palette);
    this.containerSize = this.isVertical ? this.width : this.height;
    this.theta = 1;
    this.thetaDots = 1;
    this.coilSpacing = 2;
    this.noiseMult = 2;
    this.coilAmount = R.random_int(2, 10);
    this.coilWidth = this.containerSize / this.coilAmount / this.coilSpacing;
    this.coilLength = this.isVertical ? this.height : this.width;

    this.transXArr = [];
    this.transYArr = [];
    this.dotStepsArr = [];
    this.noiseXTopArr = [];
    this.noiseYTopArr = [];
    this.noiseXBtmArr = [];
    this.noiseYBtmArr = [];
    this.noiseTopDotsArr = [];
    this.noiseBtmDotsArr = [];
    this.notGlitchCols = [];
    this.lineThickArr = [];
    this.glitchTopCols = [];
    this.glitchBtmCols = [];
  }

  generate() {
    for (let c = 0; c < this.coilAmount; c++) {
      if (this.isVertical) {
        if (this.isGlitch) {
          this.transYArr.push(R.random_bool(0.5));
        }
      } else {
        if (this.isGlitch) {
          this.transXArr.push(R.random_bool(0.5));
        }
      }
      this.dotStepsArr.push(R.random_int(5, 10));
      this.noiseXTopArr.push([]);
      this.noiseYTopArr.push([]);
      for (let i = 0; i < this.coilLength; i += this.theta) {
        const noiseX = this.isNoisy ? R.random_dec() * this.noiseMult : 0;
        const noiseY = this.isNoisy ? R.random_dec() * this.noiseMult : 0;
        this.noiseXTopArr[c].push(noiseX);
        this.noiseYTopArr[c].push(noiseY);
      }
      this.noiseXBtmArr.push([]);
      this.noiseYBtmArr.push([]);
      for (let i = this.coilLength; i > 0; i -= this.theta) {
        const noiseX = this.isNoisy ? R.random_dec() * this.noiseMult : 0;
        const noiseY = this.isNoisy ? R.random_dec() * this.noiseMult : 0;
        this.noiseXBtmArr[c].push(noiseX);
        this.noiseYBtmArr[c].push(noiseY);
      }
      if (!this.isGlitch) {
        this.notGlitchCols.push(pickRndColor(this.palette));
      }

      this.lineThickArr.push(R.random_int(2, 4));

      // top curve - dots
      this.glitchTopCols.push([]);
      this.noiseTopDotsArr.push([]);
      for (let i = 0; i < this.coilLength; i += this.thetaDots) {
        if (this.isGlitch) {
          this.glitchTopCols[c].push(pickRndColor(this.palette));
        }

        const noise = this.isNoisy ? R.random_dec() * 4 : R.random_dec();
        this.noiseTopDotsArr[c].push(noise);
      }

      // bottom curve - dots
      this.glitchBtmCols.push([]);
      this.noiseBtmDotsArr.push([]);
      for (let i = this.coilLength; i > 0; i -= this.thetaDots) {
        if (this.isGlitch) {
          this.glitchBtmCols[c].push(pickRndColor(this.palette));
        }

        const noise = this.isNoisy ? R.random_dec() * 4 : R.random_dec();
        this.noiseBtmDotsArr[c].push(noise);
      }
    }
  }

  show(drawScale = 1) {
    noFill();

    strokeWeight(this.strokeSize * drawScale);
    
    let col = this.primaryColor;
    stroke(color(col.r, col.g, col.b));

    let coilTranslate = this.coilWidth;

    for (let c = 0; c < this.coilAmount; c++) {
      push();

      const altTranslate = coilTranslate / (this.coilAmount * 4);

      if (this.isVertical) {
        if (this.isGlitch) {
          const transY = this.transYArr[c] ? altTranslate : -altTranslate;
          translate(coilTranslate * drawScale, transY * drawScale);
        } else {
          translate(coilTranslate * drawScale, 0);
        }
      } else {
        if (this.isGlitch) {
          const transX = this.transXArr[c] ? altTranslate : -altTranslate;
          translate(transX * drawScale, coilTranslate * drawScale);
        } else {
          translate(0, coilTranslate * drawScale);
        }
      }

      let dotStep = this.dotStepsArr[c];

      // top curve
      beginShape();
      for (let i = 0; i < this.coilLength; i += this.theta) {
        const noiseX = this.noiseXTopArr[c][i];
        const noiseY = this.noiseYTopArr[c][i];
        let xPos = i;
        let yPos = cos(i * radians(this.radian)) * this.coilWidth;

        if (this.isVertical) {
          xPos = sin(i * radians(this.radian)) * this.coilWidth;
          if (this.isOverstitch) {
            xPos = tan(i * radians(this.radian)) * this.coilWidth;
          }
          yPos = i;
        }
        curveVertex((xPos + noiseX) * drawScale, (yPos + noiseY) * drawScale);
      }
      endShape();

      // bottom curve
      beginShape();
      for (let i = this.coilLength; i > 0; i -= this.theta) {
        const noiseX = this.noiseXBtmArr[c][i];
        const noiseY = this.noiseYBtmArr[c][i];

        let xPos = i;
        let yPos = -sin(i * radians(this.radian)) * this.coilWidth;

        if (this.isVertical) {
          xPos = -sin(i * radians(this.radian)) * this.coilWidth;
          if (this.isOverstitch) {
            xPos = -tan(i * radians(this.radian)) * this.coilWidth;
          }
          yPos = i;
        }
        curveVertex((xPos + noiseX) * drawScale, (yPos + noiseY) * drawScale);
      }
      endShape();

      if (!this.isGlitch) {
        let col = this.notGlitchCols[c];
        stroke(color(col.r, col.g, col.b));
      }

      const thickness = this.lineThickArr[c];
      strokeWeight(thickness * drawScale);

      // top curve - dots
      beginShape();
      for (let i = 0; i < this.coilLength; i += this.thetaDots) {
        if (this.isGlitch) {
          let col = this.glitchTopCols[c][i];
          stroke(color(col.r, col.g, col.b));
        }

        let xPos = i;
        let yPos = cos(i * radians(this.radian)) * this.coilWidth;

        if (this.isVertical) {
          xPos = sin(i * radians(this.radian)) * this.coilWidth;
          yPos = i;
        }

        const noise = this.noiseTopDotsArr[c][i];

        if (Math.round(i) % dotStep == 0) {
          if (this.isVertical) {
            point((xPos + noise) * drawScale, yPos * drawScale);
          } else {
            point(xPos * drawScale, (yPos + noise) * drawScale);
          }
        }
      }
      endShape();

      // bottom curve - dots
      beginShape();
      for (let i = this.coilLength - 1; i > 0; i -= this.thetaDots) {
        if (this.isGlitch) {
          let col = this.glitchBtmCols[c][i];
          stroke(color(col.r, col.g, col.b));
        }

        let xPos = i;
        let yPos = -cos(i * radians(this.radian)) * this.coilWidth;

        if (this.isVertical) {
          xPos = -sin(i * radians(this.radian)) * this.coilWidth;
          yPos = i;
        }

        const noise = this.noiseBtmDotsArr[c][i];

        if (Math.round(i) % dotStep == 0) {
          if (this.isVertical) {
            point((xPos + noise) * drawScale, yPos * drawScale);
          } else {
            point(xPos * drawScale, (yPos + noise) * drawScale);
          }
        }
      }
      endShape();

      pop();

      coilTranslate += this.coilWidth * this.coilSpacing;
    }
  }
}
