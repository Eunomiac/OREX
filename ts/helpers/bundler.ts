// #region ▮▮▮▮▮▮▮[IMPORTS]▮▮▮▮▮▮▮ ~
import {default as baseU} from "./utilities.js";
import {getTemplatePath} from "./templates.js";

import {default as XElem} from "../xclasses/xelem.js";
import {default as XItem, IsRenderable, CanParent, IsTweenable} from "../xclasses/xitem.js";
import {default as XGroup, XROOT, XPool, XRoll, XArm, XOrbit, XOrbitType} from "../xclasses/xgroup.js";
import {default as XDie, XMod, XTermType} from "../xclasses/xterm.js";
import {XGhost, XMutator, XInfo} from "../xclasses/xmod.js";
import {default as XPad} from "../xclasses/xpad.js";
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮

// #region ████████ EXPORTS: Aggregated Object Exports ████████
// #region ░░░░░░░ Utilities & Constants ░░░░░░░ ~
export const U = {...baseU, getTemplatePath};
export {default as C} from "./config.js";
// #endregion ░░░░[Utilities & Constants]░░░░
// #region ░░░░░░░ Debugging ░░░░░░░ ~
import {default as DB, XDisplay} from "./debugger.js";
// import type {XDisplayOptions} from "./debugger.js";
export {TESTS, DBFUNCS} from "./debugger.js";
// #endregion ░░░░[Debugging]░░░░
// #region ░░░░░░░ GSAP Animation ░░░░░░░ ~
export {
	default as gsap,
	Draggable as Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	RoughEase
} from "gsap/all";
export {default as preloadTemplates} from "./templates.js";
// #endregion ░░░░[GSAP Animation]░░░░

// #region ████████ XItems ████████
export {DB, XElem, XItem, XGroup, XROOT, XPool, XRoll, XArm, XOrbit, XOrbitType, XDie, XMod, XTermType, XGhost, XMutator, XInfo, XPad};
export {IsRenderable, CanParent, IsTweenable};
// export {default as XAnimVars, XGSAP, isTimeline} from "./animations.js";
// #endregion ▄▄▄▄▄ XItems ▄▄▄▄▄
// #endregion ▄▄▄▄▄ EXPORTS ▄▄▄▄▄

// #region ████████ TYPES: TypeScript Type Definitions ████████
import type {int, float, posInt, posFloat, HTMLCode, List, Index, ConstructorOf, KnownKeys, Concrete} from "./utilities.js";
import type {Position, Anim, Renderable, Tweenable} from "../xclasses/xelem.js";
import type {XOptions} from "../xclasses/xitem.js";
import type {XOrbitSpecs} from "../xclasses/xgroup.js";
import type {XTerm, XTermOptions, XDieValue, XDieFace, XDieOptions} from "../xclasses/xterm.js";
import type {XModOptions} from "../xclasses/xmod.js";

export type {int, float, posInt, posFloat, HTMLCode, List, Index, ConstructorOf, KnownKeys, Concrete,
	Position, Anim as XAnim, Renderable, Tweenable, XOptions, XOrbitSpecs,
	XTerm, XTermOptions, XDieValue, XDieFace, XDieOptions, XModOptions};
// #endregion ▄▄▄▄▄ TYPES ▄▄▄▄▄

// #region ████████ ENUMS: TypeScript Enums ████████
export {Dir} from "./utilities.js";
// #endregion ▄▄▄▄▄ ENUMS ▄▄▄▄▄
