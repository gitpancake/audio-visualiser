import { config } from "./config";
import { gridDivider } from "./helpers";
import { calculateFeatures } from "./meta";
import { Random, tokenData } from "./random";
import { Strokes } from "./shapes";
import { Rect } from "./shapes/rect";

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
  if (window.innerHeight > window.innerWidth) {
    createCanvas(window.innerWidth, scaledHeight);
  } else {
    createCanvas(scaledWidth, window.innerHeight);
  }

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

const blockDimA = gridDivider(loopOneDim / loopOneDiv, loopOneDim, loopOneCount, loopOneDim);

const generateBlocks = () => {
  let blocks = [];

  for (let a = 0; a < loopOneCount; a++) {
    const blockDimB = gridDivider(loopTwoDim / loopTwoDiv, loopTwoDim, loopTwoCount, loopTwoDim);

    blocks.push([]);

    for (let b = 0; b < loopTwoCount; b++) {
      let style;
      let blockW = cfg.isCascade ? blockDimA[a] : blockDimB[b];
      let blockH = cfg.isCascade ? blockDimB[b] : blockDimA[a];

      blockW = blockW - spacing;
      blockH = blockH - spacing;

      let pickStyle = R.random_int(2, 2);

      switch (pickStyle) {
        case 1:
          style = new Rect(blockW, blockH, cfg.palette);
          style.generate();

          break;

        case 2:
          style = new Strokes(blockW, blockH, cfg.palette);
          style.generate();

          break;
      }

      blocks[a].push({
        width: blockW,
        height: blockH,
        style,
      });
    }
  }
  return blocks;
};

const blocks = generateBlocks();

window.draw = () => {
  background(color(bg.r, bg.g, bg.b));
  const drawScale = width / cfg.canvasWidth;

  const drawBlocks = (blocks) => {
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

  drawBlocks(blocks);
};

window.windowResized = () => {
  const scaledHeight = window.innerWidth / scaleFactor;
  const scaledWidth = window.innerHeight * scaleFactor;

  if (window.innerHeight > window.innerWidth) {
    resizeCanvas(window.innerWidth, scaledHeight);
  } else {
    resizeCanvas(scaledWidth, window.innerHeight);
  }
};

calculateFeatures(tokenData);
