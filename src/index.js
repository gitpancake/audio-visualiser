import { gridDivider, allAreTruthy } from "./helpers";
import { Random, tokenData } from "./random";
import { Dots, Coils, Flower, Ndop, Scribbles } from "./shapes";
import { defaultPalette } from "./palettes";
import { config } from "./config";
import { calculateFeatures } from "./meta";

const R = new Random();
const cfg = config;
const bg = cfg.palette.background;

const scaleFactor = cfg.canvasWidth / cfg.canvasHeight;
const scaledWidth = window.innerHeight * scaleFactor;
const scaledHeight = window.innerWidth / scaleFactor;

const gridWidth = cfg.canvasWidth - cfg.gridMargin.x * 2;
const gridHeight = cfg.canvasHeight - cfg.gridMargin.y * 2;

// Setup Canvas
window.setup = () => {
  // createCanvas(scaledWidth, window.innerHeight);
  createCanvas(window.innerWidth, scaledHeight);

  noLoop();
  noFill();
  noStroke();
};

const spacing = cfg.gridSpacing;
const loopOneCount = cfg.isCascade ? cfg.gridSize.x : cfg.gridSize.y;
const loopOneDiv = loopOneCount * 2;
const loopOneDim = cfg.isCascade ? gridWidth : gridHeight;
const loopTwoCount = cfg.isCascade ? cfg.gridSize.y : cfg.gridSize.x;
const loopTwoDiv = loopTwoCount * 2;
const loopTwoDim = cfg.isCascade ? gridHeight : gridWidth;

const blockDimA = gridDivider(
  loopOneDim / loopOneDiv,
  loopOneDim,
  loopOneCount,
  loopOneDim
);

const generateBlocks = (isChaotic = false) => {
  let blocks = [];
  const chosenOne = R.random_bool(0.5) ? cfg.isOverstitch : false;
  const stitchOverideOne = cfg.isOverstitch ? chosenOne : false;
  const stitchOverideTwo = cfg.isOverstitch ? !chosenOne : false;
  for (let a = 0; a < loopOneCount; a++) {
    const blockDimB = gridDivider(
      loopTwoDim / loopTwoDiv,
      loopTwoDim,
      loopTwoCount,
      loopTwoDim
    );

    blocks.push([]);

    for (let b = 0; b < loopTwoCount; b++) {
      let flowerVisible = false;
      let style;
      let blockW = cfg.isCascade ? blockDimA[a] : blockDimB[b];
      let blockH = cfg.isCascade ? blockDimB[b] : blockDimA[a];
      blockW = blockW - spacing;
      blockH = blockH - spacing;

      const max = cfg.isFloral ? 4 : 3;
      const pickStyle = cfg.isNdop ? 5 : R.random_int(1, max);

      switch (pickStyle) {
        case 1:
          flowerVisible = true;
          style = new Dots(
            blockW,
            blockH,
            cfg.palette,
            cfg.isNoisy,
            cfg.isCascade,
            cfg.isOverstitch,
            cfg.isGlitch
          );
          style.generate();

          break;

        case 2:
          style = new Scribbles(
            blockW,
            blockH,
            cfg.palette,
            cfg.isNoisy,
            cfg.isCascade,
            stitchOverideTwo,
            isChaotic ? false : cfg.isGlitch
          );
          style.generate();

          break;

        case 3:
          style = new Coils(
            blockW,
            blockH,
            cfg.palette,
            cfg.isNoisy,
            cfg.isCascade,
            stitchOverideOne,
            isChaotic ? false : cfg.isGlitch
          );
          style.generate();

          break;
        case 4:
          style = new Flower(
            blockW,
            blockH,
            cfg.palette,
            cfg.isNoisy,
            cfg.isCascade,
            stitchOverideOne,
            isChaotic ? false : cfg.isGlitch
          );
          style.generate();

          break;
        default:
          style = new Ndop(
            blockW,
            blockH,
            isChaotic ? defaultPalette : cfg.palette,
            cfg.isNoisy,
            cfg.isCascade,
            cfg.isOverstitch,
            cfg.isGlitch
          );
          style.generate();

          break;
      }

      blocks[a].push({
        width: blockW,
        height: blockH,
        style,
        flowerVisible,
      });
    }
  }
  return blocks;
};

const blocks = generateBlocks();
let blocksChaotic;
if (cfg.isChaotic) {
  blocksChaotic = generateBlocks(true);
}

window.draw = () => {
  background(color(bg.r, bg.g, bg.b));
  const drawScale = width / cfg.canvasWidth;
  const drawBlocks = (blocks, floralOnly = false) => {
    const scaledSpacing = cfg.gridSpacing * drawScale;
    let translateY = cfg.gridMargin.y * drawScale;
    for (let i = 0; i < blocks.length; i++) {
      let translateX = cfg.gridMargin.x * drawScale;
      for (let j = 0; j < blocks[i].length; j++) {
        push();

        if (cfg.isCascade) {
          translate(translateY, translateX);
        } else {
          translate(translateX, translateY);
        }

        const block = blocks[i][j];
        block.style.show(drawScale);

        if (cfg.isCascade) {
          translateX += blocks[i][j].height * drawScale + scaledSpacing;
        } else {
          translateX += blocks[i][j].width * drawScale + scaledSpacing;
        }

        pop();
      }
      if (cfg.isCascade) {
        translateY += blocks[i][0].width * drawScale + scaledSpacing;
      } else {
        translateY += blocks[i][0].height * drawScale + scaledSpacing;
      }
    }
  };
  if (cfg.isChaotic) {
    drawBlocks(blocksChaotic);
  }
  drawBlocks(blocks);
};

window.windowResized = () => {
  const scaledHeight = window.innerWidth / scaleFactor;
  resizeCanvas(window.innerWidth, scaledHeight);
};

calculateFeatures(tokenData)