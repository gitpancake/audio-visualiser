import { palettes, bamPalette } from "./palettes";
import { Random } from "./random";
const R = new Random();

const isBamileke = R.random_bool(0.3);
const isFree = isBamileke ? false : R.random_bool(0.25);
const isOverstitch = isBamileke || isFree ? false : R.random_bool(.2);

const gridSize = {
  x: R.random_int(1, 15),
  y: R.random_int(2, 15),
};

const maxSize = 4;
const gridXLessThan = gridSize.x <= maxSize;
const gridYLessThan = gridSize.y <= maxSize;

let rarities = {
  isCascade: R.random_bool(0.6),
  isFree,
  isOverstitch,
  isBamileke,
  isGlitch: isBamileke ? false : R.random_bool(0.25),
  isNoisy: isBamileke || isFree ? true : R.random_bool(0.8),
  isFloral:
    isBamileke || !gridXLessThan || !gridYLessThan ? false : R.random_bool(.25),
};

export const config = {
  gridSize,
  gridMargin: {
    x: 40,
    y: 40,
  },
  canvasWidth: 900,
  canvasHeight: 1200,
  gridSpacing: R.random_choice([8, 12, 16, 20]),
  palette:
    isBamileke && R.random_bool(0.4) ? bamPalette : R.random_choice(palettes),
  ...rarities,
};

console.table(config);
