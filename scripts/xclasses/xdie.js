// #region ████████ IMPORTS ████████ ~
import { 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, XItem
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "../helpers/bundler.js";
export default class XDie extends XItem {
    constructor(xOptions) {
        var _a, _b, _c, _d, _e, _f;
        const dieSize = (_a = xOptions.size) !== null && _a !== void 0 ? _a : 50;
        const fontSize = dieSize * 1.2;
        const value = (_b = xOptions.value) !== null && _b !== void 0 ? _b : null;
        xOptions = {
            value: xOptions.value,
            parent: xOptions.parent,
            noImmediateRender: true,
            onRender: {
                set: {
                    "xPercent": -50,
                    "yPercent": -50,
                    "x": 0,
                    "y": 0,
                    "fontSize": 1.2 * dieSize,
                    "fontFamily": "Oswald",
                    "textAlign": "center",
                    "--die-size": `${dieSize}px`,
                    "--die-color-fg": (_c = xOptions.numColor) !== null && _c !== void 0 ? _c : "black",
                    "--die-color-bg": (_d = xOptions.color) !== null && _d !== void 0 ? _d : "white",
                    "--die-color-stroke": (_e = xOptions.strokeColor) !== null && _e !== void 0 ? _e : "black"
                }
            }
        };
        super(xOptions);
        this.options.classes.unshift("x-die");
        this.xOptions = xOptions;
        this.value = (_f = xOptions.value) !== null && _f !== void 0 ? _f : null;
        this.asyncRender();
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: U.unique([...super.defaultOptions.classes, "x-die"]),
            template: U.getTemplatePath("xdie")
        });
    }
    getData() {
        var _a;
        const context = super.getData();
        Object.assign(context, {
            value: (_a = this.value) !== null && _a !== void 0 ? _a : " "
        });
        return context;
    }
}