import { tokenData } from "./random";
import { config } from "./config";

export const calculateFeatures = (tokenData) => {
  const features = {};
  features["inspiration"] = config.isNdop ? "Ndop" : "Atoghu";
  features["palette"] = config.palette.name;
  features["grid ftyle"] = config.isCascade ? "Waterfall" : "Normal";
  features["sraw style"] = config.isNoisy? "Dirty" : "Clean";
  features["grid dimensions"] = `${config.gridSize.x} x ${config.gridSize.y}`;
  features["grid spacing"] = config.gridSpacing;
  features["overstitch"] = config.isOverstitch;
  features["glitch"] = config.isGlitch;
  features["erratic tendencies"] = config.isChaotic;
  features["floral"] = config.isFloral;

  console.table(features)
  return features;
};