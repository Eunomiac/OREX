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

export default class extends XItem {
	protected _face: string | number = " ";
	static override get defaultOptions(): ApplicationOptions {
		return U.objMerge(super.defaultOptions, {
			popOut: false,
			classes: U.unique([...super.defaultOptions.classes, "x-die"]),
			template: U.getTemplatePath("xdie")
		});
	}
	// --die-color-stroke --die-color-bg --die-size --die-color-fg
	constructor(xOptions: XOptions, {color = "black", background = "white", stroke = "black", size = 40, face = <number|string>" "} = {}) {
		super(xOptions);
		this.options.classes.unshift("x-die");
		this._face = face;
		this.set({
			"--die-size": size,
			"--die-color-fg": color,
			"--die-color-bg": background,
			"--die-color-stroke": stroke
		});
	}

	override getData() {
		const context = super.getData();

		Object.assign(context, {
			value: this._face
		});

		return context;
	}
}