// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #endregion ▮▮▮▮[Constants]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XItem, XTermType
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮
class XMod extends XItem {
    // #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
    static get defaultOptions() {
        const defaultXOptions = {
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
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    // #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
        this.type = this.options.type;
    }
    type;
    ApplyEffect(xRoll) {
        return xRoll;
    }
}