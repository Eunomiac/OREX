// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
// #region ▮▮▮▮▮▮▮ External Libraries ▮▮▮▮▮▮▮ ~
// #region ====== GreenSock Animation ====== ~
import {
	default as gsap,
	MotionPathPlugin,
	GSDevTools
} from "gsap/all";
// #endregion ___ GreenSock Animation ___
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
import {
	C, U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XROOT, XItem,
	XOrbitType, XTermType,
	XGroup, XPool,
	XDie, XRoll
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "./bundler.js";
gsap.registerPlugin(GSDevTools);
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
	static async Make(point: Point, label: string, context = XROOT.XROOT, color = "random") {
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
	context: XParent;

	constructor(point: Point, label: string, context:XParent = XROOT.XROOT, color = "random") {
		this.color = color === "random" ? U.randElem(Object.keys(C.colors)) : color;
		this.xItem = new XItem({
			id: XPing.newPingID,
			classes: ["x-ping"],
			xParent: context,
			vars: {
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
			}
		});
		this.label = label;
		this.point = point;
		this.context = context;
	}

	async initialize() {
		await this.xItem.render();
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
			xItem.origin
		);
		const global = MotionPathPlugin.convertCoordinates(
			xItem.elem,
			XROOT.XROOT.elem,
			xItem.origin
		);
		let xName = xItem.id.replace(/_.*$/u, "");
		if (xName in posData) {
			xName += `_${Object.keys(posData).length}`;
		}
		posData[xName] = {
			local: `{x: ${U.roundNum(xItem.pos.x)}, y: ${U.roundNum(xItem.pos.y)}, rot: ${U.roundNum(xItem.rotation)}}`,
			origin: `{x: ${U.roundNum(xItem.origin.x)}, y: ${U.roundNum(xItem.origin.y)}}`,
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

// #region ████████ XDisplay: Real-Time Display of Debug Watch Variables to DOM ████████ ~
export type WatchFunc = (timeStamp: DOMHighResTimeStamp) => void;
export type StepFunc = (xItem: XItem) => string;

interface InitialWatchData {
	label: string,
	stepFunc: StepFunc,
	styles?: Partial<gsap.CSSProperties>
}
interface WatchTerm extends InitialWatchData {
	id: string
}

export class XDisplay extends XItem {

	static Display: XDisplay;
	static Kill() {
		if (XDisplay.Display?.displayFunc) {
			gsap.ticker.remove(XDisplay.Display.displayFunc);
		}
		XDisplay.Display.elem$.remove();
	}
	static override REGISTRY: Map<string, XDisplay> = new Map();
	static override get defaultOptions() {
		return U.objMerge(super.defaultOptions, {
			template: U.getTemplatePath("xdisplay"),
			classes: ["x-display"]});
	}
	declare xParent: XROOT;

	#watchData: Map<WatchTerm["id"],Omit<WatchTerm,"stepFunc">> = new Map();
	#stepFuncs: Map<WatchTerm["id"],StepFunc> = new Map();
	get watchData() { return this.#watchData }
	constructor(xOptions: Partial<XOptions.Item>) {
		xOptions.xParent = XROOT.XROOT;
		super(xOptions);
	}

	#watchItems: Map<string,XItem> = new Map();
	addWatchItem(label: string, xItem: XItem) {
		this.#watchItems.set(label, xItem);
		this.elem$.find(".x-watch-item-labels").append(`<th>${label}</th>`);
		for (const funcName of this.#watchFuncs.keys()) {
			this.elem$.find(`.x-func-${funcName}`).append(`<td id="x-data-${label}-${funcName}"></td>`);
		}
	}
	#watchFuncs: Map<string,StepFunc> = new Map();
	addWatchFunc(label: string, func: StepFunc) {
		this.#watchFuncs.set(label, func);
		this.elem$.append(`<tr class=".x-func-${label}"><th>${label}</th>${
			Array.from(this.#watchItems.keys()).map((itemId) => `<td id="x-data-${itemId}-${label}"></td>`)
		}</tr>`);
	}

	get itemLabels() { return Array.from(this.#watchItems.keys()) }
	get watchLabels() { return Array.from(this.#watchFuncs.keys()) }
	get numDataCols() { return this.#watchItems.size }
	get numDataRows() { return this.#watchFuncs.size }

	override getData() {
		const context = super.getData();
		const watchData = {
			colHeaders: ["", ...this.itemLabels],
			rowLabels: this.watchLabels
		};
		Object.assign(context, watchData);
		return context;
	}

	displayFunc?:WatchFunc;

	override async render(): Promise<this> {
		await super.render();
		const self = this;
		this.displayFunc = function updateDisplay() {
			self.#watchItems.forEach((item, itemId) => {
				self.#watchFuncs.forEach((func, funcId) => {
					$(`#x-data-${itemId}-${funcId}`).text(func(item));
				});
			});
		};
		gsap.ticker.add(this.displayFunc);
		DB.display("X-DISPLAY INITIALIZED", this);
		XDisplay.Display = this;
		return this;
	}
}
// #endregion ▄▄▄▄▄ XDisplay ▄▄▄▄▄

// #region ████████ DBFUNCS: Miscellaneous Debugging Functions ████████ ~
const DB_SETTINGS:Record<string,unknown> = {};
const DBFUNCS = {
	GSDevTools,
	getRollPos: (pos: 0 | 1 | 2 | 3 | 4, size: number): Point => {
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
	},
	DB_Set: (key: string, val: unknown) => {
		DB_SETTINGS[key] = val;
	},
	InitializeDisplay: async (): Promise<XDisplay> => {
		const xDisplay = new XDisplay({
			id: "DISPLAY",
			xParent: XROOT.XROOT
		});
		await xDisplay.render();
		return xDisplay;
	}
};
// #endregion ▄▄▄▄▄ DBFUNCS ▄▄▄▄▄

// #region 🟩🟩🟩 TEST CASES 🟩🟩🟩
// const TESTS = {
// 	XArmSnapping: async () => {
// 		DB.display("XArm Snap Test Initializing ...");

// 		DB.groupTitle("Creating 'TestDie' and 'FloatingDice'");
// 		const TestIndex = 1;
// 		const diePromises = await Promise.all([
// 			{x: 300, y: 200},
// 			{x: 200, y: 200},
// 			{x: 400, y: 700},
// 			{x: 800, y: 400},
// 			{x: 800, y: 700},
// 			{x: 50, y: 500}
// 		].map((dieParams, i) => FACTORIES.XDie.Make(XROOT.XROOT, {
// 			id: i === TestIndex ? "TestDie" : `F-Die-${i}`,
// 			type: XTermType.BasicDie,
// 			color: i === TestIndex ? "darkgreen" : "blue",
// 			strokeColor: i === TestIndex ? "lime" : "cyan",
// 			numColor: i === TestIndex ? "lime" : "cyan",
// 			value: i as XDieValue
// 		}, {
// 			...dieParams
// 		})));

// 		const TestDie = diePromises[TestIndex];
// 		const FloatingDice = [
// 			...diePromises.slice(0, TestIndex),
// 			...diePromises.slice(TestIndex + 1)
// 		];

// 		DB.groupLog("Initializing 'TestDie' and 'FloatingDice'");
// 		// await Promise.all([TestDie, ...FloatingDice].map((die) => die.initialize()));
// 		DB.groupEnd();

// 		DB.groupLog("Creating 'MainRoll'");
// 		const MainRoll = await FACTORIES.XRoll.Make(
// 			XROOT.XROOT,
// 			{id: "Roll"},
// 			{
// 				x: 500,
// 				y: 400,
// 				height: 200,
// 				width: 200
// 			}
// 		);
// 		DB.groupEnd();
// 		DB.groupLog("Creating MainRoll Dice");
// 		const Die = await FACTORIES.XDie.Make(XROOT.XROOT, {
// 			id: "Roll-Die",
// 			type: XTermType.BasicDie,
// 			color: "white",
// 			numColor: "darkred",
// 			strokeColor: "darkred",
// 			value: 1
// 		});
// 		const RollDice = await Promise.all([
// 			"yellow",
// 			"orange",
// 			"crimson",
// 			"lime",
// 			"cyan"
// 		].map((color, i) => FACTORIES.XDie.Make(XROOT.XROOT, {
// 			id: "Roll-Die",
// 			type: XTermType.BasicDie,
// 			color,
// 			value: i+2 as XDieValue
// 		})));
// 		DB.groupEnd();
// 		DB.groupLog("Initializing MainRoll");
// 		// await MainRoll.initialize();
// 		DB.groupEnd();

// 		DB.groupLog("Adding Dice");
// 		await MainRoll.addXItems({[XOrbitType.Main]: [Die, ...RollDice]});
// 		DB.groupEnd();
// 		DB.groupDisplay("Fetching Arm");
// 		const Orbit = MainRoll.orbitals.get(XOrbitType.Main)!;
// 		const [Arm] = Orbit.arms;
// 		DB.log("XArm", Arm);
// 		DB.groupEnd();
// 		const dbDisplay = XDisplay.Display;
// 		[Die, ...RollDice].forEach((xDie) => {
// 			const xArm = xDie.xParent;
// 			dbDisplay.addWatchItem(`${xDie.value}`, xArm);
// 		});
// 		TestDie.set({"--die-color-bg": "red"});

// 		XDisplay.Kill();
// 		/* dbDisplay.addWatchFunc("Widths", (xItem) => `${U.pInt(xItem.width)}`);
// 		dbDisplay.addWatchFunc("Local_o", (xItem) => `${U.pInt(xItem.rotation)}`);
// 		dbDisplay.addWatchFunc("Globalo", (xItem) => `${U.pInt(xItem.global.rotation)}`);
// 		// dbDisplay.addWatchFunc("4-RelPos", (xItem) => {
// 		// 	const {x, y} = MotionPathPlugin.getRelativePosition(xItem.xParent!.elem, TestDie.elem, [0.5, 0.5], [0.5, 0.5]);
// 		// 	return `[${U.pInt(x)}, ${U.pInt(y)}]`;
// 		// });
// 		dbDisplay.addWatchFunc("4-RelAng", (xItem) => {
// 			const {x, y} = MotionPathPlugin.getRelativePosition(xItem.xParent!.elem, TestDie.elem, [0.5, 0.5], [0.5, 0.5]);
// 			return `${U.pInt(U.getAngle({x: 0, y: 0}, {x, y}, undefined, [-180, 180]))}`;
// 		});
// 		dbDisplay.addWatchFunc("4-AdjCurAng", (xItem) => `${U.pInt(U.cycleAngle(xItem.global.rotation - 180, [-180, 180]))}`);
// 		dbDisplay.addWatchFunc("4-AngDelt", (xItem) => {
// 			const {x, y} = MotionPathPlugin.getRelativePosition(xItem.xParent!.elem, TestDie.elem, [0.5, 0.5], [0.5, 0.5]);
// 			const angleToFloat = U.pInt(U.getAngle({x: 0, y: 0}, {x, y}, undefined, [-180, 180]));
// 			return `${U.pInt(U.getAngleDelta(U.cycleAngle(xItem.global.rotation - 180, [-180, 180]), angleToFloat, [-180, 180]))}`;
// 		}); */
// 		// dbDisplay.addWatchFunc("gRWT-4", (xItem) => `${U.pInt(xItem.rotation)}>${U.pInt((xItem as XArm).getRotWidthToItem(TestDie).rotation)}`);

// 		// const dbDisplay = await FACTORIES.XDisplay.Make(XROOT.XROOT, {watchData: [
// 		// 	// {label: "Widths ", target: Orbit, watch: () => Orbit.arms.map((xArm, i) => `<span style="color: ${(xArm.xItem as XDie).xOptions.color};">[${i+1}]</span> ${U.pad(U.pInt(xArm.width),5, "&nbsp;")}`).join("\t")},
// 		// 	{label: "Weights", target: Orbit, watch: () => Orbit.arms.map((xArm, i) => `<span style="color: ${(xArm.xItem as XDie).xOptions.color};">[${i+1}]</span>${U.pad(U.pInt(xArm.heldItemSize),3, "&nbsp;")}&nbsp;&nbsp;&nbsp;`).join("\t")},
// 		// 	{label: "Local °", target: Orbit, watch: () => Orbit.arms.map((xArm, i) => `<span style="color: ${(xArm.xItem as XDie).xOptions.color};">[${i+1}]</span>${U.pad(U.pInt(xArm.rotation),3, "&nbsp;")}&nbsp;&nbsp;&nbsp;`).join("\t")},
// 		// 	// {label: "ORBIT °", target: Orbit, watch: () => `Local: ${U.signNum(U.pInt(Orbit.rotation))}, Global: ${U.signNum(U.pInt(Orbit.global.rotation))}`},
// 		// 	{label: "Global°", target: Orbit, watch: () => Orbit.arms.map((xArm, i) => `<span style="color: ${(xArm.xItem as XDie).xOptions.color};">[${i+1}]</span>${U.pad(U.pInt(xArm.global.rotation),3, "&nbsp;")}&nbsp;&nbsp;&nbsp;`).join("\t")},
// 		// 	// For each arm and FloatingDie[3] (value = "4"):
// 		// 	{label: "F-Global°", target: Orbit, watch: () => Orbit.arms.map((xArm, i) => `<span style="color: ${(xArm.xItem as XDie).xOptions.color};">[${i+1}]</span>${U.pad(U.pInt(xArm.getRotWidthToItem(FloatingDice[3]).rotation),3, "&nbsp;")}&nbsp;&nbsp;&nbsp;`).join("\t")},

// 		// ]});
// 		// dbDisplay.initialize();
// 		// const getPosData = () => {
// 		// 	const posData: Record<string, any> = {};
// 		// 	[ainRoll",Orbit", "Arm"].forEach((xName) => {
// 		// 		// @ts-expect-error Debugging.
// 		// 		const xItem = T[xName] as XItem;
// 		// 		const xParent = xItem.xParent as XItem;
// 		// 		const parent = MotionPathPlugin.convertCoordinates(
// 		// 			xItem.elem,
// 		// 			xParent.elem,
// 		// 			xItem.xElem.origin
// 		// 		);
// 		// 		const global = MotionPathPlugin.convertCoordinates(
// 		// 			xItem.elem,
// 		// 			XROOT.XROOT.elem,
// 		// 			xItem.xElem.origin
// 		// 		);
// 		// 		posData[xName] = {
// 		// 			local: `{x: ${U.roundNum(xItem.pos.x)}, y: ${U.roundNum(xItem.pos.y)}, rot: ${U.roundNum(xItem.rotation)}}`,
// 		// 			origin: `{x: ${U.roundNum(xItem.xElem.origin.x)}, y: ${U.roundNum(xItem.xElem.origin.y)}}`,
// 		// 			parent: `{x: ${U.roundNum(parent.x)}, y: ${U.roundNum(parent.y)}}`,
// 		// 			global: `{x: ${U.roundNum(global.x)}, y: ${U.roundNum(global.y)}, rot: ${U.roundNum(xItem.global.rotation)}}`
// 		// 		};
// 		// 	});
// 		// 	console.log(JSON.stringify(posData, null, 2).replace(/"/g, ""));
// 		// };


// 		Object.assign(globalThis, {
// 			ROLL: MainRoll,
// 			DICE: Object.fromEntries(FloatingDice.map((die) => [`${die.value}`, die])),
// 			TestDie,
// 			ROLLDICE: [Die, ...RollDice],
// 			Orbit, getPosData, dbDisplay});

// 		DB.log("Setup Complete.");
// 		DB.groupDisplay("Starting Timeouts...");
// 		await U.sleep(U.randInt(1, 5));
// 		DB.groupEnd();
// 		DB.groupEnd();
// 		// await U.sleep(10);
// 		// DB.log("Slowing Timeline");
// 		// gsap.globalTimeline.timeScale(0.01);
// 		// getPosData();
// 	}
// };
// #region ====== TESTS ARCHIVE ====== ~
// const TESTS_ARCHIVE = {
// 	nestedPositionTest: async () => {
// 		const TranslateBox = await FACTORIES.XPool.Make(XROOT.XROOT, {
// 			id: "translate-box",
// 			classes: ["translate-box"]
// 		}, {xPercent: 0, yPercent: 0});
// 		// await TranslateBox.initialize();
// 		TranslateBox.to({
// 			x: "+=500",
// 			duration: 5,
// 			ease: "power3.inOut",
// 			repeat: -1,
// 			yoyo: true
// 		});
// 		const ScaleBox = await FACTORIES.XGroup.Make(TranslateBox, {
// 			id: "scale-box-1",
// 			classes: ["scale-box"]
// 		}, {
// 			xPercent: 0,
// 			yPercent: 0
// 		});
// 		// await ScaleBox.initialize();
// 		ScaleBox.to({
// 			scale: 2,
// 			duration: 15,
// 			ease: "sine.inOut",
// 			repeat: -1,
// 			yoyo: true
// 		});
// 		const ExtraScaleBox = await FACTORIES.XGroup.Make(ScaleBox, {
// 			id: "scale-box-2",
// 			classes: ["extra-scale-box"]
// 		}, {
// 			xPercent: 0,
// 			yPercent: 0
// 		});
// 		// await ExtraScaleBox.initialize();
// 		ExtraScaleBox.to({
// 			scale: 3,
// 			duration: 5,
// 			ease: "sine.inOut",
// 			repeat: -1,
// 			yoyo: true
// 		});
// 		const RotateBox = await FACTORIES.XGroup.Make(ExtraScaleBox, {
// 			id: "rotate-box-1",
// 			classes: ["rotate-box"]
// 		}, {
// 			xPercent: 0,
// 			yPercent: 0
// 		});
// 		// await RotateBox.initialize();
// 		RotateBox.to({
// 			rotation: "+=360",
// 			duration: 2,
// 			ease: "none",
// 			repeat: -1
// 		});
// 		const CounterRotateBox = await FACTORIES.XGroup.Make(RotateBox, {
// 			id: "rotate-box-2",
// 			classes: ["rotate-box"]
// 		}, {
// 			xPercent: 0,
// 			yPercent: 0
// 		});
// 		// await CounterRotateBox.initialize();
// 		CounterRotateBox.to({
// 			rotation: "-=360",
// 			duration: 2,
// 			ease: "power4.inOut",
// 			repeat: -1
// 		});
// 		// await Promise.all([TranslateBox, ScaleBox, ExtraScaleBox, RotateBox, CounterRotateBox].map((xItem) => xItem.initialize()));

// 		const TestDie = await FACTORIES.XGroup.Make(CounterRotateBox, {id: "test-die"}, {height: 40, width: 40, background: "lime"});

// 		const dieMarkers = await Promise.all([
// 			{x: 0.5, y: 0, background: "yellow"},
// 			{x: 0, y: 1, background: "cyan"},
// 			{x: 1, y: 1, background: "magenta"}
// 		].map(({x, y, background}, i) => FACTORIES.XItem.Make(TestDie, {
// 			id: `die-marker-${i + 1}`,
// 			classes: ["x-marker"]
// 		}, {
// 			height: 10,
// 			width: 10,
// 			x: x * 50,
// 			y: y * 50,
// 			background
// 		})));

// 		// await Promise.all(dieMarkers.map((marker) => marker.initialize()));

// 		const xMarkers = await Promise.all(["yellow", "cyan", "magenta"]
// 			.map((background, i) => FACTORIES.XItem.Make(XROOT.XROOT, {
// 				id: `x-marker-${i + 1}`,
// 				classes: ["x-marker"]
// 			}, {
// 				height: 10,
// 				width: 10,
// 				x: 100 + (20 * i),
// 				y: 500 + (40 * i),
// 				background
// 			})));

// 		// await Promise.all(xMarkers.map((marker) => marker.initialize()));

// 		xMarkers.forEach((marker, i) => marker.set(dieMarkers[i].pos));

// 		DB.log("Test Die Objs =>", dieMarkers, xMarkers, TranslateBox, ScaleBox, RotateBox, TestDie);
// 	}
// };
// #endregion ___ TESTS ARCHIVE ___
// #endregion 🟩🟩🟩 TEST CASES 🟩🟩🟩

export {DB as default, DBFUNCS};