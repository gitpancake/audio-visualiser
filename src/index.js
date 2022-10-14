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

window.draw = () => {
  stroke(255);

  //   const blockSizesY = gridDivider(
  //     gridHeight / 10,
  //     gridHeight,
  //     config.gridSize.y,
  //     gridHeight
  //   );

  //   let blockTranslateY = config.gridMargin.y;

  //   for (let y = 0; y < config.gridSize.y; y++) {
  //     let blockTranslateX = config.gridMargin.x;

  //     const blockSizesX = gridDivider(
  //       gridWidth / 10,
  //       gridWidth,
  //       config.gridSize.x,
  //       gridWidth
  //     );

  //     for (let x = 0; x < config.gridSize.x; x++) {
  //       push();

  //       translate(blockTranslateX, blockTranslateY);

  //       rect(0, 0, blockSizesX[x], blockSizesY[y]);

  //       blockTranslateX += blockSizesX[x];

  //       pop();
  //     }
  //     blockTranslateY += blockSizesY[y];
  //   }

  const blockSizesX = gridDivider(
    gridWidth / 10,
    gridWidth,
    config.gridSize.x,
    gridWidth
  );

  let blockTranslateX = config.gridMargin.x;

  for (let x = 0; x < config.gridSize.x; x++) {

    let blockTranslateY = config.gridMargin.y;

    const blockSizesY = gridDivider(
      gridHeight / 10,
      gridHeight,
      config.gridSize.y,
      gridHeight
    );

    for (let y = 0; y < config.gridSize.y; y++) {

      push();

      translate(blockTranslateX, blockTranslateY);

      rect(0, 0, blockSizesX[x], blockSizesY[y]);

      blockTranslateY += blockSizesY[y];
      pop();

    }

    blockTranslateX += blockSizesX[x];
    
  }

};
