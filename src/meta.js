import { tokenData } from "./random";
import { config } from "./config";

export const calculateFeatures = (tokenData) => {
  const features = {};
  features["Palette"] = config.palette.name;
  features["Bamileke Style"] = config.isBamileke;
  features["Grid Style"] = config.isCascade ? "Waterfall" : "Normal";
  features["Grid Dimensions"] = `${config.gridSize.x} x ${config.gridSize.y}`;
  features["Grid Spacing"] = config.gridSpacing;
  features["Freedom Of Expression"] = config.isFree;
  features["Glitch"] = config.isGlitch;
  features["Overstitch"] = config.isOverstitch;

//   features["Canvas Height"] = config.canvasHeight;
//   features["Canvas Width"] = config.canvasWidth;

  console.table(features)
  return features;
};