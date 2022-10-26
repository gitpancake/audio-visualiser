import { palettes, bamPalette } from "./palettes";
import { Random } from "./random";
const R = new Random();

const isNdop = R.random_bool(0.2);
const isGlitch = isNdop ? false : R.random_bool(0.4);
const isOverstitch = isNdop || isGlitch ? false : R.random_bool(0.1);
const gridSize = {
  x: isNdop ? R.random_int(2, 8) : R.random_int(1, 12),
  y: isNdop ? R.random_int(2, 8) : R.random_int(1, 12),
};

const randMargin = R.random_int(5, 9) * 10;

const maxSize = 5;
const gridXLessThan = gridSize.x <= maxSize;
const gridYLessThan = gridSize.y <= maxSize;

const isNoisy = isNdop ? true : R.random_bool(0.5);


let rarities = {
  isCascade: R.random_bool(0.5),
  isOverstitch,
  isNdop,
  isGlitch,
  isNoisy,
  isFloral:
    isNdop || !gridXLessThan || !gridYLessThan ? false : R.random_bool(0.3),
};

export const config = {
  gridSize,
  gridMargin: {
    x: isGlitch ? randMargin : 40,
    y: isGlitch ? randMargin : 40,
  },
  canvasWidth: 900,
  canvasHeight: 1200,
  gridSpacing: R.random_choice([8, 12, 16, 20]),
  palette:
    isNdop && R.random_bool(0.9) ? bamPalette : R.random_choice(palettes),
  ...rarities,
};

console.table(config);
