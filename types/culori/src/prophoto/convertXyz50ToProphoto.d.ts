import { Xyz50 } from "../xyz50/types.js";
import { Prophoto } from "./types.js";

declare function convertXyz50ToProphoto(color: Omit<Xyz50, "mode">): Prophoto;

export default convertXyz50ToProphoto;
