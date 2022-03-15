// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
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
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export interface XTermOptions extends XItemOptions {
	type: XTermType,
	value?: number,
	size?: number,
}

export const enum XTermType {
	BasicDie, ExpertDie, MasterDie, GobbleDie,
	BasicSet, MatchSet, RunSet, FullHouseSet,
	Difficulty, Modifier, Trait, Styler
}

export interface XTerm {
	termType: XTermType
	ApplyEffect(xRoll: XRoll): XRoll
}

export interface XDieOptions extends XTermOptions {
	color?: string,
	numColor?: string,
	strokeColor?: string,
}

export default class XDie extends XItem implements XTerm {
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

	public get value() { return (this._value = this._value ?? 0) }
	public set value(val: number) {
		if (val >= 0 && val <= 10) {
			this._value = val;
			if (this.isInitialized) {
				this.value$.html(this.face);
			}
		}
	}
	public get face() { return [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "<span style=\"color: red;\">X</span>"][this._value]}
	termType: XTermType;

	public get isRolled() { return this.value > 0 }

	public roll() { this.value = U.randInt(1, 10) }

	public override get xParent() { return <XItem>super.xParent }
	public override set xParent(xItem: XItem) { super.xParent = xItem }


	constructor(xParent: XGroup | typeof XItem.XROOT, xOptions: XDieOptions) {
		const dieSize = xOptions.size ?? 40;
		xOptions.id = `${xOptions.id}-${U.getUID()}`;
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
		super(xParent, xOptions);
		this.value = xOptions.value ?? 0;
		this.termType = xOptions.type;
	}

	public ApplyEffect(xRoll: XRoll) {
		return xRoll;
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