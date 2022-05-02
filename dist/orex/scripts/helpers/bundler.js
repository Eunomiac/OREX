
// ▮▮▮▮▮▮▮[IMPORTS]▮▮▮▮▮▮▮
import { default as baseU } from "./utilities.js";
import { getTemplatePath } from "./templates.js";
import { default as XItem, XBaseContainer, XROOT } from "../xclasses/xitem.js";
import { default as XGroup, XPool, XRoll, XArm, XOrbit } from "../xclasses/xgroup.js";
import { default as XDie, XMod, XGhost, XMutator, XInfo } from "../xclasses/xterm.js";
import { default as XPad } from "../xclasses/xpad.js";
// ████████ EXPORTS: Aggregated Object Exports ████████
// ░░░░░░░ Utilities & Constants ░░░░░░░
export const U = { ...baseU, getTemplatePath };
export { default as C } from "./config.js";
// ░░░░░░░ Debugging ░░░░░░░
import { default as DB } from "./debugger.js";
export { DBFUNCS, XDisplay, DBCOMMANDS } from "./debugger.js";
// ░░░░░░░ GSAP Animation ░░░░░░░
export { default as gsap, Draggable as Dragger, InertiaPlugin, MotionPathPlugin, RoughEase } from "/scripts/greensock/esm/all.js";
export { default as preloadTemplates } from "./templates.js";
// ████████ XItems ████████
export { DB, XItem, XBaseContainer, XGroup, XROOT, XPool, XRoll, XArm, XOrbit, XDie, XMod, XGhost, XMutator, XInfo, XPad };

// ████████ TYPES: TypeScript Type Definitions ████████
export var XOrbitType;
(function (XOrbitType) {
    XOrbitType["Core"] = "Core";
    XOrbitType["Main"] = "Main";
    XOrbitType["Inner"] = "Inner";
    XOrbitType["Outer"] = "Outer";
})(XOrbitType || (XOrbitType = {}));
export var XTermType;
(function (XTermType) {
    // Can we extend XDieType here, somehow?
    XTermType[XTermType["BasicDie"] = 0] = "BasicDie";
    XTermType[XTermType["ExpertDie"] = 1] = "ExpertDie";
    XTermType[XTermType["MasterDie"] = 2] = "MasterDie";
    XTermType[XTermType["GobbleDie"] = 3] = "GobbleDie";
    XTermType[XTermType["BasicSet"] = 4] = "BasicSet";
    XTermType[XTermType["MatchSet"] = 5] = "MatchSet";
    XTermType[XTermType["RunSet"] = 6] = "RunSet";
    XTermType[XTermType["FullHouseSet"] = 7] = "FullHouseSet";
    XTermType[XTermType["Difficulty"] = 8] = "Difficulty";
    XTermType[XTermType["Modifier"] = 9] = "Modifier";
    XTermType[XTermType["Trait"] = 10] = "Trait";
    XTermType[XTermType["Styler"] = 11] = "Styler";
    XTermType[XTermType["Ignore"] = 12] = "Ignore";
})(XTermType || (XTermType = {}));