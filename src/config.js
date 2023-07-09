import { palettes } from "./palettes";
import { Random } from "./random";
const R = new Random();

const palette = R.random_choice(palettes);

export const config = {
  palette,
};
