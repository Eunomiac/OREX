
// ▮▮▮▮▮▮▮[IMPORTS]▮▮▮▮▮▮▮
import { default as baseU } from "./utilities.js";
<<<<<<< HEAD
<<<<<<< Updated upstream
import { getTemplatePath } from "./templates.js";
export const U = { ...baseU, getTemplatePath };
export { default as C } from "./config.js";
export { default as DB } from "./debugger.js";
=======
import { getTemplatePath } from "./templates.js";
// ████████ EXPORTS: Aggregated Object Exports ████████
// ░░░░░░░ Utilities & Constants ░░░░░░░
export const U = { ...baseU, getTemplatePath };
export { default as C } from "./config.js";
// ░░░░░░░ Debugging ░░░░░░░
export { default as DB, TESTS } from "./debugger.js";
// ░░░░░░░ GSAP Animation ░░░░░░░
>>>>>>> Stashed changes
=======
import { getTemplatePath } from "./templates.js";
// ████████ EXPORTS: Aggregated Object Exports ████████
export const U = { ...baseU, getTemplatePath };
export { default as C } from "./config.js";
export { default as DB, TESTS } from "./debugger.js";
>>>>>>> a9a1a28c472c9a7438b75d41370888a95a9074c2
export { default as gsap, Draggable as Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, RoughEase } from "/scripts/greensock/esm/all.js";
export { default as preloadTemplates } from "./templates.js";
// ████████ XItems ████████
export { default as XElem } from "../xclasses/xelem.js";
export { default as XItem } from "../xclasses/xitem.js";
export { default as XGroup, XPool, XRoll, XOrbitType } from "../xclasses/xgroup.js";
export { default as XDie, XTermType } from "../xclasses/xterm.js";
export { XGhost, XMutator, XInfo } from "../xclasses/xmod.js";
<<<<<<< HEAD
<<<<<<< Updated upstream
export { default as XPad } from "../xclasses/xpad.js";
=======
export { default as XPad } from "../xclasses/xpad.js";
export { default as XAnimVars } from "./animations.js";
>>>>>>> Stashed changes
=======
export { default as XPad } from "../xclasses/xpad.js";
export { default as registerXEffects } from "./animations.js";
>>>>>>> a9a1a28c472c9a7438b75d41370888a95a9074c2
