/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

// ████████ IMPORTS ████████
import {
	// ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮
	MAIN,
	// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
	gsap,
	Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools,
	RoughEase, // GreenSock Animation Platform
	// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
	preloadTemplates,
	U,
	// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
	XItem,
	XGroup,
	XDie
} from "./helpers/bundler.mjs";

gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);

// ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {

	// ▮▮▮▮▮▮▮[Configuration] Apply Configuration Settings ▮▮▮▮▮▮▮
	CONFIG.OREX = MAIN;

	// ▮▮▮▮▮▮▮[Handlebar Templates] Preload Handlebars Templates ▮▮▮▮▮▮▮
	return preloadTemplates();
});
