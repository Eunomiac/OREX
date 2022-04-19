// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ▮▮▮▮▮▮▮ External Libraries ▮▮▮▮▮▮▮ ~
	// #region ====== GreenSock Animation ====== ~
	gsap,
	Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	// #endregion ___ GreenSock Animation ___
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	preloadTemplates,
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XROOT, XElem,
	XItem,
	XArm, XOrbit,
	XGroup, XPool, XRoll,
	XDie,
	// #endregion ▮▮▮▮[XItems]▮▮▮▮

	// #region ▮▮▮▮▮▮▮[Debugging & Tests]▮▮▮▮▮▮▮ ~
	DB, TESTS, DBFUNCS, XTermType, XOrbitType, FACTORIES
	// #endregion ▮▮▮▮[Debugging & Tests]▮▮▮▮
	/*!DEVCODE*/
	// #endregion ▮▮▮▮[Debugging & Tests]▮▮▮▮

} from "./helpers/bundler.js";
// #region ====== GreenSock Animation ====== ~

// #endregion _______ GreenSock Animation _______
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin);
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
	DB.groupInfo("Rendering XROOT to DOM");
	await XROOT.InitializeXROOT();
	DB.groupEnd();
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
		XElem, XItem, XROOT,
		XGroup, XPool, XRoll, XArm, XOrbit,
		XDie,
		gsap,
		MotionPathPlugin,
		pause: () => {
			gsap.ticker.sleep();
			gsap.globalTimeline.pause();
		},
		play: () => {
			gsap.ticker.wake();
			gsap.globalTimeline.play();
		},
		killAll: XROOT.InitializeXROOT
	};
	DB.groupEnd();
	DB.groupInfo("Declaring Debug Console Globals... ");
	Object.entries({...DBCONTROLS, ...TESTS, ...DBFUNCS}).forEach(([key, val]) => { Object.assign(globalThis, {[key]: val}) });
	DB.groupEnd();
	DB.log("ORE-X READY");
	DB.groupDisplay("Finishing Readying...");
	await U.sleep(1000);
	DB.groupEnd();
	DB.groupEnd();
	DB.log("... Readying Complete.");

	// DBFUNCS.InitializeDisplay([]);
	DB.groupInfo("Rendering Debug Display to DOM");
	const DBDISPLAY = await DBFUNCS.InitializeDisplay();
	/*
	// {label: "Widths ", target: Orbit, watch: () => Orbit.arms.map((xArm, i) => `<span style="color: ${(xArm.xItem as XDie).xOptions.color};">[${i+1}]</span> ${U.pad(U.pInt(xArm.width),5, "&nbsp;")}`).join("\t")},
	{ label: "Weights", target: Orbit, watch: () => Orbit.arms.map((xArm, i) => `<span style="color: ${(xArm.xItem as XDie).xOptions.color};">[${i + 1}]</span>${U.pad(U.pInt(xArm.heldItemSize), 3, "&nbsp;")}&nbsp;&nbsp;&nbsp;`).join("\t") },
	{ label: "Local °", target: Orbit, watch: () => Orbit.arms.map((xArm, i) => `<span style="color: ${(xArm.xItem as XDie).xOptions.color};">[${i + 1}]</span>${U.pad(U.pInt(xArm.rotation), 3, "&nbsp;")}&nbsp;&nbsp;&nbsp;`).join("\t") },
	// {label: "ORBIT °", target: Orbit, watch: () => `Local: ${U.signNum(U.pInt(Orbit.rotation))}, Global: ${U.signNum(U.pInt(Orbit.global.rotation))}`},
	{ label: "Global°", target: Orbit, watch: () => Orbit.arms.map((xArm, i) => `<span style="color: ${(xArm.xItem as XDie).xOptions.color};">[${i + 1}]</span>${U.pad(U.pInt(xArm.global.rotation), 3, "&nbsp;")}&nbsp;&nbsp;&nbsp;`).join("\t") },
	// For each arm and FloatingDie[3] (value = "4"):
	{ label: "F-Global°", target: Orbit, watch: () => Orbit.arms.map((xArm, i) => `<span style="color: ${(xArm.xItem as XDie).xOptions.color};">[${i + 1}]</span>${U.pad(U.pInt(xArm.getRotWidthToItem(FloatingDice[3]).rotation), 3, "&nbsp;")}&nbsp;&nbsp;&nbsp;`).join("\t") },

		]
}); */


	DB.groupEnd();

	DB.groupDisplay("Initializing Roll Generation");
	TESTS.XArmSnapping();
	return;
	const MAINROLL = await FACTORIES.XRoll.Make(XROOT.XROOT, {id: "MAIN"}, {
		"x": 500, "y": 400, "height": 300, "width": 300, "--bg-color": "cyan"
	});
	Object.assign(globalThis, {MAINROLL});
	await MAINROLL.initialize({
		"x": 500, "y": 400, "size": 300, "--bg-color": "cyan"
	});

/*!DEVCODE*/
});