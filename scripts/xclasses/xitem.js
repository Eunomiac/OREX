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
        this._parent = parent;
        this._xElem = new XElem(this);
        this.render(true);
        (_a = this._parent) === null || _a === void 0 ? void 0 : _a.adopt(this);
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            popOut: false,
            classes: ["x-item"],
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
    get adopt() { return this._xElem.adopt; }
    getData() {
        const context = super.getData();
        Object.assign(context, {
            id: this.id,
            classes: this.options.classes.join(" ")
        });
        return context;
    }
    to(vars) {
        return U.waitForRender(this, () => gsap.to(this.elem, vars));
    }
    from(vars) {
        return U.waitForRender(this, () => gsap.from(this.elem, vars));
    }
    fromTo(fromVars, toVars) {
        return U.waitForRender(this, () => gsap.fromTo(this.elem, fromVars, toVars));
    }
    set(vars) {
        return U.waitForRender(this, () => gsap.set(this.elem, vars), 200);
    }
}
