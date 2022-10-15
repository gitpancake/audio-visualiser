import { petalOptions } from "./shape-options";
import { reduceDenominator } from "../helpers";
import { Random } from "../random";
import { defaultPalette } from "../palettes";
const R = new Random();

export class Flower {
    /**
     * Draw Flower
     * @constructor
     * @param {number} width container width
     * @param {string} height container height
     * @param {string} isNoisey enable noisey drawings
     * @param {string} colorPalette colour palette
     * @param {string} strokeSize petal stroke size
     * @param {string} petalAmount amount of petals
     */
    constructor(
      width,
      height,
      isNoisey = false,
      colorPalette = defaultPalette,
      strokeSize = 1,
      petalAmount = 1,
    ) {

      this.width = width;
      this.height = height;
      this.colorPalette = colorPalette;
      this.petalAmount = petalAmount;
      this.strokeSize = strokeSize;
      this.isOrientationVertical = false;
      this.colorBg = this.colorPalette.background;
      this.isNoisey = isNoisey;
      
      console.log(this.strokeSize)
      // this.radius;
  
      if (this.width > this.height) {
        // this.width = this.height;
      } else {
        // this.height = this.width;
        this.isOrientationVertical = true;
      }
    }
  
    colourPick() {
      return R.random_choice(this.colorPalette.colors);
    }
  
    draw() {
      noFill();
  
      // debug - bounding container
    //   stroke("red");
    //   rect(0,0, this.width, this.height);
      // debug - end
  
      // pick random petal
      let shapeTranslateY = 0;
      let rowCount = this.petalAmount//this.isOrientationVertical ? this.petalAmount : 1;
  
      // Start petal row loop
      for (let row = 1; row < rowCount + 1; row++) {
        let shapeTranslateX = 0;
        let shapeWidth = this.width / this.petalAmount;
        let shapeHeight = this.height / this.petalAmount;
  
        if (!this.isOrientationVertical) {
          shapeWidth = this.height / this.petalAmount;
        }
  
        // Start petal column loop
        for (let col = 1; col < this.petalAmount + 1; col++) {
          
          const petal = R.random_choice(petalOptions);
          const theta = 0.002;
          const m = petal.m;
          const n = petal.n;
          const o = petal.o; // draw offset
          const c = petal.c; // draw crop
          const k = m / n;
          const count = m * 2;
          const radiusScale = R.random_num(2.6, 4);
          const lineStep = TWO_PI * reduceDenominator(m, n);
  
          let thetaOuter = theta;
          const petalOuter = R.random_choice(petalOptions);
          const radiusScaleOuter = R.random_num(1.9, 2.5);
          const mOuter = petalOuter.m;
          const nOuter = petalOuter.n;
          const kOuter = mOuter / nOuter;
          const lineStepOuter = TWO_PI * reduceDenominator(mOuter, nOuter);
          const xBounds = shapeWidth;
          const yBounds = shapeHeight;
  
          let colour = this.colourPick();
  
          push();
          translate(shapeTranslateX, shapeTranslateY);
  
          // DEBUG
        //   strokeWeight(2);
        //   stroke("purple");
        //   fill(20)
        //   circle(shapeWidth / 2, shapeHeight / 2, shapeWidth);
          // DEBUG - END
  
          stroke(color(this.colorBg.r, this.colorBg.g, this.colorBg.b));
          strokeWeight(this.strokeSize);
  
          if (R.random_bool(0.5)) {
            colour = this.colourPick();
            fill(color(colour.r, colour.g, colour.b));
          }
  
        //   if (R.random_bool(0.25)) {
        //     beginShape(LINES);
        //     thetaOuter = theta * 10;
        //   } else if (R.random_bool(0.25)) {
        //     beginShape(POINTS);
            // thetaOuter = theta * 10;
        //   } else {
            beginShape();
        //   }
  
          for (let i = 0; i < lineStepOuter; i += thetaOuter) {
            const noise = this.isNoisey ? R.random_dec() *this.strokeSize : 0;
            const radius = (shapeWidth * Math.cos(i * kOuter)) / radiusScaleOuter;
            let xPos = radius * Math.cos(i) + shapeWidth / 2 + noise;
            let yPos = radius * Math.sin(i) + shapeHeight / 2 + noise;
  
            // if (xPos > xBounds) xPos = xBounds;
            // if (xPos < 0) xPos = 0;
  
            // if (yPos > yBounds) yPos = yBounds;
            // if (yPos < 0) yPos = 0;
  
            curveVertex(xPos, yPos);
          }
          endShape();
          pop();
  
          noFill();
          strokeWeight(this.strokeSize);
  
          if (R.random_bool(0.5)) {
            colour = this.colourPick();
            fill(color(colour.r, colour.g, colour.b));
          } else {
            // default to blank BG
            fill(color(this.colorBg.r, this.colorBg.g, this.colorBg.b));
          }
  
          colour = this.colourPick();
          stroke(color(colour.r, colour.g, colour.b));
  
          push();
          translate(shapeTranslateX, shapeTranslateY);
          beginShape();
          for (let i = 0; i < lineStep; i += theta) {
            const noise = this.isNoisey ? R.random_dec() : 0;
            const radius = (shapeWidth * Math.cos(i * k)) / radiusScale;
            let xPos = radius * Math.cos(i) + shapeWidth / 2 + noise;
            let yPos = radius * Math.sin(i) + shapeHeight / 2 + noise;
  
            // if (xPos > xBounds) xPos = xBounds;
            // if (xPos < 0) xPos = 0;
  
            // if (yPos > yBounds) yPos = yBounds;
            // if (yPos < 0) yPos = 0;
  
            curveVertex(xPos, yPos);
          }
          endShape();
          pop();
          noFill();
  
          // Petal Details
          if (R.random_bool(0.9)) {
            push();
            translate(shapeTranslateX, shapeTranslateY);
            for (let d = o; d < count - c; d++) {
              const scale = (shapeWidth / count) * d;
              const angle = TWO_PI / count;
              const size = scale / count;
  
              // DOT STYLE
              if (R.random_bool(0.5)) {
                colour = this.colourPick();
                stroke(color(colour.r, colour.g, colour.b));
                strokeWeight(size / 2.2);
  
                for (let p = 0; p < count; p++) {
                  const x =
                    shapeWidth / 2 + (Math.sin(angle * p) * scale) / radiusScale;
                  const y =
                    shapeHeight / 2 + (Math.cos(angle * p) * scale) / radiusScale;
  
                  point(x, y);
                }
              }
              // POINT STYLE
              if (R.random_bool(0.5)) {
                colour = this.colourPick();
                stroke(color(colour.r, colour.g, colour.b));
                strokeWeight(size / 4);
  
                for (let p = 0; p < count; p++) {
                  const x =
                    shapeWidth / 2 + (Math.sin(angle * p) * scale) / radiusScale;
                  const y =
                    shapeHeight / 2 + (Math.cos(angle * p) * scale) / radiusScale;
  
                  point(x, y);
                }
              }
            }
            pop();
          }
          // STYLE RESET
          strokeWeight(this.strokeSize);
  
          shapeTranslateX = +shapeWidth * col;
        }
  
        shapeTranslateY = +shapeHeight * row;
      }
    }
  }