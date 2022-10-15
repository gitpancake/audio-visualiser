import { Random } from "../random";

export class Scribbles {
    constructor(w, h, x = 0, y = 0,drawBox = false) {
      this.spacing = 10;
      this.width = w - this.spacing;
      this.height = h - this.spacing;
      this.xPos = x;
      this.yPos = y;
      this.drawBox = drawBox;
    }
  
    show() {
  
      noFill();
      // rect(this.xPos, this.yPos, this.width, this.height);
  
      // stroke(255);
      // strokeWeight(2);
  
      const isLineVertical = R.random_bool(0.5);
      const lineSize = isLineVertical ? this.height : this.width;
      const curveSize = R.random_int(1, 10);
  
      // If vertical use width else use height
      const lineContainerSize = isLineVertical ? this.width : this.height;
      const lineCount = lineContainerSize / curveSize - 1;
      
      let lineTranslate = this.xPos + curveSize;
      
      for (let l = 0; l < lineCount; l++) {
        const lineSizeOffset = R.random_int(1,20);
        const theta = 1;
        const curveType = R.random_choice([QUARTER_PI, HALF_PI, PI]);
  
        if (isLineVertical) {
          translate(lineTranslate, 0);
        } else {
          translate(0, lineTranslate);
        }
  
        beginShape();
  
        for (let i = lineSizeOffset; i < lineSize - lineSizeOffset; i += theta) {
          let xPos = 0;
          let yPos = 0;
          let lineNoise = R.random_dec();
  
          if (isLineVertical) {
            xPos = cos(i * radians(curveType)) * curveSize + lineNoise;
            yPos = i * 1;
          } else {
            xPos = i * 1;
            yPos = cos(i * radians(curveType)) * curveSize + lineNoise;
          }
  
          vertex(xPos, yPos);
        }
  
        endShape();
  
        // resetMatrix()
  
        lineTranslate = +curveSize;
      }
      
    }
  }