import { gridDivider, allAreTruthy } from "./helpers";
import { Random } from "./random";
const R = new Random();
import { Bamileke, Coils, Flower, Scribbles } from "./shapes";
import { Motif } from "./shapes/motif";
import { defaultPalette } from "./palettes";
import { config } from "./config";
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
};

window.draw = () => {
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
  let flowerBlockVisible = [];

  const chosenOne = R.random_bool(0.5) ? cfg.isOverstitch : false;
  const stitchOverideOne = cfg.isOverstitch ? chosenOne : false;
  const stitchOverideTwo = cfg.isOverstitch ? !chosenOne : false;
  let blockTranslateA = loopOneMargin + spacing / (loopOneCount * 2);
  let reRunLoop = cfg.isChaotic;

  for (let a = 0; a < loopOneCount; a++) {
    let blockTranslateB = loopTwoMargin + spacing / (loopTwoCount * 2);

    const blockDimB = gridDivider(
      loopTwoDim / loopTwoDiv,
      loopTwoDim,
      loopTwoCount,
      loopTwoDim
    );

    blockDimBClone.push(blockDimB);
    flowerBlockVisible.push([]);

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

      const motif = new Motif(
        blockW,
        blockH,
        cfg.palette,
        cfg.isNoisy,
        cfg.isCascade,
        cfg.isOverstitch,
        cfg.isGlitch
      );

      if (cfg.isNdop) {
        motif.show();
        const bamileke = new Bamileke(
          blockW,
          blockH,
          reRunLoop ? defaultPalette : cfg.palette,
          cfg.isNoisy,
          cfg.isCascade,
          cfg.isOverstitch,
          cfg.isGlitch
        );
        bamileke.show();
      } else {
        let flowerVisible = false;

        if (R.random_bool(0.4)) {
          const coils = new Coils(
            blockW,
            blockH,
            cfg.palette,
            cfg.isNoisy,
            cfg.isCascade,
            stitchOverideOne,
            reRunLoop ? false : cfg.isGlitch
          );
          coils.show();
        } else if (R.random_bool(0.6)) {
          const scribbles = new Scribbles(
            blockW,
            blockH,
            cfg.palette,
            cfg.isNoisy,
            cfg.isCascade,
            stitchOverideTwo,
            reRunLoop ? false : cfg.isGlitch
          );
          scribbles.show();
        } else {
          motif.show();
          flowerVisible = true;
        }

        flowerBlockVisible[a].push(flowerVisible);
      }

      // rect(0, 0, blockW, blockH);
      pop();

      blockTranslateB += blockDimB[b] + loopTwoSpacing;

      if (
        a == loopOneCount - 1 &&
        b == loopTwoCount - 1 &&
        cfg.isChaotic &&
        reRunLoop
      ) {
        a = 0;
        b = 0;
        blockTranslateA = loopOneMargin + spacing / (loopOneCount * 2);
        blockTranslateB = loopTwoMargin + spacing / (loopTwoCount * 2);
        reRunLoop = false;
      }
    }
    blockTranslateA += blockDimA[a] + loopOneSpacing;
  }

  // Overlay Grid
  if (cfg.isFloral) {
    if (!allAreTruthy(flowerBlockVisible)) {
      const rowIndex = R.random_int(0, flowerBlockVisible.length - 1);
      const rndIndex = R.random_int(0, flowerBlockVisible[rowIndex].length - 1);
      flowerBlockVisible[rowIndex][rndIndex] = true;
    }

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

        if (flowerBlockVisible[c][d]) {
          const flower = new Flower(
            blockW,
            blockH,
            cfg.palette,
            cfg.isNoisy,
            cfg.isCascade,
            cfg.isOverstitch,
            cfg.isGlitch
          );

          flower.show();
        }

        pop();

        blockTranslateD += blockDimBClone[c][d] + loopTwoSpacing;
      }
      blockTranslateC += blockDimA[c] + loopOneSpacing;
    }
  }
};