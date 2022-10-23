import { genTokenData } from "./token";
export const tokenData = genTokenData(17);
// export const tokenData = {
//   "hash": "0x420f6be7ab91c8118ee51517a66704d827fca47e143f15fe6f04ae51f0873e65",
//   "tokenId": "13000725"
// }

// export const tokenData = {
//   "hash": "0xf383c4b6250fedbd36a399fce4c9c1f894ffbbbb67084d8fc807daad6d86c7e4",
//   "tokenId": "13000789"
// }

// export const tokenData = {
//   "hash": "0xe6709c52042889eee8fee0cc7f2fff2cc878219e6ffc4c96aef088eedd4b887b",
//   "tokenId": "13000703"
// }

// export const tokenData = {
//   hash: "0xe42caa6164393171715835a3f556238c686754d6f639b3115f7f2153fb212496",
//   tokenId: "13000400",
// };

// export const tokenData = {
//   hash: "0x11ac492f4350df73599eaf4ee9da8fdc0a68821d847a412de9c2b48ba4b0ee6f",
//   tokenId: "13000818",
// };

// export const tokenData = {
//   hash: "0xa3f972218ce61d61ab4d441e6f98b30c075ab7aefdfa18936babfc058ef62b18",
//   tokenId: "13000166",
// };
console.log(tokenData);

export class Random {
  constructor() {
    this.useA = false;
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16);
      let b = parseInt(uint128Hex.substr(8, 8), 16);
      let c = parseInt(uint128Hex.substr(16, 8), 16);
      let d = parseInt(uint128Hex.substr(24, 8), 16);
      return function () {
        a |= 0;
        b |= 0;
        c |= 0;
        d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
      };
    };
    // seed prngA with first half of tokenData.hash
    this.prngA = new sfc32(tokenData.hash.substr(2, 32));
    // seed prngB with second half of tokenData.hash
    this.prngB = new sfc32(tokenData.hash.substr(34, 32));
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA();
      this.prngB();
    }
  }
  // random number between 0 (inclusive) and 1 (exclusive)
  random_dec() {
    this.useA = !this.useA;
    return this.useA ? this.prngA() : this.prngB();
  }
  // random number between a (inclusive) and b (exclusive)
  random_num(a, b) {
    return a + (b - a) * this.random_dec();
  }
  // random integer between a (inclusive) and b (inclusive)
  // requires a < b for proper probability distribution
  random_int(a, b) {
    return Math.floor(this.random_num(a, b + 1));
  }
  // random boolean with p as percent liklihood of true
  random_bool(p) {
    return this.random_dec() < p;
  }
  // random value in an array of items
  random_choice(list) {
    return list[this.random_int(0, list.length - 1)];
  }
}
