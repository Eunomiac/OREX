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
		this.xItem = new XItem(context, {
			id: XPing.newPingID,
			classes: ["x-ping"],
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
		super(XROOT.XROOT, xOptions);
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
	ToggleTimeScale: (scaling = 0.05) => {
		if (gsap.globalTimeline.timeScale() === 1) {
			gsap.globalTimeline.timeScale(scaling);
		} else {
			gsap.globalTimeline.timeScale(1);
		}
	},
	InitializeDisplay: async (): Promise<XDisplay> => {
		const xDisplay = new XDisplay({
			id: "DISPLAY"
		});
		await xDisplay.render();
		return xDisplay;
	},
	MakeRoll: async (position: Point, size: number, dice: Record<XOrbitType,number>, dieSize = 40) => {
		const ROLL = new XRoll(XROOT.XROOT, {
			id: "ROLL",
			color: U.getRandomColor(),
			size,
			position,
			vars: {opacity: 1}
		});
		Object.entries(dice).forEach(([orbit, numDice]) => {
			ROLL.adopt(
				[...new Array(numDice)].map((_, i) => new XDie(ROLL, {type: XTermType.BasicDie, dieSize, value: U.cycleNum(i + 1, [1, 11]) as XDieValue})),
				orbit as XOrbitType
			);
		});
		await ROLL.render();
		return ROLL;
	},
	MakeFloatDice: async (numDice = 1, dieSize = 40) => {
		const makeDie = async (_: unknown, index: number) => {
			const dieColor = U.getRandomColor();
			const floatDie = new XDie(XROOT.XROOT, {
				id: "FloatDie",
				type: "BasicDie",
				value: U.cycleNum(index, [1, 11]) as XDieValue,
				dieColor,
				numColor: U.getContrastingColor(dieColor) ?? "rgba(0, 0, 0, 1)",
				dieSize,
				vars: {
					x: gsap.utils.random(200, 1400, 1),
					y: gsap.utils.random(50, 900, 1),
					opacity: 1
				}
			});
			return floatDie.render();
		};
		const FLOATDICE = await Promise.all([...new Array(numDice)].map(makeDie));
		return FLOATDICE;
	}
};
// #endregion ▄▄▄▄▄ DBFUNCS ▄▄▄▄▄

// #region ████████ DBCOMMANDS: Functions Triggered via Macro Dialogue Boxes ████████ ~
const dialogData: Record<string,any> = {
	rollSize: 200,
	dieSize: 40,
	menuQueue: [],
	queueMenu: (menu: Dialog) => dialogData.menuQueue.push(menu),
	renderNextMenu: () => {
		const nextMenu = dialogData.menuQueue.shift();
		if (nextMenu instanceof Dialog) {
			nextMenu.render(true);
		}
	},
	clearMenus: () => { dialogData.menuQueue.length = 0 }
};
const dialogMenus = {
	Position: (points: Point[], prompt = "Select position:") => new Dialog({
		"title": "Position",
		"content": `<p>${prompt}</p>`,
		"default": "",
		"buttons": Object.fromEntries(points.map(({x, y}) => {
			return [
				`${x}x${y}`,
				{
					icon: "<i class=\"fas fa-bullseye-arrow\"></i>",
					label: `${x}, ${y}`,
					callback: () => {
						dialogData.position = {x, y};
						dialogData.renderNextMenu();
					}
				}
			];
		}))
	}),
	Dice: () => {
		const html = `
		<div>
			<label>Main Dice:</label><input id="main-dice" type="number" value=0 />
			<label>Inner Dice:</label><input id="inner-dice" type="number" value=0 />
			<label>Outer Dice:</label><input id="outer-dice" type="number" value=0 />
			<label>Floating Dice:</label><input id="floating-dice" type="number" value=0 /
		</div>`;
		return new Dialog({
			"title": "Dice",
			"content": html,
			"default": "",
			"buttons": {
				submit: {
					icon: "<i class=\"fas fa-check\"></i>",
					label: "Submit",
					callback: async (elem) => {
						dialogData.rollDice = {
							[XOrbitType.Main]: U.pInt(($(elem).find("#main-dice")[0] as HTMLInputElement).value),
							[XOrbitType.Inner]: U.pInt(($(elem).find("#inner-dice")[0] as HTMLInputElement).value),
							[XOrbitType.Outer]: U.pInt(($(elem).find("#outer-dice")[0] as HTMLInputElement).value)
						};
						dialogData.floatDice = U.pInt(($(elem).find("#floating-dice")[0] as HTMLInputElement).value);
						const ROLL = await DBFUNCS.MakeRoll(
							dialogData.position,
							dialogData.rollSize,
							dialogData.rollDice,
							dialogData.dieSize
						);
						const FLOATDICE = await DBFUNCS.MakeFloatDice(dialogData.floatDice, dialogData.dieSize);
						Object.assign(globalThis, {ROLL, FLOATDICE});
					}
				}
			}
		});
	}
};
const DBCOMMANDS = {
	SpawnRoll: async (pos?: Point, dice?: number[]) => {
		if (pos) {
			dialogData.position = pos;
		} else {
			dialogData.queueMenu(dialogMenus.Position([
				{x: 300, y: 300},
				{x: 700, y: 300},
				{x: 1300, y: 300},
				{x: 300, y: 500},
				{x: 700, y: 500},
				{x: 1300, y: 500},
				{x: 300, y: 700},
				{x: 700, y: 700},
				{x: 1300, y: 700}
			]));
		}
		if (dice) {
			dialogData.rollDice = {
				[XOrbitType.Main]: U.pInt(dice[0]),
				[XOrbitType.Inner]: U.pInt(dice[1]),
				[XOrbitType.Outer]: U.pInt(dice[2])
			};
			dialogData.floatDice = U.pInt(dice[3]);
			const ROLL = await DBFUNCS.MakeRoll(
				dialogData.position,
				dialogData.rollSize,
				dialogData.rollDice,
				dialogData.dieSize
			);
			const FLOATDICE = await DBFUNCS.MakeFloatDice(dialogData.floatDice, dialogData.dieSize);
			Object.assign(globalThis, {
				ROLL,
				FLOATDICE,
				MAIN: ROLL.orbitals.get(XOrbitType.Main),
				INNER: ROLL.orbitals.get(XOrbitType.Inner),
				OUTER: ROLL.orbitals.get(XOrbitType.Outer)
			});
		} else {
			dialogData.queueMenu(dialogMenus.Dice());
		}
		dialogData.renderNextMenu();
	}
};
// #endregion ▄▄▄▄▄ DBCOMMANDS ▄▄▄▄▄

export {DB as default, DBFUNCS, DBCOMMANDS};