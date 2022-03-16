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

class XTerm extends XItem {
	static override get defaultOptions() {
		return U.objMerge(super.defaultOptions, {classes: ["x-term"]});
	}

	protected _termType: XTermType;
	public get type() { return this._termType }
	public ApplyEffect(xRoll: XRoll) {
		return xRoll;
	}

	constructor(xParent: XGroup | typeof XItem.XROOT, xOptions: XTermOptions) {
		super(xParent, xOptions);
		this._termType = xOptions.type;
	}
}
export interface XDieOptions extends XTermOptions {
	color?: string,
	numColor?: string,
	strokeColor?: string,
}

export default class XDie extends XTerm {
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
	public value = 0;
	termType: XTermType;

	public get isRolled() { return this.value > 0 }

	public roll() { return (this.value = U.randInt(1, 10)) }

	public override get xParent() { return <XItem>super.xParent }
	public override set xParent(xItem: XItem) { super.xParent = xItem }
	constructor(xParent: XGroup, xOptions: XDieOptions) {
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
		xOptions.type = xOptions.type ?? XTermType.BasicDie;
		super(xParent, xOptions);
		this.value = xOptions.value ?? 0;
		this.termType = xOptions.type;
	}

	override getData() {
		const context = super.getData();

		Object.assign(context, {
			value: this.value ?? " "
		});

		return context;
	}
}