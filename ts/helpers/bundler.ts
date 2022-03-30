// #region ▮▮▮▮▮▮▮[IMPORTS]▮▮▮▮▮▮▮ ~
import {default as baseU} from "./utilities.js";
import {getTemplatePath} from "./templates.js";
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮

// #region ████████ EXPORTS: Aggregated Object Exports ████████
// #region ░░░░░░░ Utilities & Constants ░░░░░░░ ~
export const U = {...baseU, getTemplatePath};
export {default as C} from "./config.js";
// #endregion ░░░░[Utilities & Constants]░░░░
// #region ░░░░░░░ Debugging ░░░░░░░ ~
export {default as DB, TESTS} from "./debugger.js";
// #endregion ░░░░[Debugging]░░░░
// #region ░░░░░░░ GSAP Animation ░░░░░░░ ~
export {
	default as gsap,
	Draggable as Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools,
	RoughEase
} from "gsap/all";
export {default as preloadTemplates} from "./templates.js";
// #endregion ░░░░[GSAP Animation]░░░░

// #region ████████ XItems ████████
export {default as XElem} from "../xclasses/xelem.js";
export {default as XItem, XROOT} from "../xclasses/xitem.js";
export {default as XGroup, XPool, XRoll, XOrbitType} from "../xclasses/xgroup.js";
export {default as XDie, XMod, XTermType} from "../xclasses/xterm.js";
export {XGhost, XMutator, XInfo} from "../xclasses/xmod.js";
export {default as XPad} from "../xclasses/xpad.js";
// export {default as XAnimVars, XGSAP, isTimeline} from "./animations.js";
// #endregion ▄▄▄▄▄ XItems ▄▄▄▄▄
// #endregion ▄▄▄▄▄ EXPORTS ▄▄▄▄▄

// #region ████████ TYPES: TypeScript Type Definitions ████████
export type {int, float, posInt, posFloat, HTMLCode, List, Index, ConstructorOf, KnownKeys, Concrete} from "./utilities.js";
export type {Position, XAnim, XElemOptions, Renderable, Tweenable, XParent} from "../xclasses/xelem.js";
export type {XItemOptions} from "../xclasses/xitem.js";
export type {XGroupOptions, XPoolOptions, XOrbitSpecs, XRollOptions} from "../xclasses/xgroup.js";
export type {XTerm, XTermOptions, XDieValue, XDieFace, XDieOptions} from "../xclasses/xterm.js";
export type {XModOptions} from "../xclasses/xmod.js";
// #endregion ▄▄▄▄▄ TYPES ▄▄▄▄▄

// #region ████████ ENUMS: TypeScript Enums ████████
export {Dir} from "./utilities.js";
// #endregion ▄▄▄▄▄ ENUMS ▄▄▄▄▄
