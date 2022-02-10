// #region ████████ IMPORTS ████████ ~
import { 
// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
gsap, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, XElem
// #endregion ▮▮▮▮[Utility]▮▮▮▮
 } from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
export default class XItem extends Application {
    constructor(options = {}, parent = XItem.XCONTAINER) {
        var _a;
        super(options);
        this._renderPromise = null;
        this._parent = parent;
        this._xElem = new XElem(this);
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.adopt(this, false);
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: U.unique([...super.defaultOptions.classes, "x-item"]),
            template: U.getTemplatePath("xcontainer.hbs")
        });
    }
    static get XCONTAINER() {
        if (!this._XCONTAINER) {
            this._XCONTAINER = new XItem({
                id: "x-container"
            }, null);
        }
        return this._XCONTAINER;
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
