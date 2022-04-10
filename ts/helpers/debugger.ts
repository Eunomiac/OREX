// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	C, U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	FACTORIES,
	XROOT, XItem,
	XGroup, XPool,
	XDie,
	XTermType, XOrbitType, XRoll
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "./bundler.js";
import type {XArm, XOrbit, Index, XOrbitSpecs, XItemOptions, XDieValue} from "./bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

// #region ████████ XLogger: Formatted Logging to Console ████████ ~
const XLogger = (type: keyof typeof STYLES, stylesOverride: Record<string,gsap.TweenValue>, message: string, ...content: unknown[]) => {
	if (C.isDebugging) {
		const styleLine = Object.entries({
			...STYLES.base,
			...STYLES[type] ?? {},
			...stylesOverride
		}).map(([prop, val]) => `${prop}: ${val};`).join(" ");
		const traceStyle = Object.entries({
			...STYLES.base,
			...STYLES.trace
		}).map(([prop, val]) => `${prop}: ${val};`).join(" ");
		if (content.length) {
			if (content[0] === "NOGROUP") {
				console.groupCollapsed(`%c${message}`, styleLine);
			} else {
				console.groupCollapsed(`%c${message}`, styleLine, ...content);
			}
		} else {
			console.groupCollapsed(`%c${message}`, styleLine);
		}
		console.trace();
		console.groupEnd();
	}
};

const STYLES = {
	title: {
		"background": "linear-gradient(to right,#da1b60,#ff8a00)",
		"color": "#100e17",
		"font-family": "Candal",
		"font-size": "18px",
		"padding": "0 30px 0 10px",
		"margin-left": "-20px"
	},
	trace: {
		"background": "silver",
		"color": "black",
		"font-family": "Fira Code",
		"font-size": "10px",
		"text-align": "right",
		"width": "200px"
	},
	display: {
		"background": "#EDB620",
		"color": "black",
		"font-family": "AlverataInformalW01-Regular",
		"font-size": "16px",
		"padding": "0 10px 0 10px",
		"font-weight": "bold"
	},
	base: {
		"background": "#000000",
		"color": "#EDB620",
		"font-family": "Pragmata Pro",
		"padding": "0 20px 0 20px"
	},
	info: {
		"background": "#111111",
		"color": "gold",
		"font-size": "11px",
		"font-weight": "normal",
		"font-family": "Fira Code",
		"padding": "0 30px 0 30px"
		// "margin-left": "250px"
	},
	error: {
		"color": "#FF0000",
		"background": "#950A0F",
		"font-weight": "bold",
		"padding": "0 800px 0 50px"
	},
	groupEnd: {}
};

const DB: Record<string, any> = {
	log: (message: string, ...content:unknown[]) => XLogger("base", {}, message, ...(content.length ? content : ["NOGROUP"])),
	title: (message: string) => XLogger("title", {}, message, "NOGROUP"),
	display: (message: string, ...content: unknown[]) => XLogger("display", {}, message, ...(content.length ? content : ["NOGROUP"])),
	info: (message: string, ...content: unknown[]) => XLogger("info", {}, message, ...(content.length ? content : ["NOGROUP"])),
	error: (message: string, ...content: unknown[]) => XLogger("error", {}, message, ...(content.length ? content : ["NOGROUP"])),
	groupLog: (label: string) => XLogger("base", {}, label),
	groupTitle: (label: string) => XLogger("title", {}, label),
	groupDisplay: (label: string) => XLogger("display", {}, label),
	groupInfo: (label: string) => XLogger("info", {}, label),
	groupError: (label: string) => XLogger("error", {}, label),
	groupEnd: () => console.groupEnd()
	// XArm
};
// #endregion ▄▄▄▄▄ XLogger ▄▄▄▄▄

// #region ████████ XPing: Rendering Position Pings to DOM ████████ ~
class XPing {
	static async Make(point: Point, label: string, context = XROOT.XROOT as XGroup, color = "random") {
		color = color === "random" ? U.randElem(Object.keys(C.colors)) : color;
		const xPing = new XPing(
			point,
			label,
			context,
			color
		);
		await xPing.xItem.render();
		await xPing.initialize();
	}
	static REGISTRY: Map<string,XPing> = new Map();
	static Register(xPing: XPing) {
		if (this.REGISTRY.has(xPing.label)) {
			this.REGISTRY.get(xPing.label)?.xItem.kill();
		}
		this.REGISTRY.set(xPing.label, xPing);
	}
	static Unregister(xPing: XPing) {
		this.REGISTRY.delete(xPing.label);
		xPing.xItem.kill();
	}
	static KillAll() {
		this.REGISTRY.forEach((xPing) => xPing.xItem.kill());
		this.REGISTRY.clear();
	}
	static get newPingID() { return `xPing-${this.REGISTRY.size + 1}` }

