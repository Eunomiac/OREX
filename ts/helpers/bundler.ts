import {default as baseU} from "./utilities.js";
import {getTemplatePath} from "./templates.js";
export const U = {...baseU, getTemplatePath};

export {default as C} from "./config.js";

export {
	default as gsap,
	Draggable as Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools,
	RoughEase
} from "gsap/all";

export {default as preloadTemplates} from "./templates.js";

export {default as ORoll} from "../xclasses/xroll.js";
export {default as XElem} from "../xclasses/xelem.js";
export {default as XItem} from "../xclasses/xitem.js";
export {default as XGroup} from "../xclasses/xgroup.js";
export {default as XDie} from "../xclasses/xdie.js";