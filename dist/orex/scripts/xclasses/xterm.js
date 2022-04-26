
// ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮
import { 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XROOT, XItem, XTermType
 } from "../helpers/bundler.js";
export default class XDie extends XItem {
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XDIE"),
            classes: ["x-die"],
            xParent: XROOT.XROOT,
            template: U.getTemplatePath("xdie"),
            isFreezingRotate: true,
            type: XTermType.BasicDie,
            value: 0,
            dieSize: 40,
            dieColor: "white",
            strokeColor: "black",
            numColor: "black",
            vars: {
                fontSize: "calc(1.2 * var(--die-size))",
                fontFamily: "Oswald",
                textAlign: "center"
            }
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    get type() { return this.options.type; }
    get value$() { return $(`#${this.id} .die-val`); }
    #value = 0;
    get value() { return this.#value; }
    set value(val) {
        if (val && val > 0 && val <= 10) {
            this.#value = val;
            this.value$.html(this.face);
        }
    }
    get face() { return [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "X"][this.#value]; }
    get isRolled() { return this.value > 0; }
    roll() { this.value = U.randInt(1, 10); }
    async render() {
        if (this._renderPromise) {
            return this._renderPromise;
        }
        const superPromise = super.render();
        this._renderPromise = superPromise
            .then(async () => {
            this.value$.html(this.face);
            return this;
        });
        return this._renderPromise;
    }
    constructor(xOptions) {
        xOptions.type ??= XTermType.BasicDie;
        xOptions.isFreezingRotate ??= true;
        super(xOptions);
        this.options.vars = {
            ...this.options.vars,
            ...{
                "--die-size": `${this.options.dieSize}px`,
                "--die-color-fg": this.options.numColor,
                "--die-color-bg": this.options.dieColor,
                "--die-color-stroke": this.options.strokeColor
            }
        };
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
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XMOD"),
            classes: ["x-mod"],
            xParent: XROOT.XROOT,
            template: U.getTemplatePath("xmod"),
            isFreezingRotate: true,
            type: XTermType.Modifier,
            value: 0,
            vars: {
                fontSize: "calc(1.2 * var(--die-size))",
                fontFamily: "Oswald",
                textAlign: "center"
            }
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    _value = 0;
    get value$() { return $(`#${this.id} .die-val`); }
    get type() { return this.options.type; }
    get value() { return (this._value = this._value ?? 0); }
    set value(val) {
        this._value = val;
        this.value$.html(`${val}`);
    }
    constructor(xOptions) {
        super(xOptions);
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