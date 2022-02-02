// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮ ~
	MAIN,
	// #endregion ▮▮▮▮[Constants]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
	gsap,
	Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools,
	RoughEase, // GreenSock Animation Platform
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	preloadTemplates,
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XItem,
	XGroup,
	XDie
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../scripts/helpers/bundler.mjs";
/*DEVCODE*/
// import DB from "./helpers/debug.mjs";
/*!DEVCODE*/
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

// #region ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {
	/*DEVCODE*/console.log("STARTING ORE-X"); /*!DEVCODE*/

	// #region ▮▮▮▮▮▮▮[Configuration] Apply Configuration Settings ▮▮▮▮▮▮▮
	var CONFIG: any = CONFIG;
	CONFIG.OREX = MAIN;
	// #endregion ▮▮▮▮[Configuration]▮▮▮▮

	// #region ▮▮▮▮▮▮▮[Handlebar Templates] Preload Handlebars Templates ▮▮▮▮▮▮▮
	return preloadTemplates();
	// #endregion ▮▮▮▮[Handlebar Templates]▮▮▮▮
});

// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄

/*DEVCODE*/
Hooks.once("ready", () => {
	// window.REF = game.OREX;
	// window.DB = new DB({
	// 	topLeft: 10,
	// 	botLeft: 5,
	// 	topRight: 6,
	// 	botRight: 4
	// });

	var window: any = window;
	
	Object.entries({
		U,
		XItem,
		XGroup,
		XDie,
		gsap,
		MotionPathPlugin,
		GSDevTools,
		pause: () => gsap.globalTimeline.pause(),
		play: () => gsap.globalTimeline.play()
	}).forEach(([key, ref]) => {
		window[key] = ref;
	});
	window.XITEM = new XItem({id: "test-item", template: U.getTemplatePath("xcontainer.hbs")});
});
/*!DEVCODE*/