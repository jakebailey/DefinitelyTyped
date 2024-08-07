import Critters from "critters-webpack-plugin";
import { Configuration } from "webpack";

const critters: Configuration["plugins"] = [
    new Critters({
        compress: true,
        external: true,
        inlineFonts: false,
        preloadFonts: true,
        keyframes: "critical",
        noscriptFallback: true,
        inlineThreshold: 0,
        mergeStylesheets: true,
        additionalStylesheets: ["./base.css"],
        pruneSource: true,
        minimumExternalSize: 0,
    }),
];
