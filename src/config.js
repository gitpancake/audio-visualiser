import { palettes, bamPalette } from "./palettes";
import { Random } from "./random";
const R = new Random();

const isBamileke = R.random_bool(0.1);
const isFree = isBamileke ? false : R.random_bool(.25);
const isOverstitch = isFree || isBamileke ? false : R.random_bool(0.25);

let rarities = {
  isCascade: R.random_bool(0.25),
  isFree,
  isOverstitch,
  isBamileke,
  isGlitch: isBamileke ? false : R.random_bool(0.25),
  isNoisy: isFree || isBamileke ? true : R.random_bool(0.25),
  isFloral: isFree || isOverstitch || isBamileke ? false : R.random_bool(5),
};

export const config = {
  canvasWidth: 900,
  canvasHeight: 1200,
  gridMargin: {
    x: 40,
    y: 40,
  },
  gridSize: {
    x: 4,//R.random_int(2, 20),
    y: 4//R.random_int(2, 20),
  },
  gridSpacing: R.random_choice([4, 8, 12, 16, 20]),
  palette: isBamileke && R.random_bool(0.4) ? bamPalette : R.random_choice(palettes),
  ...rarities,
};

console.table(config);