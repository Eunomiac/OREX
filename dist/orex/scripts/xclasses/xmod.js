
// ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮
import { 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XItem, XTermType
 } from "../helpers/bundler.js";
class XMod extends XItem {
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
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
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
        this.type = this.options.type;
    }
    type;
    ApplyEffect(xRoll) {
        return xRoll;
    }
}