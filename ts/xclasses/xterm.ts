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
	XItem, XGroup, XPool, XRoll
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
import type {XItemOptions} from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

export interface XTermOptions extends XItemOptions {
	type: XTermType,
	value?: number,
	size?: number,
}

export interface XTerm {
	type: XTermType
	ApplyEffect?: (xRoll: XRoll) => XRoll
}

export const enum XTermType {
	// Can we extend XDieType here, somehow?
	BasicDie, ExpertDie, MasterDie, GobbleDie,
	BasicSet, MatchSet, RunSet, FullHouseSet,
	Difficulty, Modifier, Trait, Styler,
	Ignore
}

export interface XDieOptions extends XTermOptions {
	type: XTermType.BasicDie | XTermType.ExpertDie | XTermType.MasterDie | XTermType.GobbleDie,
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
	private _value = 0;
	protected get value$() { return $(`#${this.id} .die-val`) }

	get value() { return (this._value = this._value ?? 0) }
	set value(val: number) {
		if (val >= 0 && val <= 10) {
			this._value = val;
			if (this.isInitialized) {
				this.value$.html(this.face);
			}
		}
	}
	get face() { return [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "<span style=\"color: red;\">X</span>"][this._value]}

	get isRolled() { return this.value > 0 }

	roll() { this.value = U.randInt(1, 10) }

	constructor(xParent: XGroup | typeof XItem.XROOT, xOptions: XDieOptions) {
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
		super(xParent, xOptions);
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
	private _value = 0;
	protected get value$() { return $(`#${this.id} .die-val`) }

	get value() { return (this._value = this._value ?? 0) }
	set value(val: number) {
		this._value = val;
		if (this.isInitialized) {
			this.value$.html(`${val}`);
		}
	}

	override get xParent() {


		return <XItem>super.xParent;
	}
	override set xParent(xItem: XItem) { super.xParent = xItem }


	constructor(xParent: XGroup | typeof XItem.XROOT, xOptions: XModOptions) {
		const dieSize = xOptions.size ?? 40;
		xOptions.onRender ??= {};
		xOptions.onRender.set = {
			...{
				"--die-size": `${dieSize}px`
			},
			...xOptions.onRender.set ?? {}
		};
		xOptions.type = xOptions.type ?? XTermType.BasicDie;
		super(xParent, xOptions);
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