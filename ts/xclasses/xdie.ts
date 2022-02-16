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
	XElem, XItem
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
import type {XItemOptions} from "../xclasses/xitem.js";

export interface XDieOptions extends XItemOptions {
	value?: number,
	color?: string,
	numColor?: string,
	strokeColor?: string,
	size?: number
}
export default class XDie extends XItem {
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-die"], template: U.getTemplatePath("xdie")}) }
	public value: number | null;

	public override get parent() { return <XItem>super.parent }
	public override set parent(xItem: XItem) { super.parent = xItem }
	constructor(xOptions: XDieOptions) {
		const dieSize = xOptions.size ?? 50;
		xOptions = {
			id: `x-die-${U.getUID()}`,
			value: xOptions.value,
			parent: xOptions.parent,
			onRender: {
				set: {
					"xPercent": -50,
					"yPercent": -50,
					"x": 0,
					"y": 0,
					"fontSize": 1.2 * dieSize,
					"fontFamily": "Oswald",
					"textAlign": "center",
					"--die-size": `${dieSize}px`,
					"--die-color-fg": xOptions.numColor ?? "black",
					"--die-color-bg": xOptions.color ?? "white",
					"--die-color-stroke": xOptions.strokeColor ?? "black"
				}
			}
		};
		super(xOptions);
		this.value = xOptions.value ?? null;
	}

	override getData() {
		const context = super.getData();

		Object.assign(context, {
			value: this.value ?? " "
		});

		return context;
	}
}