// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮ ~
	C,
	// #endregion ▮▮▮▮[Constants]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XItem, XGroup, XPool, XRoll, XTermType
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

class XMod extends XItem implements XTerm {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Mod> {

		const defaultXOptions: Required<XOptions.Mod> = {
			id: U.getUID("XMOD"),
			classes: ["x-mod"],
			template: U.getTemplatePath("xmod"),
			isFreezingRotate: true,
			type: XTermType.Modifier,
			value: 0,
			vars: {
				fontSize: "calc(1.2 * var(--die-size))",
				fontFamily: "Oswald",
				textAlign: "center"
			}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XMod> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Mod>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XParent, xOptions: XOptions.Mod) {
		super(xParent, xOptions);
		this.type = this.options.type;
	}

	type: XTermType;

	ApplyEffect(xRoll: XRoll) {
		return xRoll;
	}
}


