
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, XItem
 } from "../helpers/bundler.js";
export default class XDie extends XItem {
    constructor(xOptions) {
        const dieSize = xOptions.size ?? 50;
        const fontSize = dieSize * 1.2;
        const value = xOptions.value ?? null;
        xOptions = {
            id: xOptions.id,
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
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: U.unique([...super.defaultOptions.classes, "x-die"]),
            template: U.getTemplatePath("xdie")
        });
    }
    get parent() { return super.parent; }
    getData() {
        const context = super.getData();
        Object.assign(context, {
            value: this.value ?? " "
        });
        return context;
    }
}