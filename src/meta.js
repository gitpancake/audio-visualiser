import { tokenData } from "./random";
import { config } from "./config";

export const calculateFeatures = (tokenData) => {
  const features = {};
  features["Style Inspiration"] = config.isNdop ? "Ndop" : "Atoghu";
  features["Palette"] = config.palette.name;
  features["Grid Style"] = config.isCascade ? "Waterfall" : "Normal";
  features["Draw Style"] = config.isNoisy? "Dirty" : "Clean";
  features["Grid Dimensions"] = `${config.gridSize.x} x ${config.gridSize.y}`;
  features["Grid Spacing"] = config.gridSpacing;
  features["Overstitch"] = config.isOverstitch;
  features["Gemini Tendecies"] = config.isGlitch;
  features["Choatic Vibes"] = config.isChaotic;
  features["Floral"] = config.isFloral;

  console.table(features)
  return features;
};