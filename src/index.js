import { tokenData } from "./random";
import { config, calculateFeatures } from "./config";
const c = config;
import { gridDivider } from "./helpers";

console.log();

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
  stroke(255);

  const loopOneCount = c.isCascade ? c.gridSize.x : c.gridSize.y;
  const loopOneDiv = loopOneCount*2;
  const loopOneMargin = c.isCascade ? c.gridMargin.x : c.gridMargin.y;
  const loopOneDimension = c.isCascade ? gridWidth : gridHeight;

  const loopTwoCount = c.isCascade ? c.gridSize.y : c.gridSize.x;
  const loopTwoDiv = loopTwoCount*2;
  const loopTwoMargin = c.isCascade ? c.gridMargin.y : c.gridMargin.x;
  const loopTwoDimension = c.isCascade ? gridHeight : gridWidth;

  const blockSizesA = gridDivider(
    loopOneDimension / loopOneDiv,
    loopOneDimension,
    loopOneCount,
    loopOneDimension
  );

  let blockTranslateA = loopOneMargin;

  for (let a = 0; a < loopOneCount; a++) {
    let blockTranslateB = loopTwoMargin;

    const blockSizesB = gridDivider(
      loopTwoDimension / loopTwoDiv,
      loopTwoDimension,
      loopTwoCount,
      loopTwoDimension
    );

    for (let b = 0; b < loopTwoCount; b++) {

      const blockW = c.isCascade ? blockSizesA[a] : blockSizesB[b];
      const blockH = c.isCascade ? blockSizesB[b] : blockSizesA[a];

      push();

      if (c.isCascade) {
        translate(blockTranslateA, blockTranslateB);
      } else {
        translate(blockTranslateB, blockTranslateA);
      }

      rect(0, 0, blockW, blockH);

      pop();

      blockTranslateB += blockSizesB[b];
    }

    blockTranslateA += blockSizesA[a];

  }
};
