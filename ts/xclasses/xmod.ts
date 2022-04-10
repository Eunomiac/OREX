// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮ ~
	C,
	// #endregion ▮▮▮▮[Constants]▮▮▮▮
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
	XElem, XItem, XGroup, XPool, XRoll,
	XTermType
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
import type {XTerm, XTermOptions} from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

export interface XModOptions extends XTermOptions {
	value?: number;
}

class XMod extends XItem implements XTerm {
	type: XTermType;
	static override get defaultOptions() {
		return U.objMerge(super.defaultOptions, {
			classes: ["x-mod"]
		});
	}
	declare xParent: XGroup;

	constructor(xParent: XPool, xOptions: XModOptions, onRenderOptions: Partial<gsap.CSSProperties>) {
		super(xParent, xOptions, onRenderOptions);
		this.type = xOptions.type;
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
