import { tokenData } from "./random";
import { config, calculateFeatures } from "./config";
import { gridDivider } from "./helpers";

console.log();

// Setup Canvas
window.setup = () => {
  createCanvas(config.canvasWidth, config.canvasHeight);
  noLoop();
  noFill();
  noStroke();
  const bg = config.palette.background;
  background(color(bg.r, bg.g, bg.b));
};

const gridWidth = config.canvasWidth - config.gridMargin.x * 2;
const gridHeight = config.canvasHeight - config.gridMargin.y * 2;
console.table({ gridWidth, gridHeight });

// console.table({ blockSizesX, blockSizesY });

window.draw = () => {
  stroke(255);

  const blockSizesY = gridDivider(
    gridHeight / 10,
    gridHeight,
    config.gridSize.y,
    gridHeight
  );

  let blockTranslateY = config.gridMargin.y;

  for (let y = 0; y < config.gridSize.y; y++) {

    let blockTranslateX = config.gridMargin.x;

    const blockSizesX = gridDivider(
      gridWidth / 10,
      gridWidth,
      config.gridSize.x,
      gridWidth
    );

    for (let x = 0; x < config.gridSize.x; x++) {

      push();

      translate(blockTranslateX, blockTranslateY);

      rect(0, 0, blockSizesX[x], blockSizesY[y]);

    blockTranslateX += blockSizesX[x];

      pop();
    }
    blockTranslateY += blockSizesY[y];

  }
};