	xItem: XItem;
	label: string;
	color: string;
	point: Point;
	context: XItem | XROOT;

	constructor(point: Point, label: string, context = XROOT.XROOT as XGroup, color = "random") {
		this.color = color === "random" ? U.randElem(Object.keys(C.colors)) : color;
		this.xItem = new XItem(context, {id: XPing.newPingID, classes: ["x-ping"]}, {
			height: 100,
			width: 100,
			x: point.x,
			y: point.y,
			background: `radial-gradient(red 5%, ${this.color} 10%, transparent 60%, yellow 62%, transparent 64%)`,
			textAlign: "center",
			lineHeight: "50px",
			fontSize: "24px",
			fontFamily: "Oswald",
			color: "white",
			textShadow: "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black"
		});
		this.label = label;
		this.point = point;
		this.context = context;
	}

	async initialize() {
		await this.xItem.initialize();
		this.xItem.elem$.html(this.label);
		XPing.Register(this);
		XLogger("base", {background: this.color}, `▶${U.uCase(this.label)} at {x: ${U.roundNum(this.point.x, 1)}, y: ${U.roundNum(this.point.y, 1)}}`, this);
		return this.xItem.fromTo(
			{
				opacity: 0,
				scale: 0.5
			},
			{
				opacity: 1,
				scale: 1,
				ease: "elastic.out(5)",
				duration: 0.5
			}
		);
	}
}

