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

class XArm extends XElem {
	// constructor(xItem, parent: XGroup)

}

export default class XGroup extends XItem {
	static override get defaultOptions(): ApplicationOptions {
		return U.objMerge(super.defaultOptions, {
			popOut: false,
			classes: U.unique([...super.defaultOptions.classes, "x-group"]),
			template: U.getTemplatePath("xitem")
		});
	}

	constructor(size: number, xOptions: XOptions) {
		super(xOptions);
		this.options.classes.unshift("x-group");
	}
}
