// #region ▮▮▮▮▮▮▮[IMPORTS]▮▮▮▮▮▮▮ ~
import {default as baseU} from "./utilities.js";
import {getTemplatePath} from "./templates.js";

import {default as XItem, XBaseContainer, XROOT} from "../xclasses/xitem.js";
import {default as XGroup, XPool, XRoll, XArm, XOrbit} from "../xclasses/xgroup.js";
import {default as XDie, XMod, XPack, XEffect, XTip} from "../xclasses/xterm.js";
import {default as XPad} from "../xclasses/xpad.js";
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮

// #region ████████ EXPORTS: Aggregated Object Exports ████████
// #region ░░░░░░░ Utilities & Constants ░░░░░░░ ~
export const U = {...baseU, getTemplatePath};
export {default as C} from "./config.js";
// #endregion ░░░░[Utilities & Constants]░░░░
// #region ░░░░░░░ Debugging ░░░░░░░ ~
import {default as DB} from "./debugger.js";
export {DBFUNCS, XDisplay, DBCOMMANDS} from "./debugger.js";
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
export {DB, XItem, XBaseContainer, XGroup, XROOT, XPool, XRoll, XArm, XOrbit, XDie, XMod, XPack as XGhost, XEffect as XMutator, XTip as XInfo, XPad};
// #endregion ▄▄▄▄▄ XItems ▄▄▄▄▄
// #endregion ▄▄▄▄▄ EXPORTS ▄▄▄▄▄

// #region ████████ TYPES: TypeScript Type Definitions ████████
export const enum XOrbitType {
	Core = "Core",
	Main = "Main",
	Inner = "Inner",
	Outer = "Outer"
}

export const enum XTermType {
	// Can we extend XDieType here, somehow?
	BasicDie, ExpertDie, MasterDie, GobbleDie,
	BasicSet, MatchSet, RunSet, FullHouseSet,
	Difficulty, Modifier, Trait, Styler,
	Ignore
}
// #endregion ▄▄▄▄▄ TYPES ▄▄▄▄▄