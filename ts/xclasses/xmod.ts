// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮ ~
	C,
	// #endregion ▮▮▮▮[Constants]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XItem, XGroup, XPool, XRoll
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

class XMod extends XItem implements XTerm {
	type: XTermType;
	static override get defaultOptions() {
		return U.objMerge(super.defaultOptions, {
			classes: ["x-mod"]
		});
	}
	declare xParent: XGroup;
	declare options: Required<XOptions.Mod>;

	constructor(xOptions: Partial<XOptions.Mod>) {
		xOptions.type ??= XTermType.Modifier;
		super(xOptions);
		this.type = this.options.type;
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
