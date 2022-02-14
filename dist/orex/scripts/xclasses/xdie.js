/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

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
                    "--die-color-fg": xOptions.numColor ?? "black",
                    "--die-color-bg": xOptions.color ?? "white",
                    "--die-color-stroke": xOptions.strokeColor ?? "black"
                }
            }
        };
        super(xOptions);
        this.options.classes.unshift("x-die");
        this.xOptions = xOptions;
        this.value = xOptions.value ?? null;
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
            value: this.value ?? " "
        });
        return context;
    }
}