import { palettes } from "./palettes";
import { Random, tokenData } from "./random";
console.log(tokenData)

const R = new Random();

export const config = {
  canvasWidth: 900,
  canvasHeight: 1200,
  gridMargin: {
    x: 50,
    y: 50
  },
  palette: R.random_choice(palettes),
};

export const calculateFeatures = (tokenData) => {
  const features = {};
  //   features["Grid Dimensions"] = `${gridSizeX} x ${gridSizeY}`;
  //   features["Line Width"] = 10;
  features["Canvas Height"] = config.canvasHeight;
  features["Canvas Width"] = config.canvasWidth;
  features["Palette"] = config.palette.name;

  return features;
};
