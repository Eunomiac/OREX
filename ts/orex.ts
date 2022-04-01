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
	XROOT, XElem,
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
	DB.display("... Booting Complete.");

	DB.groupTitle("INITIALIZING");
	DB.display("INITIALIZING ORE-X");

	DB.groupLog("Preloading Templates...");
	preloadTemplates();
	DB.groupEnd();

	DB.groupLog("Rendering XROOT to DOM");
	XROOT.INITIALIZE();
	DB.groupEnd();

	DB.log("ORE-X INITIALIZED");
	DB.groupDisplay("INITIALIZING MODULES & CANVAS");
});
// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄

Hooks.once("ready", async () => {
	DB.groupEnd();
	DB.log("MODULES & CANVAS INITIALIZED");
	DB.groupEnd();
	DB.display("... Initialization Complete.");
	/*DEVCODE*/
	DB.groupTitle("READYING");
	DB.display("READYING ORE-X");

	DB.groupLog("Preparing Debug Controls...");
	const DBCONTROLS = {
		U,
		XROOT, XElem, XItem,
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

	DB.groupLog("Declaring Debug Console Globals... ");
	Object.entries({...DBCONTROLS, ...TESTS}).forEach(([key, val]) => { Object.assign(globalThis, {[key]: val}) });
	DB.groupEnd();

	DB.log("ORE-X READIED");

	DB.groupDisplay("READYING MODULES & CANVAS");
	U.sleep(1000).then(async () => {
		DB.groupEnd();
		DB.log("MODULES & CANVAS READIED");
		DB.groupEnd();
		DB.display("... Readying Complete.");
		DB.groupEnd();
		DB.groupLog("Awaiting Test Case Timeouts...");

		U.sleep(U.randInt(1000, 5000)).then(async () => {
			/* RUN TESTS HERE */

			DB.groupEnd();
			DB.display("... Timeouts Complete.");
			DB.title("START-UP COMPLETE.");
			DB.display("... System on Standby.");
		});
	});
/*!DEVCODE*/
});