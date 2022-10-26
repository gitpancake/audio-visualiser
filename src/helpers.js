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

export const reduceDenominator = (numerator, denominator) => {
  function rec(a, b) {
    return b ? rec(b, a % b) : a;
  }
  return denominator / rec(numerator, denominator);
};

export const debugGrid = (spacer = 50, s = 10, sw = 2, noisey = true) => {
  // Debug Grid
  let div = spacer;
  stroke(s);
  strokeWeight(sw);
  for (let col = 1; col < width / div; col++) {
    for (let row = 1; row < height / div; row++) {
      const noiseX = noisey ? R.random_dec() * 10 : 0;
      const noiseY = noisey ? R.random_dec() * 10 : 0;
      const x = col * div + noiseX;
      const y = row * div + noiseY;
      point(x, y);
    }
  }
};

export const normalise = (val, max, min) => {
  return (val - min) / (max - min);
};

// Rescue function to draw rose in random array
export const allAreTruthy = (arr) => {
  // console.log("hit");
  let res = [];
  arr.forEach((e) => {
    res.push(e.find((element) => element === true));
  });
  // console.log(res);
  return res.find((element) => element === true);
};
