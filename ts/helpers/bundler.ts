import {default as baseU} from "./utilities.js";
import {getTemplatePath} from "./templates.js";
export const U = {...baseU, getTemplatePath};

export {default as C} from "./config.js";
export {default as DB} from "./debugger.js";

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
export {default as XGroup, XPool, XRoll} from "../xclasses/xgroup.js";
export {default as XDie, XTermType} from "../xclasses/xterm.js";
export {XGhost, XMutator, XInfo} from "../xclasses/xmod.js";
export {default as XPad} from "../xclasses/xpad.js";

export type {int, float, posInt, posFloat, HTMLCode, List, Index, ConstructorOf} from "./utilities.js";
export type {XItemOptions} from "../xclasses/xitem.js";
export type {Position, XElemOptions, DOMRenderer, GSAPController} from "../xclasses/xelem.js";
export type {XGroupOptions, XPoolOptions} from "../xclasses/xgroup.js";
export type {XTerm, XTermOptions, XDieOptions} from "../xclasses/xterm.js";
export type {XModOptions} from "../xclasses/xmod.js";
