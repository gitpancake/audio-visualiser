import { gridDivider, debugGrid } from "./helpers";
import { Random, tokenData } from "./random";
const R = new Random();
import { config } from "./config";
const c = config;
import { Bamileke, Flower, Scribbles } from "./shapes";
import { Motif } from "./shapes/motif";
import { calculateFeatures } from "./meta";

// Setup Canvas
window.setup = () => {
  createCanvas(c.canvasWidth, c.canvasHeight);
  noLoop();
  noFill();
  noStroke();
  const bg = c.palette.background;
  background(color(bg.r, bg.g, bg.b));
  calculateFeatures(tokenData);
};

const gridWidth = c.canvasWidth - c.gridMargin.x * 2;
const gridHeight = c.canvasHeight - c.gridMargin.y * 2;

window.draw = () => {
  // DEBUG
  // stroke("red");
  // strokeWeight(4);
  // rect(
  //   c.gridMargin.x,
  //   c.gridMargin.y,
  //   c.canvasWidth - c.gridMargin.x * 2,
  //   c.canvasHeight - c.gridMargin.y * 2
  // );
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
  //   debugGrid(50);

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
      // rect(0, 0, blockW, blockH);

      // Colour Palettes - 5 Options
      // - B&W / Grayscale
      // - TBC
      // - TBC

      // Background - 3 Options
      // Coils - need to implement from prev project iter

      // Foreground - 3 Options? // maybe
      // Eyes ?
      // Shields / Trigonmetric TAN

      const motif = new Motif(
        blockW,
        blockH,
        c.palette,
        c.isNoisy,
        c.isCascade,
        c.isOverstitch,
        c.isGlitch,
        c.isFree
      );

      if (c.isBamileke) {
        motif.show();
        const bamileke = new Bamileke(
          blockW,
          blockH,
          c.palette,
          c.isNoisy,
          c.isCascade,
          c.isOverstitch,
          c.isGlitch,
          c.isFree
        );
        bamileke.show();
      } else {
        if (R.random_bool(0.8)) {
          const scribbles = new Scribbles(
            blockW,
            blockH,
            c.palette,
            c.isNoisy,
            c.isCascade,
            c.isOverstitch,
            c.isGlitch,
            c.isFree
          );
          scribbles.show();
        } else {
          motif.show();
          if (c.isFloral) {
            const flower = new Flower(
              blockW,
              blockH,
              c.palette,
              c.isNoisy,
              c.isCascade,
              c.isOverstitch,
              c.isGlitch,
              c.isFree
            );
            flower.show();
          }
        }
      }

      pop();

      blockTranslateB += blockDimB[b] + loopTwoSpacing;
    }
    blockTranslateA += blockDimA[a] + loopOneSpacing;
  }
};
