// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ====== GreenSock Animation ====== ~
	gsap,
	Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools, // GreenSock Animation Platform
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	preloadTemplates,
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XElem,
	XItem,
	XGroup, XPool, XRoll,
	XDie,
	// #endregion ▮▮▮▮[XItems]▮▮▮▮

	// #region ▮▮▮▮▮▮▮[Debugging & Tests]▮▮▮▮▮▮▮ ~
	/*DEVCODE*/
	DB, TESTS, XTermType, XOrbitType
	/*!DEVCODE*/
	// #endregion ▮▮▮▮[Debugging & Tests]▮▮▮▮

} from "./helpers/bundler.js";

import {
	XArm, XOrbit
} from "./xclasses/xgroup.js";

// #region ====== GreenSock Animation ====== ~

// #endregion _______ GreenSock Animation _______
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

// @ts-expect-error Cheating by directly accessing protected member for debug purposes.
Hooks._hooks.init.unshift(() => {
	DB.groupTitle("BOOTING");
	DB.groupDisplay("BOOTING DEV-MODE");
});

// #region ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {
	DB.groupEnd();
	DB.log("DEV-MODE BOOTED");
	DB.groupEnd();
	DB.log("... Booting Complete.");
	DB.groupTitle("INITIALIZING");
	DB.display("INITIALIZING ORE-X");
	DB.groupInfo("Preloading Templates...");
	preloadTemplates();
	DB.groupEnd();
	// DB.groupInfo("Rendering XROOT to DOM");
	// XItem.InitializeXROOT();
	// DB.groupEnd();
	DB.log("ORE-X INITIALIZED");
	DB.groupDisplay("Finishing Initialization ...");
});
// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄

Hooks.once("ready", async () => {
	DB.groupEnd();
	DB.groupEnd();
	DB.log("... Initialization Complete.");
	/*DEVCODE*/
	DB.groupTitle("READYING");
	DB.display("READYING ORE-X");
	DB.groupInfo("Preparing Debug Controls...");
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
		killAll: XItem.XROOT.kill()
	};
	DB.groupEnd();
	DB.groupInfo("Declaring Debug Console Globals... ");
	Object.entries({...DBCONTROLS, ...TESTS}).forEach(([key, val]) => { Object.assign(globalThis, {[key]: val}) });
	DB.groupEnd();
	DB.log("ORE-X READY");
	DB.groupDisplay("Finishing Readying...");
	setTimeout(async () => {
		DB.groupEnd();
		DB.groupEnd();
		DB.log("... Readying Complete.");
		DB.groupDisplay("Starting Timeouts...");
		setTimeout(async () => {
			DB.groupEnd();
			DB.groupEnd();

			const XB = {

			};

			DB.groupEnd();
			setTimeout(() => TESTS.xArmTest(false), 500);
		}, U.randInt(1000, 5000));
	}, 1000);
/*!DEVCODE*/
});