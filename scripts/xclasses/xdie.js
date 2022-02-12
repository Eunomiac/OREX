// #region ████████ IMPORTS ████████ ~
import { 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, XItem
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
export default class extends XItem {
    // --die-color-stroke --die-color-bg --die-size --die-color-fg
    constructor(xOptions, { color = "black", background = "white", stroke = "black", size = 40, face = " " } = {}) {
        super(xOptions);
        this._face = " ";
        this.options.classes.unshift("x-die");
        this._face = face;
        this.set({
            "--die-size": size,
            "--die-color-fg": color,
            "--die-color-bg": background,
            "--die-color-stroke": stroke
        });
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: U.unique([...super.defaultOptions.classes, "x-die"]),
            template: U.getTemplatePath("xdie")
        });
    }
    getData() {
        const context = super.getData();
        Object.assign(context, {
            value: this._face
        });
        return context;
    }
}
