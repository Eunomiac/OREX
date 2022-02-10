/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
gsap, 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, XElem
 } from "../helpers/bundler.js";
export default class XItem extends Application {
    constructor(options = {}, parent = XItem.XROOT) {
        var _a, _b;
        super(U.objMerge(options, { classes: ["x-item", ...(_a = options.classes) !== null && _a !== void 0 ? _a : []] }));
        this._renderPromise = null;
        this._parent = parent;
        this._xElem = new XElem(this);
        (_b = this.parent) === null || _b === void 0 ? void 0 : _b.adopt(this, false);
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: U.unique([...super.defaultOptions.classes, "x-item"]),
            template: XElem.getTemplatePath("xitem")
        });
    }
    static AddTicker(func) {
        this._TICKERS.push(func);
        gsap.ticker.add(func);
    }
    static XKill() {
        if (XItem._XROOT) {
            $(XItem._XROOT.elem).remove();
            XItem._TICKERS.forEach((func) => gsap.ticker.remove(func));
            delete XItem._XROOT;
        }
    }
    static get XROOT() {
        if (!this._XROOT) {
            this._XROOT = new XItem({
                id: "x-root"
            }, null);
        }
        return this._XROOT;
    }
    get elem() { return this.element[0]; }
    get parent() { return this._parent; }
    get _x() { return this._xElem._x; }
    get _y() { return this._xElem._y; }
    get _pos() { return this._xElem._pos; }
    get _rotation() { return this._xElem._rotation; }
    get _scale() { return this._xElem._scale; }
    get x() { return this._xElem.x; }
    get y() { return this._xElem.y; }
    get pos() { return this._xElem.pos; }
    get rotation() { return this._xElem.rotation; }
    get scale() { return this._xElem.scale; }
    get adopt() { return this._xElem.adopt.bind(this._xElem); }
    getData() {
        const context = super.getData();
        Object.assign(context, {
            id: this.id,
            classes: this.options.classes.join(" ")
        });
        return context;
    }
    asyncRender(force = true, options = {}) {
        var _a;
        return (this._renderPromise = (_a = this._renderPromise) !== null && _a !== void 0 ? _a : super._render(force, options).catch((err) => {
            this._state = Application.RENDER_STATES.ERROR;
            Hooks.onError("Application#render", err, Object.assign({ msg: `An error occurred while rendering ${this.constructor.name} ${this.appId}`, log: "error" }, options));
        }));
    }
    whenRendered(func) { return this.rendered ? func() : this.asyncRender().then(func); }
    to(vars) {
        return this.whenRendered(() => gsap.to(this.elem, vars));
    }
    from(vars) {
        return this.whenRendered(() => gsap.from(this.elem, vars));
    }
    fromTo(fromVars, toVars) {
        return this.whenRendered(() => gsap.fromTo(this.elem, fromVars, toVars));
    }
    set(vars) { return this.whenRendered(() => gsap.set(this.elem, vars)); }
}
XItem._TICKERS = [];