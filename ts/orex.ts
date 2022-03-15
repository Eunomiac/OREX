// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
	gsap,
	Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools, // GreenSock Animation Platform
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	preloadTemplates,
	registerXEffects,
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XElem,
	XItem,
	XGroup, XPool, XRoll,
	XDie,
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
	/*DEVCODE*/
	// #region ▮▮▮▮▮▮▮[Debugging & Tests]▮▮▮▮▮▮▮ ~
	DB, TESTS
	// #endregion ▮▮▮▮[Debugging & Tests]▮▮▮▮
	/*!DEVCODE*/
} from "./helpers/bundler.js";

gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
registerXEffects();
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

// #region ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {
	DB.display("INITIALIZATION: ORE-X");
	DB.groupLog("Preloading Templates ...");
	preloadTemplates();
	DB.groupEnd();
	DB.groupLog("Rendering XROOT to DOM");
	XItem.InitializeXROOT();
	DB.groupEnd();
	DB.log("ORE-X INITIALIZED");
	DB.groupDisplay("INITIALIZATION: Finishing Up...");
});
// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄

/*DEVCODE*/
Hooks.once("ready", () => {
	DB.groupEnd();
	DB.display("READYING: ORE-X");
	const DBCONTROLS = {
		U,
		XElem, XItem,
		XGroup, XPool, XRoll,
		XDie,
		gsap,
		MotionPathPlugin,
		GSDevTools,
		pause: () => {
			gsap.ticker.sleep();
			gsap.globalTimeline.pause();
		},
		play: () => {
			gsap.ticker.wake();
			gsap.globalTimeline.play();
		},
		killAll: XItem.InitializeXROOT
	};
	Object.entries({...DBCONTROLS, ...TESTS}).forEach(([key, val]) => { Object.assign(globalThis, {[key]: val}) });
	DB.log("ORE-X READY");
	DB.groupDisplay("READYING: Finishing Up...");
	setTimeout(() => {
		DB.groupEnd();
	}, 1000);
});
/*!DEVCODE*/