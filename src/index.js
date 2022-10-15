import { tokenData } from "./random";
import { gridDivider } from "./helpers";
import { config, calculateFeatures } from "./config";
const c = config;

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
  stroke("red");
  rect(
    c.gridMargin.x,
    c.gridMargin.y,
    c.canvasWidth - c.gridMargin.x * 2,
    c.canvasHeight - c.gridMargin.y * 2
  );
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
      const blockW = c.isCascade ? blockDimA[a] : blockDimB[b];
      const blockH = c.isCascade ? blockDimB[b] : blockDimA[a];

      push();

      if (c.isCascade) {
        translate(blockTranslateA, blockTranslateB);
      } else {
        translate(blockTranslateB, blockTranslateA);
      }

      // SHAPE LOGIC - HERE
      rect(0, 0, blockW - spacing, blockH - spacing);

      pop();

      blockTranslateB += blockDimB[b] + loopTwoSpacing;
    }
    blockTranslateA += blockDimA[a] + loopOneSpacing;
  }
};
