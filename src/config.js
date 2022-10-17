import { palettes, bamPalette } from "./palettes";
import { Random } from "./random";
const R = new Random();

const isBamileke = R.random_bool(.1)
const isFree = isBamileke ? false : R.random_bool(.25);
const isOverstitch = isFree || isBamileke ? false : R.random_bool(0.5);

let rarities = {
  isCascade: R.random_bool(0.5),
  isFree,
  isOverstitch,
  isBamileke,
  isGlitch: isBamileke ? false : R.random_bool(0.5),
  isNoisy: isFree || isBamileke ? true : R.random_bool(0.5),
  isFloral: isFree || isOverstitch || isBamileke ? false : R.random_bool(0.5),
};

export const config = {
  canvasWidth: 900,
  canvasHeight: 1200,
  gridMargin: {
    x: isFree ? 40 : 40,
    y: isFree ? 40 : 40,
  },
  gridSize: {
    x: R.random_int(1, 15),
    y: R.random_int(2, 15),
  },
  gridSpacing: R.random_choice([4, 8, 16, 32]),
  palette: isBamileke ? bamPalette : R.random_choice(palettes),
  ...rarities,
};

console.table(config);

export const calculateFeatures = (tokenData) => {
  const features = {};
  features["Grid Dimensions"] = `${config.gridSize.x} x ${config.gridSize.y}`;
  features["Line Width"] = 10;
  features["Canvas Height"] = config.canvasHeight;
  features["Canvas Width"] = config.canvasWidth;
  features["Palette"] = config.palette.name;

  return features;
};
