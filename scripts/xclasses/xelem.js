var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        var _a;
        this._isParented = false;
        const options = xItem.options;
        this._xItem = xItem;
        this._parent = options.parent;
        this._style = options.style;
        if (options.isRendering !== false) {
            if (this._parent !== null) {
                this._parent = (_a = this._parent) !== null && _a !== void 0 ? _a : XItem.XROOT;
            }
            this.asyncRender();
        }
    }
    get xItem() { return this._xItem; }
    get elem() { return this.xItem.element[0]; }
    get parent() { return this._parent; }
    get isRendered() { return this.xItem.isRendered; }
    get isParented() { return this._isParented; }
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
        let totalRotation = 0, { parent } = this.xItem;
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
        let totalScale = 1, { parent } = this.xItem;
        while (parent instanceof XItem) {
            const thisScale = U.get(parent.elem, "scale");
            if (typeof thisScale === "number") {
                totalScale *= thisScale;
            }
            ({ parent } = parent);
        }
        return totalScale;
    }
    get height() { return U.get(this.elem, "height", "px"); }
    get width() { return U.get(this.elem, "width", "px"); }
    get size() { return (this.height + this.width) / 2; }
    get radius() { return (this.height === this.width ? this.height : false); }
    getLocalPosData(ofItem, globalPoint) {
        var _a, _b, _c;
        return Object.assign(Object.assign({}, MotionPathPlugin.convertCoordinates(XItem.XROOT.elem, this.elem, (_a = globalPoint !== null && globalPoint !== void 0 ? globalPoint : ofItem.pos) !== null && _a !== void 0 ? _a : { x: 0, y: 0 })), { rotation: (_b = ofItem === null || ofItem === void 0 ? void 0 : ofItem.rotation) !== null && _b !== void 0 ? _b : 0 - this.rotation, scale: (_c = ofItem === null || ofItem === void 0 ? void 0 : ofItem.scale) !== null && _c !== void 0 ? _c : 1 / this.scale });
    }
    asyncRender() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._renderPromise) {
                return this._renderPromise;
            }
            this._renderPromise = this.xItem.renderApp();
            if (this.parent instanceof XItem) {
                this.parent.adopt(this.xItem, false);
            }
            if (this._style) {
                this.set(this._style);
            }
            return this._renderPromise;
        });
    }
    whenRendered(func) { return this.isRendered ? func() : this.asyncRender().then(func); }
    adopt(xParent, isRetainingPosition = true) {
        return this.whenRendered(() => {
            xParent.whenRendered(() => {
                if (isRetainingPosition) {
                    this.set(this.getLocalPosData(xParent));
                }
                $(xParent.elem).appendTo(this.elem);
            });
        });
    }
    to(vars) { return this.whenRendered(() => gsap.to(this.elem, vars)); }
    from(vars) { return this.whenRendered(() => gsap.from(this.elem, vars)); }
    fromTo(fromVars, toVars) { return this.whenRendered(() => gsap.fromTo(this.elem, fromVars, toVars)); }
    set(vars) { return this.whenRendered(() => gsap.set(this.elem, vars)); }
}
