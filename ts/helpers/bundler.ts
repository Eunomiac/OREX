// #region ▮▮▮▮▮▮▮[IMPORTS]▮▮▮▮▮▮▮ ~
import {default as baseU} from "./utilities.js";
import {getTemplatePath} from "./templates.js";
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮

// #region ████████ EXPORTS: Aggregated Object Exports ████████
export const U = {...baseU, getTemplatePath};

export {default as C} from "./config.js";
export {default as DB, TESTS} from "./debugger.js";

export {
	default as gsap,
	Draggable as Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools,
	RoughEase
} from "gsap/all";

export {default as preloadTemplates} from "./templates.js";

export {default as XElem} from "../xclasses/xelem.js";
export {default as XItem} from "../xclasses/xitem.js";
export {default as XGroup, XPool, XRoll, XOrbitType} from "../xclasses/xgroup.js";
export {default as XDie, XTermType} from "../xclasses/xterm.js";
export {XGhost, XMutator, XInfo} from "../xclasses/xmod.js";
export {default as XPad} from "../xclasses/xpad.js";

export {default as registerXEffects} from "./animations.js";
// #endregion ▄▄▄▄▄ EXPORTS ▄▄▄▄▄

// #region ████████ TYPES: TypeScript Type Definitions ████████
export type {EffectsMap} from "gsap";
export type {int, float, posInt, posFloat, HTMLCode, List, Index, ConstructorOf} from "./utilities.js";
export type {XItemOptions} from "../xclasses/xitem.js";
export type {Position, XElemOptions, DOMRenderer, GSAPController} from "../xclasses/xelem.js";
export type {XGroupOptions, XPoolOptions, XOrbitSpecs, XRollOptions} from "../xclasses/xgroup.js";
export type {XTerm, XTermOptions, XDieOptions} from "../xclasses/xterm.js";
export type {XModOptions} from "../xclasses/xmod.js";
export type {GSAPEffect} from "../helpers/animations.js";
// #endregion ▄▄▄▄▄ TYPES ▄▄▄▄▄