import { default as baseU } from "./utilities.js";
import { getTemplatePath } from "./templates.js";
<<<<<<< Updated upstream
export const U = { ...baseU, getTemplatePath };
export { default as C } from "./config.js";
export { default as DB } from "./debugger.js";
=======
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮
// #region ████████ EXPORTS: Aggregated Object Exports ████████
// #region ░░░░░░░ Utilities & Constants ░░░░░░░ ~
export const U = { ...baseU, getTemplatePath };
export { default as C } from "./config.js";
// #endregion ░░░░[Utilities & Constants]░░░░
// #region ░░░░░░░ Debugging ░░░░░░░ ~
export { default as DB, TESTS } from "./debugger.js";
// #endregion ░░░░[Debugging]░░░░
// #region ░░░░░░░ GSAP Animation ░░░░░░░ ~
>>>>>>> Stashed changes
export { default as gsap, Draggable as Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, RoughEase } from "/scripts/greensock/esm/all.js";
export { default as preloadTemplates } from "./templates.js";
// #endregion ░░░░[GSAP Animation]░░░░
// #region ████████ XItems ████████
export { default as XElem } from "../xclasses/xelem.js";
export { default as XItem } from "../xclasses/xitem.js";
export { default as XGroup, XPool, XRoll } from "../xclasses/xgroup.js";
export { default as XDie, XTermType } from "../xclasses/xterm.js";
export { XGhost, XMutator, XInfo } from "../xclasses/xmod.js";
<<<<<<< Updated upstream
export { default as XPad } from "../xclasses/xpad.js";
=======
export { default as XPad } from "../xclasses/xpad.js";
export { default as XAnimVars } from "./animations.js";
// #endregion ▄▄▄▄▄ TYPES ▄▄▄▄▄
>>>>>>> Stashed changes
