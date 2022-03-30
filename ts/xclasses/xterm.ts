// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ====== GreenSock Animation ====== ~
	gsap,
	Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools,
	RoughEase,
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XROOT, XItem, XGroup, XPool, XRoll
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
import type {XItemOptions} from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

export interface XTermOptions extends XItemOptions {
	type: XTermType,
	size?: number,
}

export interface XTerm {
	type: XTermType,
	xParent: XItem | XROOT,
	// THIS SHIT IS WRONG AND BAD: NEED TO ACCOUNT FOR OTHER TYPES OF VALUES
	value?: XDieValue,
	ApplyEffect?: (xRoll: XRoll) => XRoll,
	readonly isFreezingRotate: true
}

export const enum XTermType {
	// Can we extend XDieType here, somehow?
	BasicDie, ExpertDie, MasterDie, GobbleDie,
	BasicSet, MatchSet, RunSet, FullHouseSet,
	Difficulty, Modifier, Trait, Styler,
	Ignore
}

export type XDieFace = " " | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "X";
export type XDieValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface XDieOptions extends XTermOptions {
	type: XTermType.BasicDie | XTermType.ExpertDie | XTermType.MasterDie | XTermType.GobbleDie,
	value?: XDieValue,
	color?: string,
	numColor?: string,
	strokeColor?: string,
}

export default class XDie extends XItem implements XTerm {

	protected static override REGISTRY: Map<string, XDie> = new Map();
	type: XDieOptions["type"];
	static override get defaultOptions() {
		return U.objMerge(super.defaultOptions, {
			classes: ["x-die"],
			template: U.getTemplatePath("xdie"),
			onRender: {
				set: {
					fontSize: "calc(1.2 * var(--die-size))",
					fontFamily: "Oswald",
					textAlign: "center"
				}
			}
		});
	}

	override readonly isFreezingRotate = true;
	protected get value$() { return $(`#${this.id} .die-val`) }

	#value: XDieValue = 0;
	get value() { return this.#value }
	set value(val: XDieValue) {
		if (val && val > 0 && val <= 10) {
			this.#value = val;
			if (this.isInitialized) {
				this.value$.html(this.face);
			}
		}
	}
	get face(): XDieFace { return [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "X"][this.#value] as XDieFace }

	get isRolled() { return this.value > 0 }

	roll() { this.value = U.randInt(1, 10) as XDieValue }

	constructor(xOptions: XDieOptions, xParent: XGroup | XROOT = XItem.XROOT) {
		const dieSize = xOptions.size ?? 40;
		xOptions.onRender ??= {};
		xOptions.onRender.set = {
			...{
				"--die-size": `${dieSize}px`,
				"--die-color-fg": xOptions.numColor ?? "black",
				"--die-color-bg": xOptions.color ?? "white",
				"--die-color-stroke": xOptions.strokeColor ?? "black"
			},
			...xOptions.onRender.set ?? {}
		};
		xOptions.type = xOptions.type ?? XTermType.BasicDie;
		super(xOptions, xParent);
		this.value = xOptions.value ?? 0;
		this.type = xOptions.type;
	}

	override getData() {
		const context = super.getData();
		const faceNum = this.value === 10 ? 0 : (this.value || " ");

		Object.assign(context, {
			value: faceNum
		});

		return context;
	}
}

export interface XModOptions extends XTermOptions {
	type: XTermType.Difficulty | XTermType.Modifier | XTermType.Trait
}
export class XMod extends XItem implements XTerm {

	protected static override REGISTRY: Map<string, XMod> = new Map();
	type: XModOptions["type"];
	static override get defaultOptions() {
		return U.objMerge(super.defaultOptions, {
			classes: ["x-mod"],
			template: U.getTemplatePath("xmod"),
			onRender: {
				set: {
					fontSize: "calc(1.2 * var(--die-size))",
					fontFamily: "Oswald",
					textAlign: "center"
				}
			}
		});
	}
	override readonly isFreezingRotate = true;

	private _value: XDieValue = 0;
	protected get value$() { return $(`#${this.id} .die-val`) }

	get value() { return (this._value = this._value ?? 0) }
	set value(val: XDieValue) {
		this._value = val;
		if (this.isInitialized) {
			this.value$.html(`${val}`);
		}
	}

	constructor(xOptions: XModOptions, xParent: XItem | XROOT = XItem.XROOT) {
		const dieSize = xOptions.size ?? 40;
		xOptions.onRender ??= {};
		xOptions.onRender.set = {
			...{
				"--die-size": `${dieSize}px`
			},
			...xOptions.onRender.set ?? {}
		};
		xOptions.type = xOptions.type ?? XTermType.BasicDie;
		super(xOptions, xParent);
		// this.value = xOptions.value ?? 0;
		this.type = xOptions.type;
	}

	override getData() {
		const context = super.getData();
		const faceNum = this.value === 10 ? 0 : (this.value || " ");

		Object.assign(context, {
			value: faceNum
		});

		return context;
	}
}