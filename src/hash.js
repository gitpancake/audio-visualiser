import { tokenData } from "./random";

export class Hash {
  initialize() {
    const url = new URL(location);
    url.searchParams.set("hash", tokenData.hash);
    history.pushState({}, "", url);
  }
}
