// #region ████████ IMPORTS ████████ ~
import { 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, XItem
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
export default class extends XItem {
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: U.unique([...super.defaultOptions.classes, "x-die"]),
            template: U.getTemplatePath("xdie")
        });
    }
    constructor(xOptions) {
        super(xOptions);
        this.options.classes.unshift("x-die");
    }
    getData() {
        const context = super.getData();
        Object.assign(context, {
            value: U.randInt(1, 10)
        });
        return context;
    }
}
