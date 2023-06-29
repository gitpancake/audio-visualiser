import { palettes } from "./palettes";
import { Random } from "./random";
const R = new Random();

const palette = R.random_choice(palettes);

const isOverstitch = R.random_bool(0.25);

const gridSize = {
  x: R.random_int(38, 40),
  y: R.random_int(45, 50),
};

const isNoisy = R.random_bool(0.4);

let rarities = {
  isOverstitch,
  isNoisy,
  palette,
};

export const config = {
  gridSize,
  gridMargin: {
    x: 10,
    y: 10,
  },
  isCascade: R.random_bool(0.5),
  canvasWidth: 900 * 1.2,
  canvasHeight: 1200 * 1.2,
  gridSpacing: -15, // R.random_choice([8, 12, 16, 20]),
  ...rarities,
};
