import { palettes } from "./palettes";
import { Random } from "./random";
const R = new Random();

export const config = {
  canvasWidth: 900,
  canvasHeight: 1200,
  gridMargin: {
    x: 50,
    y: 50,
  },
  gridSize: {
    x: R.random_int(1,10),
    y: R.random_int(1,10)
  },
  gridSpacing: 100,//R.random_choice([0,20,40,60,80,100]),
  palette: R.random_choice(palettes),
  noisey: R.random_bool(0.5)
};

console.log(config)

export const calculateFeatures = (tokenData) => {
  const features = {};
  //   features["Grid Dimensions"] = `${gridSizeX} x ${gridSizeY}`;
  //   features["Line Width"] = 10;
  features["Canvas Height"] = config.canvasHeight;
  features["Canvas Width"] = config.canvasWidth;
  features["Palette"] = config.palette.name;

  return features;
};
