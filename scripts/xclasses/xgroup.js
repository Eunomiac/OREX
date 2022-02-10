// #region ████████ IMPORTS ████████ ~
import { 
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
}
export default class XGroup extends XItem {
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: U.unique([...super.defaultOptions.classes, "x-group"]),
            template: XElem.getTemplatePath("xitem")
        });
    }
    constructor(options, parent = XItem.XROOT) {
        var _a;
        options.classes = ["x-group", ...(_a = options.classes) !== null && _a !== void 0 ? _a : []];
        super(options, parent);
    }
}
