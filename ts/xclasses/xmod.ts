// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮ ~
	C,
	// #endregion ▮▮▮▮[Constants]▮▮▮▮
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
	XElem, XItem, XPool, XRoll,
	XTermType
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
import type {XTerm, XTermOptions} from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export interface XModOptions extends XTermOptions {
	value?: number;
}

class XMod extends XItem implements XTerm {
	static override get defaultOptions() {
		return U.objMerge(super.defaultOptions, {
			classes: ["x-mod"]
		});
	}

	termType: XTermType;

	constructor(xParent: XPool, xOptions: XModOptions) {
		super(xParent, xOptions);
		this.termType = xOptions.type;
	}

	ApplyEffect(xRoll: XRoll) {
		return xRoll;
	}

}

export class XGhost extends XMod {

}

export class XMutator extends XMod {

}

export class XInfo extends XMod {

}
