import { palettes } from "./palettes";
import { Random } from "./random";
const R = new Random();

const isFreeform = R.random_bool(0.5);
const isOverstitch = isFreeform ? false : R.random_bool(0.5);

let rarities = {
  isNoisy: isFreeform ? true : R.random_bool(0.5),
  isCascade: R.random_bool(0.5),
  isGlitch: isFreeform ? false : R.random_bool(0.2),
  isFreeform,
  isOverstitch,
  isFloral: isFreeform || isOverstitch ? false : R.random_bool(0.9)
}

export const config = {
  canvasWidth: 900,
  canvasHeight: 1200,
  gridMargin: {
    x: isFreeform ? 0 : 40,
    y: isFreeform ? 0 : 40,
  },
  gridSize: {
    x: R.random_int(1,10),
    y: R.random_int(1,10)
  },
  gridSpacing: R.random_choice([8, 16, 32]),
  palette: R.random_choice(palettes),
  ...rarities
};

console.table(config);

export const calculateFeatures = (tokenData) => {
  const features = {};
  //   features["Grid Dimensions"] = `${gridSizeX} x ${gridSizeY}`;
  //   features["Line Width"] = 10;
  features["Canvas Height"] = config.canvasHeight;
  features["Canvas Width"] = config.canvasWidth;
  features["Palette"] = config.palette.name;

  return features;
};
