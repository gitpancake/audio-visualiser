import { Random } from "./random";
const R = new Random();

/**
 * Grid Divider
 * @constructor
 * @param {number} min min block size
 * @param {number} max max block size
 * @param {number} amount amount of blocks
 * @param {number} sum total sum of blocks
 * Credit - https://stackoverflow.com/a/50405632/2126900
*/
export const gridDivider = (min, max, length, sum) => {
    return Array.from(
        { length },
        (_, i) => {
            var smin = (length - i - 1) * min,
                smax = (length - i - 1) * max,
                offset = Math.max(sum - smax, min),
                random = 1 + Math.min(sum - offset, max - offset, sum - smin - min),
                value = Math.floor(R.random_dec() * random + offset);

            sum -= value;
            return value;
        }
    );
};


// R.random_dec()