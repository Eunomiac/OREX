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
	XROOT,
	XItem,
	XArm, XOrbit, XOrbitType,
	XGroup, XPool, XRoll,
	XDie, XTermType,
	// #endregion ▮▮▮▮[XItems]▮▮▮▮

	// #region ▮▮▮▮▮▮▮[Debugging & Tests]▮▮▮▮▮▮▮ ~
	DB, DBFUNCS, DBCOMMANDS
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
		XItem, XROOT,
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
	Object.entries({...DBCONTROLS, ...DBFUNCS, ...DBCOMMANDS}).forEach(([key, val]) => { Object.assign(globalThis, {[key]: val}) });
	DB.groupEnd();
	DB.log("ORE-X READY");
	DB.groupDisplay("Finishing Readying...");
	await U.sleep(1000);
	DB.groupEnd();
	DB.groupEnd();
	DB.log("... Readying Complete.");
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

	// const ROLL = new XRoll(XROOT.XROOT, {
	// 	id: "ROLL",
	// 	color: "lime",
	// 	size: 300,
	// 	position: {x: 900, y: 500},
	// 	vars: {opacity: 1}
	// });
	// const DICE = [...new Array(20)].map((_, i) => new XDie(ROLL, {type: XTermType.BasicDie, value: U.cycleNum(i + 1, [1, 10]) as XDieValue}));
	// ROLL.adopt(DICE.slice(0, 8), XOrbitType.Main);
	// ROLL.adopt(DICE.slice(9, 16), XOrbitType.Outer);
	// ROLL.adopt(DICE.slice(17, 20), XOrbitType.Inner);
	// await ROLL.render();
	// const ORBIT = ROLL.orbitals.get(XOrbitType.Main);
	// const ARMS = DICE.map((die) => die.xParent);

	// const MakeFloatDie = async (_: unknown, index: number) => {
	// 	const dieColor = U.getRandomColor();
	// 	const diePos: Point = {
	// 		x: gsap.utils.random(200, 1400, 1),
	// 		y: gsap.utils.random(50, 900, 1)
	// 	};
	// 	if (U.coinFlip()) {
	// 		if (diePos.x <= (ROLL.x + (ROLL.width / 2) + 100)
	// 			&& diePos.x >= (ROLL.x - (ROLL.width / 2) - 100)) {
	// 			diePos.x += gsap.utils.random([-1, 1]) * ((ROLL.width / 2) + 100);
	// 		}
	// 	} else {
	// 		if (diePos.y <= (ROLL.y + (ROLL.height / 2) + 100)
	// 			&& diePos.y >= (ROLL.y - (ROLL.height / 2) - 100)) {
	// 			diePos.y += gsap.utils.random([-1, 1]) * ((ROLL.height / 2) + 100);
	// 		}
	// 	}
	// 	const floatDie = new XDie(XROOT.XROOT, {
	// 		id: "FloatDie",
	// 		type: "BasicDie",
	// 		value: U.cycleNum(index + 1, [1, 10]) as XDieValue,
	// 		dieColor,
	// 		numColor: U.getContrastingColor(dieColor) ?? "rgba(0, 0, 0, 1)",
	// 		vars: {
	// 			...diePos,
	// 			opacity: 1
	// 		}
	// 	});
	// 	return floatDie.render();
	// };

	// const ToggleTimeScale = (scaling = 0.05) => {
	// 	if (gsap.globalTimeline.timeScale() === 1) {
	// 		gsap.globalTimeline.timeScale(scaling);
	// 	} else {
	// 		gsap.globalTimeline.timeScale(1);
	// 	}
	// };

	// const FLOATDICE = await Promise.all([...new Array(6)].map(MakeFloatDie));
	// await U.sleep(5);
	// while (FLOATDICE.length) {
	// 	const thisDie = FLOATDICE.shift()!;
	// 	await U.sleep(1);
	// 	ROLL.adopt(thisDie, gsap.utils.random([XOrbitType.Main, XOrbitType.Inner, XOrbitType.Outer]));
	// }

	// Object.assign(globalThis, {
	// 	ROLL,
	// 	DICE,
	// 	ORBIT,
	// 	ARMS,
	// 	FLOATDICE,
	// 	MakeFloatDie,
	// 	ToggleTimeScale
	// });

	// await Promise.all(DICE.map((die) => die.render()));
	return;

/*!DEVCODE*/
});