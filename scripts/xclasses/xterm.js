// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, XItem, XTermType
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮
export default class XDie extends XItem {
    // #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XDIE"),
            classes: ["x-die"],
            template: U.getTemplatePath("xdie"),
            isFreezingRotate: true,
            type: XTermType.BasicDie,
            value: 0,
            dieSize: 40,
            dieColor: "rgba(255, 255, 255, 1)",
            strokeColor: "rgba(0, 0, 0, 1)",
            numColor: "rgba(0, 0, 0, 1)",
            vars: {
                fontSize: "calc(1.2 * var(--die-size))",
                fontFamily: "Oswald",
                textAlign: "center"
            }
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    // #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
        this.options.vars = {
            ...this.options.vars,
            ...{
                "height": this.options.dieSize,
                "width": this.options.dieSize,
                "--die-size": `${this.options.dieSize}px`,
                "--die-color-fg": this.options.numColor,
                "--die-color-bg": this.options.dieColor,
                "--die-color-stroke": this.options.strokeColor
            }
        };
        this.#type = this.options.type;
        this.#value = this.options.value;
    }
    #type;
    get type() { return this.#type; }
    #value = 0;
    get value() { return this.#value; }
    set value(val) {
        if (val && val > 0 && val <= 10) {
            this.#value = val;
            this.value$.html(this.face);
        }
    }
    get value$() { return $(`#${this.id} .die-val`); }
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
    // #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XMOD"),
            classes: ["x-mod"],
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
    // #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
    }
    _value = 0;
    get value$() { return $(`#${this.id} .die-val`); }
    get type() { return this.options.type; }
    get value() { return (this._value = this._value ?? 0); }
    set value(val) {
        this._value = val;
        this.value$.html(`${val}`);
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
export class XGhost extends XMod {
    // #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XGHOST"),
            classes: ["x-ghost"],
            template: U.getTemplatePath("xmod"),
            isFreezingRotate: true,
            type: XTermType.Modifier,
            value: 0,
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    // #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
    }
}
export class XMutator extends XMod {
    // #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XMUTATOR"),
            classes: ["x-mutator"],
            template: U.getTemplatePath("xmod"),
            isFreezingRotate: true,
            type: XTermType.Modifier,
            value: 0,
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    // #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
    }
}
export class XInfo extends XMod {
    // #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XINFO"),
            classes: ["x-info"],
            template: U.getTemplatePath("xmod"),
            isFreezingRotate: true,
            type: XTermType.Modifier,
            value: 0,
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    // #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
    }
}