// #region ████████ IMPORTS ████████ ~
import { 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, XItem
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "../helpers/bundler.js";
export default class XDie extends XItem {
    constructor(xOptions) {
        const dieSize = xOptions.size ?? 50;
        xOptions = {
            id: `x-die-${U.getUID()}`,
            value: xOptions.value,
            parent: xOptions.parent,
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
                    "--die-color-fg": xOptions.numColor ?? "black",
                    "--die-color-bg": xOptions.color ?? "white",
                    "--die-color-stroke": xOptions.strokeColor ?? "black"
                }
            }
        };
        super(xOptions);
        this.value = xOptions.value ?? null;
    }
    static get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-die"], template: U.getTemplatePath("xdie") }); }
    get parent() { return super.parent; }
    set parent(xItem) { super.parent = xItem; }
    getData() {
        const context = super.getData();
        Object.assign(context, {
            value: this.value ?? " "
        });
        return context;
    }
}