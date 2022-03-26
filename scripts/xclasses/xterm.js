// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XItem } from "../helpers/bundler.js";
export var XTermType;
(function (XTermType) {
    // Can we extend XDieType here, somehow?
    XTermType[XTermType["BasicDie"] = 0] = "BasicDie";
    XTermType[XTermType["ExpertDie"] = 1] = "ExpertDie";
    XTermType[XTermType["MasterDie"] = 2] = "MasterDie";
    XTermType[XTermType["GobbleDie"] = 3] = "GobbleDie";
    XTermType[XTermType["BasicSet"] = 4] = "BasicSet";
    XTermType[XTermType["MatchSet"] = 5] = "MatchSet";
    XTermType[XTermType["RunSet"] = 6] = "RunSet";
    XTermType[XTermType["FullHouseSet"] = 7] = "FullHouseSet";
    XTermType[XTermType["Difficulty"] = 8] = "Difficulty";
    XTermType[XTermType["Modifier"] = 9] = "Modifier";
    XTermType[XTermType["Trait"] = 10] = "Trait";
    XTermType[XTermType["Styler"] = 11] = "Styler";
    XTermType[XTermType["Ignore"] = 12] = "Ignore";
})(XTermType || (XTermType = {}));
export default class XDie extends XItem {
    static REGISTRY = new Map();
    type;
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-die"],
            template: U.getTemplatePath("xdie"),
            onRender: {
                set: {
                    fontSize: "calc(1.2 * var(--die-size))",
                    fontFamily: "Oswald",
                    textAlign: "center"
                }
            }
        });
    }
    _value = 0;
    get value$() { return $(`#${this.id} .die-val`); }
    get value() { return this._value; }
    set value(val) {
        if (val && val > 0 && val <= 10) {
            this._value = val;
            if (this.isInitialized) {
                this.value$.html(this.face);
            }
        }
    }
    get face() { return [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "X"][this._value]; }
    get isRolled() { return this.value > 0; }
    roll() { this.value = U.randInt(1, 10); }
    constructor(xParent, xOptions) {
        const dieSize = xOptions.size ?? 40;
        xOptions.onRender ??= {};
        xOptions.onRender.set = {
            ...{
                "--die-size": `${dieSize}px`,
                "--die-color-fg": xOptions.numColor ?? "black",
                "--die-color-bg": xOptions.color ?? "white",
                "--die-color-stroke": xOptions.strokeColor ?? "black"
            },
            ...xOptions.onRender.set ?? {}
        };
        xOptions.type = xOptions.type ?? XTermType.BasicDie;
        super(xParent, xOptions);
        this.value = xOptions.value ?? 0;
        this.type = xOptions.type;
    }
    getData() {
        const context = super.getData();
        const faceNum = this.value === 10 ? 0 : (this.value || " ");
        Object.assign(context, {
            value: faceNum
        });
        return context;
    }
}
export class XMod extends XItem {
    static REGISTRY = new Map();
    type;
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-mod"],
            template: U.getTemplatePath("xmod"),
            onRender: {
                set: {
                    fontSize: "calc(1.2 * var(--die-size))",
                    fontFamily: "Oswald",
                    textAlign: "center"
                }
            }
        });
    }
    _value = 0;
    get value$() { return $(`#${this.id} .die-val`); }
    get value() { return (this._value = this._value ?? 0); }
    set value(val) {
        this._value = val;
        if (this.isInitialized) {
            this.value$.html(`${val}`);
        }
    }
    get xParent() {
        return super.xParent;
    }
    set xParent(xItem) { super.xParent = xItem; }
    constructor(xParent, xOptions) {
        const dieSize = xOptions.size ?? 40;
        xOptions.onRender ??= {};
        xOptions.onRender.set = {
            ...{
                "--die-size": `${dieSize}px`
            },
            ...xOptions.onRender.set ?? {}
        };
        xOptions.type = xOptions.type ?? XTermType.BasicDie;
        super(xParent, xOptions);
        // this.value = xOptions.value ?? 0;
        this.type = xOptions.type;
    }
    getData() {
        const context = super.getData();
        const faceNum = this.value === 10 ? 0 : (this.value || " ");
        Object.assign(context, {
            value: faceNum
        });
        return context;
    }
}