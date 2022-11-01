import { gridDivider, allAreTruthy } from "./helpers";
import { Random } from "./random";
import { Dots, Coils, Flower, Ndop, Scribbles } from "./shapes";
import { defaultPalette } from "./palettes";
import { config } from "./config";

const R = new Random();
const cfg = config;
const bg = cfg.palette.background;

const scaleFactor = cfg.canvasWidth / cfg.canvasHeight;
const scaledWidth = window.innerHeight * scaleFactor;
const gridWidth = cfg.canvasWidth - cfg.gridMargin.x * 2;
const gridHeight = cfg.canvasHeight - cfg.gridMargin.y * 2;

// Setup Canvas
window.setup = () => {
  createCanvas(scaledWidth, window.innerHeight);
  noLoop();
  noFill();
  noStroke();
};

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

const chosenOne = R.random_bool(0.5) ? cfg.isOverstitch : false;
const stitchOverideOne = cfg.isOverstitch ? chosenOne : false;
const stitchOverideTwo = cfg.isOverstitch ? !chosenOne : false;

let reRunLoop = cfg.isChaotic;
let flowerBlockVisible = [];

const blockDimA = gridDivider(
  loopOneDim / loopOneDiv,
  loopOneDim,
  loopOneCount,
  loopOneDim
);
let blockDimB = [];
let blockDrawOptions = [];

for (let a = 0; a < loopOneCount; a++) {
  const blockDim = gridDivider(
    loopTwoDim / loopTwoDiv,
    loopTwoDim,
    loopTwoCount,
    loopTwoDim
  );
  blockDimB.push(blockDim);
  flowerBlockVisible.push([]);
  blockDrawOptions.push([]);

  for (let b = 0; b < loopTwoCount; b++) {
    let blockW = cfg.isCascade ? blockDimA[a] : blockDimB[b];
    let blockH = cfg.isCascade ? blockDimB[b] : blockDimA[a];
    blockW = blockW - spacing;
    blockH = blockH - spacing;

    let designOption;
    let flowerVisible = false;

    const pickStyle = cfg.isNdop ? 4 : R.random_int(1, 3);

    switch (pickStyle) {
      case 1:
        flowerVisible = true;

        designOption = new Dots(
          blockW,
          blockH,
          cfg.palette,
          cfg.isNoisy,
          cfg.isCascade,
          cfg.isOverstitch,
          cfg.isGlitch
        );
        designOption.generate();
        console.log(designOption);

        break;

      case 2:
        designOption = new Scribbles(
          blockW,
          blockH,
          cfg.palette,
          cfg.isNoisy,
          cfg.isCascade,
          stitchOverideTwo,
          reRunLoop ? false : cfg.isGlitch
        );
        designOption.generate();
        console.log(designOption);

        break;

      case 3:
        designOption = new Coils(
          blockW,
          blockH,
          cfg.palette,
          cfg.isNoisy,
          cfg.isCascade,
          stitchOverideOne,
          reRunLoop ? false : cfg.isGlitch
        );
        designOption.generate();
        console.log(designOption);

        break;
      default:
        designOption = new Ndop(
          blockW,
          blockH,
          reRunLoop ? defaultPalette : cfg.palette,
          cfg.isNoisy,
          cfg.isCascade,
          cfg.isOverstitch,
          cfg.isGlitch
        );
        designOption.generate();
        console.log(designOption);

        break;
    }

    flowerBlockVisible[a].push(flowerVisible);
    blockDrawOptions[a].push(designOption);
  }
}

console.log(blockDrawOptions);

window.draw = () => {
  background(color(bg.r, bg.g, bg.b));

  const drawScale = width / cfg.canvasWidth;

  let blockTranslateA =
    loopOneMargin + (spacing / (loopOneCount * 2)) * drawScale;

  for (let a = 0; a < loopOneCount; a++) {
    let blockTranslateB =
      loopTwoMargin + (spacing / (loopTwoCount * 2)) * drawScale;

    for (let b = 0; b < loopTwoCount; b++) {
      push();

      if (cfg.isCascade) {
        translate(blockTranslateA * drawScale, blockTranslateB * drawScale);
      } else {
        translate(blockTranslateB * drawScale, blockTranslateA * drawScale);
      }

      // SHAPE LOGIC - HERE
      // stroke(255);
      // const blockW = blockDrawOptions[a][b].width* drawScale;
      // const blockH = blockDrawOptions[a][b].height* drawScale;
      // rect(0, 0, blockW, blockH);

      blockDrawOptions[a][b].show(drawScale);

      pop();

      blockTranslateB += blockDimB[a][b] + loopTwoSpacing;

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
  if (false) {
    if (!allAreTruthy(flowerBlockVisible)) {
      const rowIndex = R.random_int(0, flowerBlockVisible.length - 1);
      const rndIndex = R.random_int(0, flowerBlockVisible[rowIndex].length - 1);
      flowerBlockVisible[rowIndex][rndIndex] = true;
    }

    let blockTranslateC = loopOneMargin + spacing / (loopOneCount * 2);

    for (let c = 0; c < loopOneCount; c++) {
      let blockTranslateD = loopTwoMargin + spacing / (loopTwoCount * 2);

      for (let d = 0; d < loopTwoCount; d++) {
        let blockW = cfg.isCascade ? blockDimA[c] : blockDimB[c][d];
        let blockH = cfg.isCascade ? blockDimB[c][d] : blockDimA[c];
        blockW = (blockW - spacing) * drawScale;
        blockH = (blockH - spacing) * drawScale;

        push();

        if (cfg.isCascade) {
          translate(blockTranslateC * drawScale, blockTranslateD * drawScale);
        } else {
          translate(blockTranslateD * drawScale, blockTranslateC * drawScale);
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

        blockTranslateD += blockDimB[c][d] + loopTwoSpacing;
      }
      blockTranslateC += blockDimA[c] + loopOneSpacing;
    }
  }
};

window.windowResized = () => {
  const scaledWidth = window.innerHeight * scaleFactor;
  resizeCanvas(scaledWidth, window.innerHeight);
};