const getPosData = (xItems: XItem[]) => {
	const posData: Record<string, any> = {};
	xItems.forEach((xItem) => {
		const xParent = xItem.xParent!;
		const parent = MotionPathPlugin.convertCoordinates(
			xItem.elem,
			xParent.elem,
			xItem.xElem.origin
		);
		const global = MotionPathPlugin.convertCoordinates(
			xItem.elem,
			XROOT.XROOT.elem,
			xItem.xElem.origin
		);
		let xName = xItem.id.replace(/_.*$/u, "");
		if (xName in posData) {
			xName += `_${Object.keys(posData).length}`;
		}
		posData[xName] = {
			local: `{x: ${U.roundNum(xItem.pos.x)}, y: ${U.roundNum(xItem.pos.y)}, rot: ${U.roundNum(xItem.rotation)}}`,
			origin: `{x: ${U.roundNum(xItem.xElem.origin.x)}, y: ${U.roundNum(xItem.xElem.origin.y)}}`,
			parent: `{x: ${U.roundNum(parent.x)}, y: ${U.roundNum(parent.y)}}`,
			global: `{x: ${U.roundNum(global.x)}, y: ${U.roundNum(global.y)}, rot: ${U.roundNum(xItem.global.rotation)}}`
		};
	});
	console.log(JSON.stringify(posData, null, 2).replace(/"/g, ""));
	return posData;
};

Object.assign(DB, {
	PING: (point: Point, label: string, context?: XGroup, color?: string) => new XPing(point, label, context, color),
	ClearPings: () => XPing.KillAll()
});

// #endregion ▄▄▄▄▄ XPing ▄▄▄▄▄

const getRollPos = (pos: 0|1|2|3|4, size: number): Point => {
	if (XROOT.XROOT instanceof XItem) {
		const {height, width} = XROOT.XROOT;
		return [
			{x: 0.5 * width, y: 0.5 * height},
			{x: 0.75 * size, y: 0.75 * size},
			{x: width - (0.75 * size), y: 0.75 * size},
			{x: width - (0.75 * size), y: height - (0.75 * size)},
			{x: 0.75 * size, y: height - (0.75 * size)}
		][pos];
	} else {
		DB.error("Attempt to getRollPos() before XROOT.XROOT Rendered.");
		return {x: 0, y: 0};
	}
};
const ClickPhases = ["PositionXDie", "ParentXArm", "StretchXArm", "ResumeRotation"];
const BuildTestContext = async () => {
	DB.groupTitle("Position Test Setup");
	type TestObjs = {
		Die: XDie,
		FloatDie: XDie,
		Arm: XArm,
		Orbit: XOrbit,
		MainRoll: XRoll
	};
	DB.groupLog("Instantiating Roll");
	const MainRoll = await FACTORIES.XRoll.Make(XROOT.XROOT, {id: "Roll"}, {x: 300, y: 300, height: 200, width: 200, outline: "5px solid blue"});
	DB.groupEnd();
	DB.groupLog("Instantiating Dice");
	const Die = await FACTORIES.XDie.Make(MainRoll, {id: "Roll-Die", type: XTermType.BasicDie});
	const RollDice = await Promise.all([...new Array(5)].map(() => FACTORIES.XDie.Make(MainRoll, {id: "Roll-Die", type: XTermType.BasicDie})));
	const FloatDie = await FACTORIES.XDie.Make(XROOT.XROOT, {id: "Float-Die", type: XTermType.BasicDie, color: "red"}, {x: 1200, y: 200});
	const RandomDice = await Promise.all([
		{x: 200, y: 200, color: "blue"},
		{x: 400, y: 900, color: "gold"},
		{x: 800, y: 200, color: "green"},
		{x: 800, y: 900, color: "cyan"},
		{x: 50, y: 500, color: "magenta"}
	].map((dieParams, i) => FACTORIES.XDie.Make(XROOT.XROOT, {
		id: `RandomDie-${i}`,
		type: XTermType.BasicDie,
		color: dieParams.color
	}, {x: dieParams.x, y: dieParams.y})));
	DB.groupEnd();
	DB.groupLog("Initializing FloatDie");
	await Promise.all([FloatDie, ...RandomDice].map((die) => die.initialize()));
	DB.groupEnd();
	DB.groupLog("Initializing Roll");
	await MainRoll.initialize();
	DB.groupEnd();
	DB.groupLog("Adding Dice");
	await MainRoll.addXItems({[XOrbitType.Main]: [Die, ...RollDice]});
	DB.groupEnd();
	DB.groupDisplay("Fetching Arm");
	const Orbit = MainRoll.orbitals.get(XOrbitType.Main)!;
	const [Arm] = Orbit.arms;
	DB.log("XArm", Arm);
	DB.groupEnd();
	const T: TestObjs = {
		Die,
		FloatDie,
		Arm,
		Orbit,
		MainRoll
	};
	const getPosData = () => {
		const posData: Record<string, any> = {};
		["MainRoll", "Orbit", "Arm", "Die", "FloatDie"].forEach((xName) => {
			// @ts-expect-error Debugging.
			const xItem = T[xName] as XItem;
			const xParent = xItem.xParent as XItem;
			const parent = MotionPathPlugin.convertCoordinates(
				xItem.elem,
				xParent.elem,
				xItem.xElem.origin
			);
			const global = MotionPathPlugin.convertCoordinates(
				xItem.elem,
				XROOT.XROOT.elem,
				xItem.xElem.origin
			);
			posData[xName] = {
				local: `{x: ${U.roundNum(xItem.pos.x)}, y: ${U.roundNum(xItem.pos.y)}, rot: ${U.roundNum(xItem.rotation)}}`,
				origin: `{x: ${U.roundNum(xItem.xElem.origin.x)}, y: ${U.roundNum(xItem.xElem.origin.y)}}`,
				parent: `{x: ${U.roundNum(parent.x)}, y: ${U.roundNum(parent.y)}}`,
				global: `{x: ${U.roundNum(global.x)}, y: ${U.roundNum(global.y)}, rot: ${U.roundNum(xItem.global.rotation)}}`
			};
		});
		console.log(JSON.stringify(posData, null, 2).replace(/"/g, ""));
	};
	Object.assign(globalThis, T, {getPosData, RandomDice});
	DB.log("Setup Complete.");
	DB.groupDisplay("Starting Timeouts...");
	await U.sleep(U.randInt(1, 5));
	DB.groupEnd();
	DB.groupEnd();
	DB.log("Initial Position Data");
	getPosData();
};
const TESTS_ARCHIVE = {
	nestedPositionTest: async () => {
		const TranslateBox = await FACTORIES.XPool.Make(XROOT.XROOT, {
			id: "translate-box",
			classes: ["translate-box"]
		}, {xPercent: 0, yPercent: 0});
		await TranslateBox.initialize();
		TranslateBox.to({
			x: "+=500",
			duration: 5,
			ease: "power3.inOut",
			repeat: -1,
			yoyo: true
		});
		const ScaleBox = await FACTORIES.XGroup.Make(TranslateBox, {
			id: "scale-box-1",
			classes: ["scale-box"]
		}, {
			xPercent: 0,
			yPercent: 0
		});
		await ScaleBox.initialize();
		ScaleBox.to({
			scale: 2,
			duration: 15,
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true
		});
		const ExtraScaleBox = await FACTORIES.XGroup.Make(ScaleBox, {
			id: "scale-box-2",
			classes: ["extra-scale-box"]}, {
			xPercent: 0,
			yPercent: 0
		});
		await ExtraScaleBox.initialize();
		ExtraScaleBox.to({
			scale: 3,
			duration: 5,
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true
		});
		const RotateBox = await FACTORIES.XGroup.Make(ExtraScaleBox, {
			id: "rotate-box-1",
			classes: ["rotate-box"]}, {
			xPercent: 0,
			yPercent: 0
		});
		await RotateBox.initialize();
		RotateBox.to({
			rotation: "+=360",
			duration: 2,
			ease: "none",
			repeat: -1
		});
		const CounterRotateBox = await FACTORIES.XGroup.Make(RotateBox, {
			id: "rotate-box-2",
			classes: ["rotate-box"]}, {
			xPercent: 0,
			yPercent: 0
		});
		await CounterRotateBox.initialize();
		CounterRotateBox.to({
			rotation: "-=360",
			duration: 2,
			ease: "power4.inOut",
			repeat: -1
		});
		await Promise.all([TranslateBox, ScaleBox, ExtraScaleBox, RotateBox, CounterRotateBox].map((xItem) => xItem.initialize()));

		const TestDie = await FACTORIES.XGroup.Make(CounterRotateBox, {id: "test-die"}, {height: 40, width: 40, background: "lime"});

		const dieMarkers = await Promise.all([
			{x: 0.5, y: 0, background: "yellow"},
			{x: 0, y: 1, background: "cyan"},
			{x: 1, y: 1, background: "magenta"}
		].map(({x, y, background}, i) => FACTORIES.XItem.Make(TestDie, {
			id: `die-marker-${i + 1}`,
			classes: ["x-marker"]
		}, {
			height: 10,
			width: 10,
			x: x * 50,
			y: y * 50,
			background
		})));

		await Promise.all(dieMarkers.map((marker) => marker.initialize()));

		const xMarkers = await Promise.all(["yellow", "cyan", "magenta"]
			.map((background, i) => FACTORIES.XItem.Make(XROOT.XROOT, {
				id: `x-marker-${i + 1}`,
				classes: ["x-marker"]
			}, {
				height: 10,
				width: 10,
				x: 100 + (20 * i),
				y: 500 + (40 * i),
				background
			})));

		await Promise.all(xMarkers.map((marker) => marker.initialize()));

		xMarkers.forEach((marker, i) => marker.set(dieMarkers[i].pos));

		DB.log("Test Die Objs =>", dieMarkers, xMarkers, TranslateBox, ScaleBox, RotateBox, TestDie);
	}
};
const DBFUNCS = {
	BuildTestContext,
	makeRoll: async (
		dice: Partial<[number, number, number]>,
		{pos = 0, color = "cyan", size = 200}: {pos?: 0|1|2|3|4, color?: string, size?: number} = {}
	) => {
		const rollPos = getRollPos(pos, size);
		const xRoll = await FACTORIES.XRoll.Make(XROOT.XROOT, {
			id: "ROLL"
		}, {
			...rollPos,
			"height": size,
			"width": size,
			"--bg-color": color
		});
		await xRoll.initialize();
		const xDice: Record<XOrbitType, XDie[]> = Object.fromEntries(await Promise.all([
			XOrbitType.Main,
			XOrbitType.Inner,
			XOrbitType.Outer
		].map((orbitType: XOrbitType) => {
			const numDice = dice.shift();
			if (!numDice) { return Promise.resolve([]) }
			return Promise.all([orbitType, [...new Array(numDice)].map(() => FACTORIES.XDie.Make(xRoll, {
				id: "xDie",
				type: XTermType.BasicDie
			}, {}))]);
		})));
		DB.display("XROLL's XDICE", xDice);
		await Promise.all(Object.values(xDice).flat().filter((xDie) => Boolean(xDie)).map((xDie) => xDie.initialize()));
		await xRoll.addXItems(xDice);
		return xRoll;
	}
};
const TESTS = {};

export {DB as default, TESTS, DBFUNCS};
