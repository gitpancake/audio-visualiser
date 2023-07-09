export const genTokenData = function (projectNum) {
  let data = {};

  const url = new URL(location);
  let hash = url.searchParams.get("hash") || "0x";

  if (hash !== "0x") {
    return {
      hash,
      tokenId: (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString(),
    };
  }

  for (var i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }

  data.hash = hash;
  data.tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString();

  url.searchParams.set("hash", data.hash);
  history.pushState({}, "", url);

  return data;
};
