// #region ████████ IMPORTS ████████ ~
import { 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XItem
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
class XArm extends XItem {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            popOut: false,
            classes: ["x-arm"]
        });
    }
}
export default class XGroup extends XItem {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            popOut: false,
            classes: ["x-group"]
        });
    }
    constructor(options) {
        options.template = U.getTemplatePath("xgroup.hbs");
        super(options);
    }
}
