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
export default class extends XItem {
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: U.unique([...super.defaultOptions.classes, "x-die"]),
            template: XElem.getTemplatePath("xdie")
        });
    }
    constructor(options = {}, parent) {
        var _a;
        options.classes = ["x-die", ...(_a = options.classes) !== null && _a !== void 0 ? _a : []];
        super(options, parent);
    }
    getData() {
        const context = super.getData();
        Object.assign(context, {
            value: U.randInt(1, 10)
        });
        return context;
    }
}
