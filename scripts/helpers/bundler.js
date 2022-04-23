// #region ▮▮▮▮▮▮▮[IMPORTS]▮▮▮▮▮▮▮ ~
import { default as baseU } from "./utilities.js";
import { getTemplatePath } from "./templates.js";
import { default as XElem } from "../xclasses/xelem.js";
import { default as XItem } from "../xclasses/xitem.js";
import { default as XGroup, XROOT, XPool, XRoll, XArm, XOrbit, XOrbitType } from "../xclasses/xgroup.js";
import { default as XDie, XMod, XTermType } from "../xclasses/xterm.js";
import { XGhost, XMutator, XInfo } from "../xclasses/xmod.js";
import { default as XPad } from "../xclasses/xpad.js";
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮
// #region ████████ EXPORTS: Aggregated Object Exports ████████
// #region ░░░░░░░ Utilities & Constants ░░░░░░░ ~
export const U = { ...baseU, getTemplatePath };
export { default as C } from "./config.js";
// #endregion ░░░░[Utilities & Constants]░░░░
// #region ░░░░░░░ Debugging ░░░░░░░ ~
import { default as DB } from "./debugger.js";
// import type {XDisplayOptions} from "./debugger.js";
export { TESTS, DBFUNCS } from "./debugger.js";
// #endregion ░░░░[Debugging]░░░░
// #region ░░░░░░░ GSAP Animation ░░░░░░░ ~
export { default as gsap, Draggable as Dragger, InertiaPlugin, MotionPathPlugin, RoughEase } from "/scripts/greensock/esm/all.js";
export { default as preloadTemplates } from "./templates.js";
// #endregion ░░░░[GSAP Animation]░░░░
// #region ████████ XItems ████████
export { DB, XElem, XItem, XGroup, XROOT, XPool, XRoll, XArm, XOrbit, XOrbitType, XDie, XMod, XTermType, XGhost, XMutator, XInfo, XPad };
// #endregion ▄▄▄▄▄ TYPES ▄▄▄▄▄
// #region ████████ ENUMS: TypeScript Enums ████████
export { Dir } from "./utilities.js";
// #endregion ▄▄▄▄▄ ENUMS ▄▄▄▄▄