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
	GSDevTools, // GreenSock Animation Platform
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	preloadTemplates,
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XElem,
	XItem,
	XGroup,
	XDie,
	XRoll
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "./helpers/bundler.js";
/*DEVCODE*/
// import DB from "./helpers/debug.js";

/*!DEVCODE*/
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

// #region ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {
	/*DEVCODE*/console.log("STARTING ORE-X"); /*!DEVCODE*/
	// CONFIG.debug.hooks = true;
	// #region ▮▮▮▮▮▮▮[Configuration] Apply Configuration Settings ▮▮▮▮▮▮▮
	CONFIG.OREX = MAIN;
	// #endregion ▮▮▮▮[Configuration]▮▮▮▮

	// #region ▮▮▮▮▮▮▮[Handlebar Templates] Preload Handlebars Templates ▮▮▮▮▮▮▮
	preloadTemplates();
	// #endregion ▮▮▮▮[Handlebar Templates]▮▮▮▮
});

// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄

/*DEVCODE*/

Hooks.once("ready", () => {
	Object.entries({
		U,
		XElem,
		XItem,
		XGroup,
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
		testCoords: () => {
			const TranslateBox = new XItem({classes: ["translate-box"]});
			const ScaleBox = new XItem({classes: ["scale-box"]}, TranslateBox);
			const ExtraScaleBox = new XItem({classes: ["extra-scale-box"]}, ScaleBox);
			const RotateBox = new XItem({classes: ["rotate-box"]}, ExtraScaleBox);
			const CounterRotateBox = new XItem({classes: ["counter-rotate-box"]}, RotateBox);
			const TestDie = new XDie({}, CounterRotateBox);

			TestDie.set({
				"xPercent": -50,
				"yPercent": -50,
				"x": 0,
				"y": 0,
				"--die-size": "50px",
				"--die-color-bg": "lime",
				"--die-color-fg": "black",
				"--die-color-stroke": "black",
				"fontSize": 60,
				"fontFamily": "Oswald",
				"textAlign": "center"
			});

			const dieMarkers = [
				{x: 0.5, y: 0, background: "yellow"},
				{x: 0, y: 1, background: "cyan"},
				{x: 1, y: 1, background: "magenta"}
			].map(({x, y, background}, i) => {
				const marker = new XItem({
					id: `die-marker-${i + 1}`,
					classes: ["x-marker"]
				}, TestDie);
				marker.set({
					xPercent: -50,
					yPercent: -50,
					height: 10,
					width: 10,
					x: x * 50,
					y: y * 50,
					background
				});
				return marker;
			});

			const xMarkers = ["yellow", "cyan", "magenta"]
				.map((background, i) => {
					const marker = new XItem({
						id: `x-marker-${i + 1}`,
						classes: ["x-marker"]
					});
					marker.set({
						xPercent: -50,
						yPercent: -50,
						height: 10,
						width: 10,
						x: 100 + (20 * i),
						y: 500 + (40 * i),
						background
					});
					return marker;
				});

			TranslateBox.to({
				x: "+=500",
				duration: 5,
				ease: "power3.inOut",
				repeat: -1,
				yoyo: true
			});
			ScaleBox.to({
				scale: 2,
				duration: 15,
				ease: "sine.inOut",
				repeat: -1,
				yoyo: true
			});
			ExtraScaleBox.to({
				scale: 3,
				duration: 5,
				ease: "sine.inOut",
				repeat: -1,
				yoyo: true
			});
			RotateBox.to({
				rotation: "+=360",
				duration: 2,
				ease: "none",
				repeat: -1
			});
			CounterRotateBox.to({
				rotation: "-=360",
				duration: 2,
				ease: "power4.inOut",
				repeat: -1
			});

			function testCoordsTicker() {
				xMarkers.forEach((xMarker, i) => {
					xMarker.set(dieMarkers[i].pos);
				});
			}

			XItem.AddTicker(testCoordsTicker);

			console.log(dieMarkers, xMarkers, TranslateBox, ScaleBox, RotateBox, gsap, MotionPathPlugin);
		},
		testGroup: (params: anyList = {}) => new XGroup(params),
		killAll: XItem.XKill
	}) // @ts-expect-error How to tell TS the type of object literal's values?
		.forEach(([key, val]) => { window[key] = val });


});
/*!DEVCODE*/