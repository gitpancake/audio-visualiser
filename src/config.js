import { palettes, ndopPalette } from "./palettes";
import { Random } from "./random";
const R = new Random();

const isNdop = R.random_bool(0.1);
const palette =
  isNdop && R.random_bool(0.7) ? ndopPalette : R.random_choice(palettes);
const isNdopPalette = palette == ndopPalette;
const isChaotic = isNdopPalette ? false : R.random_bool(.6);
const isGlitch = isNdop ? false : R.random_bool(0.6);
const isOverstitch =
  isNdop || isGlitch || isChaotic ? false : R.random_bool(0.2);
const gridSize = {
  x: isNdop ? R.random_int(2, 10) : R.random_int(1, 15),
  y: isNdop ? R.random_int(2, 10) : R.random_int(1, 15),
};

const maxSize = 5;
const gridXLessThan = gridSize.x <= maxSize;
const gridYLessThan = gridSize.y <= maxSize;
const randMargin = R.random_int(5, 9) * 10;
const isNoisy = isNdop || isChaotic ? true : R.random_bool(0.5);

let rarities = {
  isOverstitch,
  isNdop,
  isGlitch,
  isNoisy,
  isChaotic,
  palette,
  isFloral:
    isNdop || !gridXLessThan || !gridYLessThan ? false : R.random_bool(0.3),
};

export const config = {
  gridSize,
  gridMargin: {
    x: isGlitch ? randMargin : 40,
    y: isGlitch ? randMargin : 40,
  },
  isCascade: R.random_bool(0.5),
  canvasWidth: 900,
  canvasHeight: 1200,
  gridSpacing: R.random_choice([8, 12, 16, 20]),
  ...rarities,
};

console.table(config);
