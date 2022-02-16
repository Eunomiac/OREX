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
	public value: number | null;
	static override get defaultOptions(): ApplicationOptions {
		return U.objMerge(super.defaultOptions, {
			popOut: false,
			classes: U.unique([...super.defaultOptions.classes, "x-die"]),
			template: U.getTemplatePath("xdie")
		});
	}

	public override get parent() { return <XItem>super.parent }
	constructor(xOptions: XDieOptions) {
		const dieSize = xOptions.size ?? 50;
		const fontSize = dieSize * 1.2;
		const value = xOptions.value ?? null;
		xOptions = {
			id: xOptions.id,
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