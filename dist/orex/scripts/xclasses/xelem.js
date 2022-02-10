/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

// ████████ IMPORTS ████████
import { MotionPathPlugin, 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, 
XItem } from "../helpers/bundler.js";
export default class XElem {
    constructor(xItem) {
        this._xItem = xItem;
    }
    get elem() { return this._xItem.elem; }
    get xItem() { return this._xItem; }
    get parent() { return this._xItem.parent; }
    // LOCAL SPACE: Position & Dimensions
    get _x() { return U.get(this.elem, "x", "px"); }
    get _y() { return U.get(this.elem, "y", "px"); }
    get _pos() { return { x: this._x, y: this._y }; }
    get _rotation() { return U.get(this.elem, "rotation"); }
    get _scale() { return U.get(this.elem, "scale"); }
    // X-SPACE (Global): Position & Dimensions
    get pos() {
        if (this.parent) {
            return MotionPathPlugin.convertCoordinates(this.parent.elem, XItem.XCONTAINER.elem, this._pos);
        }
        return this._pos;
    }
    get x() { return this.pos.x; }
    get y() { return this.pos.y; }
    get rotation() {
        let totalRotation = 0, { parent } = this._xItem;
        while (parent) {
            const thisRotation = U.get(parent.elem, "rotation");
            if (typeof thisRotation === "number") {
                totalRotation += thisRotation;
            }
            ({ parent } = parent);
        }
        return totalRotation;
    }
    get scale() {
        let totalScale = 1, { parent } = this._xItem;
        while (parent) {
            const thisScale = U.get(parent.elem, "scale");
            if (typeof thisScale === "number") {
                totalScale *= thisScale;
            }
            ({ parent } = parent);
        }
        return totalScale;
    }
    getLocalPosData(xItem, globalPoint) {
        return Object.assign(Object.assign({}, MotionPathPlugin.convertCoordinates(XItem.XCONTAINER.elem, this.elem, globalPoint !== null && globalPoint !== void 0 ? globalPoint : xItem.pos)), { rotation: xItem.rotation - this.rotation, scale: xItem.scale / this.scale });
    }
    adopt(xItem, isRetainingPosition = true) {
        this.xItem.whenRendered(() => {
            if (isRetainingPosition) {
                xItem.set(this.getLocalPosData(xItem));
            }
            $(xItem.elem).appendTo(this.elem);
        });
    }
    get height() { return U.get(this.elem, "height", "px"); }
    get width() { return U.get(this.elem, "width", "px"); }
    get size() { return (this.height + this.width) / 2; }
    get radius() { return (this.height === this.width ? this.height : false); }
}