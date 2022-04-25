// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #endregion ▮▮▮▮[Constants]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XItem } from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮
class XMod extends XItem {
    type;
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-mod"]
        });
    }
    constructor(xOptions) {
        xOptions.type ??= XTermType.Modifier;
        super(xOptions);
        this.type = this.options.type;
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