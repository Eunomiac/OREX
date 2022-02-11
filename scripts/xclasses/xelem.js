// #region ████████ IMPORTS ████████ ~
import { 
// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
gsap, MotionPathPlugin, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
XItem } from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
export default class XElem {
    constructor(xItem) {
        this._parent = XItem.XROOT;
        const options = xItem.options;
        this._xItem = xItem;
        this._parent = options.parent;
        if (options.isRendering !== false) {
            if (this._parent === XScope.XROOT) {
                this._parent = XItem.XROOT;
            }
            this.whenRendered(() => {
                var _a;
                if (this.parent && this.parent instanceof XItem) {
                    (_a = this.parent._xElem) === null || _a === void 0 ? void 0 : _a.adopt(this._xItem, false);
                }
            });
        }
    }
    get xItem() { return this._xItem; }
    get elem() { return this._xItem.element[0]; }
    get parent() { return this._parent; }
    // LOCAL SPACE: Position & Dimensions
    get _x() { return U.get(this.elem, "x", "px"); }
    get _y() { return U.get(this.elem, "y", "px"); }
    get _pos() { return { x: this._x, y: this._y }; }
    get _rotation() { return U.get(this.elem, "rotation"); }
    get _scale() { return U.get(this.elem, "scale"); }
    // XROOT SPACE (Global): Position & Dimensions
    get pos() {
        if (this.parent instanceof XItem) {
            return MotionPathPlugin.convertCoordinates(this.parent.elem, XItem.XROOT.elem, this._pos);
        }
        return this._pos;
    }
    get x() { return this.pos.x; }
    get y() { return this.pos.y; }
    get rotation() {
        let totalRotation = 0, { parent } = this._xItem;
        while (parent instanceof XItem) {
            const thisRotation = U.get(parent.elem, "rotation");
            if (typeof thisRotation === "number") {
                totalRotation += thisRotation;
            }
            parent = ({ parent } = parent);
        }
        return totalRotation;
    }
    get scale() {
        let totalScale = 1, { parent } = this._xItem;
        while (parent instanceof XItem) {
            const thisScale = U.get(parent.elem, "scale");
            if (typeof thisScale === "number") {
                totalScale *= thisScale;
            }
            ({ parent } = parent);
        }
        return totalScale;
    }
    getLocalPosData(ofItem, globalPoint) {
        var _a, _b, _c;
        return Object.assign(Object.assign({}, MotionPathPlugin.convertCoordinates(XItem.XROOT.elem, this.elem, (_a = globalPoint !== null && globalPoint !== void 0 ? globalPoint : ofItem.pos) !== null && _a !== void 0 ? _a : { x: 0, y: 0 })), { rotation: (_b = ofItem === null || ofItem === void 0 ? void 0 : ofItem.rotation) !== null && _b !== void 0 ? _b : 0 - this.rotation, scale: (_c = ofItem === null || ofItem === void 0 ? void 0 : ofItem.scale) !== null && _c !== void 0 ? _c : 1 / this.scale });
    }
    asyncRender() {
        var _a;
        return (this._renderPromise = (_a = this._renderPromise) !== null && _a !== void 0 ? _a : this._xItem.renderApp());
    }
    whenRendered(func) { return this._xItem.isRendered ? func() : this.asyncRender().then(func); }
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
    adopt(xParent, isRetainingPosition = true) {
        this.whenRendered(() => {
            if (isRetainingPosition) {
                this.set(this.getLocalPosData(xParent));
            }
            $(xParent.elem).appendTo(this.elem);
        });
    }
    get height() { return U.get(this.elem, "height", "px"); }
    get width() { return U.get(this.elem, "width", "px"); }
    get size() { return (this.height + this.width) / 2; }
    get radius() { return (this.height === this.width ? this.height : false); }
}
