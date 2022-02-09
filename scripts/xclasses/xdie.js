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
export default class extends XItem {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            popOut: false,
            classes: ["x-die"],
            template: U.getTemplatePath("xdie.hbs")
        });
    }
    getData() {
        const context = super.getData();
        Object.assign(context, {
            value: U.randInt(1, 10)
        });
        return context;
    }
}
