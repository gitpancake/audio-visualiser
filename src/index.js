import { gridDivider, debugGrid } from "./helpers";
import { Random } from "./random";
const R = new Random();
import { config } from "./config";
const c = config;
import { Flower, Scribbles } from "./shapes";

// Setup Canvas
window.setup = () => {
  createCanvas(c.canvasWidth, c.canvasHeight);
  noLoop();
  noFill();
  noStroke();
  const bg = c.palette.background;
  background(color(bg.r, bg.g, bg.b));
};

const gridWidth = c.canvasWidth - c.gridMargin.x * 2;
const gridHeight = c.canvasHeight - c.gridMargin.y * 2;
console.table({ gridWidth, gridHeight });

window.draw = () => {
  // DEBUG
  //   stroke("red");
  //   rect(
  //     c.gridMargin.x,
  //     c.gridMargin.y,
  //     c.canvasWidth - c.gridMargin.x * 2,
  //     c.canvasHeight - c.gridMargin.y * 2
  //   );
  // DEBUG - END

  stroke(255);

  const spacing = c.gridSpacing;
  const loopOneCount = c.isCascade ? c.gridSize.x : c.gridSize.y;
  const loopOneDiv = loopOneCount * 2;
  const loopOneSpacing = spacing / loopOneCount;
  const loopOneMargin = c.isCascade ? c.gridMargin.x : c.gridMargin.y;
  const loopOneDim = c.isCascade ? gridWidth : gridHeight;

  const loopTwoCount = c.isCascade ? c.gridSize.y : c.gridSize.x;
  const loopTwoDiv = loopTwoCount * 2;
  const loopTwoSpacing = spacing / loopTwoCount;
  const loopTwoMargin = c.isCascade ? c.gridMargin.y : c.gridMargin.x;
  const loopTwoDim = c.isCascade ? gridHeight : gridWidth;

  const blockDimA = gridDivider(
    loopOneDim / loopOneDiv,
    loopOneDim,
    loopOneCount,
    loopOneDim
  );

  let blockTranslateA = loopOneMargin + spacing / (loopOneCount * 2);

  for (let a = 0; a < loopOneCount; a++) {
    let blockTranslateB = loopTwoMargin + spacing / (loopTwoCount * 2);

    const blockDimB = gridDivider(
      loopTwoDim / loopTwoDiv,
      loopTwoDim,
      loopTwoCount,
      loopTwoDim
    );

    for (let b = 0; b < loopTwoCount; b++) {
      let blockW = c.isCascade ? blockDimA[a] : blockDimB[b];
      let blockH = c.isCascade ? blockDimB[b] : blockDimA[a];
      blockW = blockW - spacing;
      blockH = blockH - spacing;

      push();

      if (c.isCascade) {
        translate(blockTranslateA, blockTranslateB);
      } else {
        translate(blockTranslateB, blockTranslateA);
      }

      // SHAPE LOGIC - HERE
    //   rect(0, 0, blockW, blockH);

      // Colour Palettes - 5 Options
      // - Kamerun
      // - B&W / Grayscale
      // - Golden / Coppper
      // - TBC
      // - TBC

      // Background - 3 Options
      // Scribbles - implemented, need to tidy up and add rari.
      // Coils - need to implement from prev project iter
      // Trigonometry - need to implement - look at

      // Foreground - 3 Options?
      // Flowers
      // Eye
      // Shields / Trigonmetric TAN

      // Grid Styles - 2 Options
      // Normal Grid
      // Cascading Grid

      // Draw Styles -  2 Options
      // Normal
      // Noisy / Hand Drawn

      // Other Rarity
      // Overstitch fun/back-stitch ...
      // LineOver fun/lineover branch

      const scribbles = new Scribbles(
        blockW,
        blockH,
        c.palette,
        c.isNoisy,
        c.isCascade,
        c.isOverstitch,
        c.isGlitch,
        c.isFreeform
      );
      scribbles.show();

      // const p3 = 0.5; // percentage - 0.1 = 10% etc..
      // const h3 = blockH;
      // const w3 = blockW;

      // if (h3 > w3 + w3 * p3) {
      //   const flower = new Flower(
      //     blockW,
      //     blockH,
      //     c.isNoisy,
      //     c.palette,
      //     Math.floor(Math.sqrt(blockW * blockH) / 100)
      //   );
      //   flower.draw();
      // }

      pop();

      blockTranslateB += blockDimB[b] + loopTwoSpacing;
    }
    blockTranslateA += blockDimA[a] + loopOneSpacing;
  }
  //   debugGrid(25);
};
