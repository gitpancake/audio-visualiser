import { gridDivider, debugGrid } from "./helpers";
import { Random, tokenData } from "./random";
import { config } from "./config";
import { Bamileke, Flower, Scribbles } from "./shapes";
import { Motif } from "./shapes/motif";
import { calculateFeatures } from "./meta";
const R = new Random();
const cfg = config;
const bg = cfg.palette.background;
const gridWidth = cfg.canvasWidth - cfg.gridMargin.x * 2;
const gridHeight = cfg.canvasHeight - cfg.gridMargin.y * 2;

// Setup Canvas
window.setup = () => {
  createCanvas(cfg.canvasWidth, cfg.canvasHeight);
  noLoop();
  noFill();
  noStroke();
  background(color(bg.r, bg.g, bg.b));
  calculateFeatures(tokenData);
};

window.draw = () => {
  // DEBUG
  // stroke("red");
  // strokeWeight(4);
  // rect(
  //   cfg.gridMargin.x,
  //   cfg.gridMargin.y,
  //   cfg.canvasWidth - cfg.gridMargin.x * 2,
  //   cfg.canvasHeight - cfg.gridMargin.y * 2
  // );
  // DEBUG - END

  stroke(255);

  const spacing = cfg.gridSpacing;
  const loopOneCount = cfg.isCascade ? cfg.gridSize.x : cfg.gridSize.y;
  const loopOneDiv = loopOneCount * 2;
  const loopOneSpacing = spacing / loopOneCount;
  const loopOneMargin = cfg.isCascade ? cfg.gridMargin.x : cfg.gridMargin.y;
  const loopOneDim = cfg.isCascade ? gridWidth : gridHeight;

  const loopTwoCount = cfg.isCascade ? cfg.gridSize.y : cfg.gridSize.x;
  const loopTwoDiv = loopTwoCount * 2;
  const loopTwoSpacing = spacing / loopTwoCount;
  const loopTwoMargin = cfg.isCascade ? cfg.gridMargin.y : cfg.gridMargin.x;
  const loopTwoDim = cfg.isCascade ? gridHeight : gridWidth;

  const blockDimA = gridDivider(
    loopOneDim / loopOneDiv,
    loopOneDim,
    loopOneCount,
    loopOneDim
  );

  let blockDimBClone = [];

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

    blockDimBClone.push(blockDimB);

    for (let b = 0; b < loopTwoCount; b++) {
      let blockW = cfg.isCascade ? blockDimA[a] : blockDimB[b];
      let blockH = cfg.isCascade ? blockDimB[b] : blockDimA[a];
      blockW = blockW - spacing;
      blockH = blockH - spacing;

      push();

      if (cfg.isCascade) {
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
        cfg.palette,
        cfg.isNoisy,
        cfg.isCascade,
        cfg.isOverstitch,
        cfg.isGlitch,
        cfg.isFree
      );

      if (cfg.isBamileke) {
        motif.show();
        const bamileke = new Bamileke(
          blockW,
          blockH,
          cfg.palette,
          cfg.isNoisy,
          cfg.isCascade,
          cfg.isOverstitch,
          cfg.isGlitch,
          cfg.isFree
        );
        bamileke.show();
      } else {
        if (R.random_bool(0.8)) {
          const scribbles = new Scribbles(
            blockW,
            blockH,
            cfg.palette,
            cfg.isNoisy,
            cfg.isCascade,
            cfg.isOverstitch,
            cfg.isGlitch,
            cfg.isFree
          );
          scribbles.show();
        } else {
          motif.show();
        }
      }

      pop();

      blockTranslateB += blockDimB[b] + loopTwoSpacing;
    }
    blockTranslateA += blockDimA[a] + loopOneSpacing;
  }

  // Overlay Grid
  if (cfg.isFloral) {
    let blockTranslateC = loopOneMargin + spacing / (loopOneCount * 2);

    for (let c = 0; c < loopOneCount; c++) {
      let blockTranslateD = loopTwoMargin + spacing / (loopTwoCount * 2);

      for (let d = 0; d < loopTwoCount; d++) {
        let blockW = cfg.isCascade ? blockDimA[c] : blockDimBClone[c][d];
        let blockH = cfg.isCascade ? blockDimBClone[c][d] : blockDimA[c];
        blockW = blockW - spacing;
        blockH = blockH - spacing;

        push();

        if (cfg.isCascade) {
          translate(blockTranslateC, blockTranslateD);
        } else {
          translate(blockTranslateD, blockTranslateC);
        }

        const flower = new Flower(
          blockW,
          blockH,
          cfg.palette,
          cfg.isNoisy,
          cfg.isCascade,
          cfg.isOverstitch,
          cfg.isGlitch,
          cfg.isFree
        );
        flower.show();

        rect(0, 0, blockW, blockH);

        pop();

        blockTranslateD += blockDimBClone[c][d] + loopTwoSpacing;
      }
      blockTranslateC += blockDimA[c] + loopOneSpacing;
    }
  }
};
