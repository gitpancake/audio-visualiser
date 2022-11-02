import { palettes, ndopPalette } from "./palettes";
import { Random } from "./random";
const R = new Random();

const isNdop = R.random_bool(0.1);
const palette =
  isNdop && R.random_bool(0.7) ? ndopPalette : R.random_choice(palettes);
const isNdopPalette = palette == ndopPalette;
const isChaotic = isNdopPalette ? false : R.random_bool(.6);
const isGlitch = isNdop ? false : R.random_bool(0.4);
const isOverstitch =
  isNdop || isGlitch || isChaotic ? false : R.random_bool(0.25);
const gridSize = {
  x: isNdop ? R.random_int(4, 10) : R.random_int(1, 14),
  y: isNdop ? R.random_int(4, 10) : R.random_int(1, 14),
};

const maxSize = 7;
const gridXLessThan = gridSize.x <= maxSize;
const gridYLessThan = gridSize.y <= maxSize;
const randMargin = R.random_int(4, 9) * 10;
const isNoisy = isNdop ? true : R.random_bool(0.8);

let rarities = {
  isOverstitch,
  isNdop,
  isGlitch,
  isNoisy,
  isChaotic,
  palette,
  isFloral:
    isNdop || !gridXLessThan || !gridYLessThan ? false : R.random_bool(.4),
};

export const config = {
  gridSize,
  gridMargin: {
    x: isGlitch ? randMargin : 40,
    y: isGlitch ? randMargin : 40,
  },
  isCascade: R.random_bool(0.5),
  canvasWidth: 900*1.2,
  canvasHeight: 1200*1.2,
  gridSpacing: R.random_choice([8, 12, 16, 20]),
  ...rarities,
};

console.table(config);