import { palettes } from "./palettes";
import { Random } from "./random";
const R = new Random();

export const config = {
  canvasWidth: 900,
  canvasHeight: 1200,
  gridMargin: {
    x: 40,
    y: 40,
  },
  gridSize: {
    x: R.random_int(1,8),
    y: R.random_int(2,10)
  },
  gridSpacing: R.random_choice([8, 16, 32]),
  palette: R.random_choice(palettes),
  isNoisey: R.random_bool(0.5),
  isCascade: true, //R.random_bool(0.5)
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
