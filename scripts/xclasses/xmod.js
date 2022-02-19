// #region ████████ IMPORTS ████████ ~
import { 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, XItem } from "../helpers/bundler.js";
class XMod extends XItem {
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
        this.termType = xOptions.type;
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-mod"]
        });
    }
    ApplyEffect(xRoll) {
        return xRoll;
    }
}
export class XGhost extends XMod {
}
export class XMutator extends XMod {
}
export class XInfo extends XMod {
}