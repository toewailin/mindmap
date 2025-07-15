// src/utils/MarkmapLoader.ts
import { loadCSS, loadJS } from "markmap-common";
import { Transformer } from "markmap-lib";
import * as markmap from "markmap-view";

// Instantiate the transformer here if you need a singleton instance
// that manages assets.
export const markmapTransformer = new Transformer();

let assetsLoaded = false;

export const ensureMarkmapAssetsLoaded = () => {
  if (!assetsLoaded) {
    const { scripts, styles } = markmapTransformer.getAssets();

    // --- FIX START ---
    // Check if styles is defined before loading, or provide an empty array
    if (styles) {
      loadCSS(styles);
    } else {
      console.warn("Markmap styles are undefined. No CSS assets loaded.");
    }

    // Check if scripts is defined before loading, or provide an empty array
    if (scripts) {
      loadJS(scripts, { getMarkmap: () => markmap });
    } else {
      console.warn("Markmap scripts are undefined. No JS assets loaded.");
    }
    // --- FIX END ---

    assetsLoaded = true;
    console.log("Markmap assets loading initiated."); // Changed log to reflect async nature
  }
};

// You might also want to export the markmap-view library itself if you need it globally
export { markmap };
