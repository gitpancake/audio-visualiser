import { defaultPalette } from "./palettes";
import { Random } from "./random";
const R = new Random();

/**
 * Grid Divider
 ** https://stackoverflow.com/a/50405632/2126900
 * @param {number} min min block size
 * @param {number} max max block size
 * @param {number} amount amount of blocks
 * @param {number} sum total sum of blocks
 */
export const gridDivider = (min, max, amt, sum) => {
  return shuffle(
    Array.from({ length: amt }, (_, i) => {
      var smin = (amt - i - 1) * min,
        smax = (amt - i - 1) * max,
        offset = Math.max(sum - smax, min),
        random = 1 + Math.min(sum - offset, max - offset, sum - smin - min),
        value = Math.floor(R.random_dec() * random + offset);

      sum -= value;
      return value;
    })
  );
};

/**
 * Array Shuffler
 * @param {Array} a array to shuffle
 */
export const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(R.random_dec() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const pickRndColor = (palette = defaultPalette) => {
  return R.random_choice(palette.colors);
};
