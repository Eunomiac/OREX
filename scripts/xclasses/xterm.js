var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _XTerm_termType;
// #region ████████ IMPORTS ████████ ~
import { 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XItem } from "../helpers/bundler.js";
export var XTermType;
(function (XTermType) {
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
})(XTermType || (XTermType = {}));
export class XTerm extends XItem {
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
        _XTerm_termType.set(this, void 0);
        __classPrivateFieldSet(this, _XTerm_termType, xOptions.type, "f");
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, { classes: ["x-term"] });
    }
    get type() { return __classPrivateFieldGet(this, _XTerm_termType, "f"); }
    ApplyEffect(xRoll) {
        return xRoll;
    }
}
_XTerm_termType = new WeakMap();
export default class XDie extends XTerm {
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
        this._value = 0;
        this.value = xOptions.value ?? 0;
        this.termType = xOptions.type;
    }
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
    get value$() { return $(`#${this.id} .die-val`); }
    get value() { return (this._value = this._value ?? 0); }
    set value(val) {
        if (val >= 0 && val <= 10) {
            this._value = val;
            if (this.isInitialized) {
                this.value$.html(this.face);
            }
        }
    }
    get face() { return [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "<span style=\"color: red;\">X</span>"][this._value]; }
    get isRolled() { return this.value > 0; }
    roll() { this.value = U.randInt(1, 10); }
    get xParent() { return super.xParent; }
    set xParent(xItem) { super.xParent = xItem; }
    getData() {
        const context = super.getData();
        const faceNum = this.value === 10 ? 0 : (this.value || " ");
        Object.assign(context, {
            value: faceNum
        });
        return context;
    }
}