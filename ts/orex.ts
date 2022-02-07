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
	XItem,
	XGroup,
	XDie
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
	// Object.assign(CONFIG, {OREX: MAIN as list});
	CONFIG.OREX = MAIN;
	// #endregion ▮▮▮▮[Configuration]▮▮▮▮

	// #region ▮▮▮▮▮▮▮[Handlebar Templates] Preload Handlebars Templates ▮▮▮▮▮▮▮
	return preloadTemplates();
	// #endregion ▮▮▮▮[Handlebar Templates]▮▮▮▮
});

// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄

/*DEVCODE*/
Hooks.once("ready", () => {
	console.log({
		"this": this,
		U,
		XItem,
		XGroup,
		XDie,
		gsap,
		MotionPathPlugin,
		GSDevTools,
		"pause": () => gsap.globalTimeline.pause(),
		"play": () => gsap.globalTimeline.play()
	} as list);

	const TranslateBox = new XItem({
		id: "translate-item",
		template: U.getTemplatePath("xcontainer.hbs"),
		classes: ["translate-box"],
		parent: XItem.XCONTAINER
	});
	const ScaleBox = new XItem({
		id: "scale-item",
		template: U.getTemplatePath("xcontainer.hbs"),
		classes: ["scale-box"],
		parent: TranslateBox
	});
	const RotateBox = new XItem({
		id: "rotate-item",
		template: U.getTemplatePath("xcontainer.hbs"),
		classes: ["rotate-box"],
		parent: ScaleBox
	});
	const TestDie = new XItem({
		id: "test-die",
		template: U.getTemplatePath("xdie.hbs"),
		classes: ["x-die"],
		parent: RotateBox
	});

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
		{x: 0.5, y: 0},
		{x: 0, y: 1},
		{x: 1, y: 1}
	].map(({x, y}, i) => {
		const marker = new XItem({
			id: `die-marker-${i + 1}`,
			template: U.getTemplatePath("xcontainer.hbs"),
			classes: ["x-marker"],
			parent: TestDie
		});
		marker.set({
			xPercent: -50,
			yPercent: -50,
			height: 10,
			width: 10,
			x: x * 50,
			y: y * 50,
			background: ["yellow", "cyan", "magenta"][i]
		});
		return marker;
	});

	const xMarkers = ["yellow", "cyan", "magenta"]
		.map((color, i) => {
			const marker = new XItem({
				id: `x-marker-${i + 1}`,
				template: U.getTemplatePath("xcontainer.hbs"),
				classes: ["x-marker"],
				parent: XItem.XCONTAINER
			});
			marker.set({
				xPercent: -50,
				yPercent: -50,
				height: 10,
				width: 10,
				x: 100 + (20 * i),
				y: 500 + (40 * i),
				background: color
			});
			return marker;
		});

	setTimeout(() => {
		gsap.to(TranslateBox.elem, {
			x: "+=500",
			duration: 5,
			ease: "power3.inOut",
			repeat: -1,
			yoyo: true
		});
		gsap.to(ScaleBox.elem, {
			scale: 5,
			duration: 15,
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true
		});
		gsap.to(RotateBox.elem, {
			rotation: "+=360",
			duration: 2,
			ease: "none",
			repeat: -1
		});
		gsap.ticker.add(() => {
			xMarkers.forEach((xMarker, i) => {
				const posData = dieMarkers[i]?.positionData?.globalPosition;
				if (posData) {
					xMarker.set(posData);
				}
			});
		});
	}, 100);

	console.log(dieMarkers, xMarkers, TranslateBox, ScaleBox, RotateBox, gsap, MotionPathPlugin);
});
/*!DEVCODE*/