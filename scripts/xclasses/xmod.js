// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #endregion ▮▮▮▮[Constants]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, XItem } from "../helpers/bundler.js";
class XMod extends XItem {
    type;
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-mod"]
        });
    }
    constructor(xParent, xOptions, onRenderOptions) {
        super(xParent, xOptions, onRenderOptions);
        this.type = xOptions.type;
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