/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _XElem_instances, _XElem_globalRotation_get, _XElem_globalScale_get;
// ████████ IMPORTS ████████
import { MotionPathPlugin, 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, 
XItem } from "../helpers/bundler.js";
export default class XElem {
    constructor(element, xItem) {
        _XElem_instances.add(this);
        this.element = element;
        this.xItem = xItem;
    }
    get height() { return U.get(this.element, "height", "px"); }
    get width() { return U.get(this.element, "width", "px"); }
    get localPosition() {
        return {
            x: U.pFloat(U.get(this.element, "x", "px"), 2),
            y: U.pFloat(U.get(this.element, "y", "px"), 2),
            rotation: U.pFloat(U.get(this.element, "rotation"), 3),
            scale: U.pFloat(U.get(this.element, "scale"), 4)
        };
    }
    get globalPosition() {
        if (this.xItem.parent) {
            const { x, y } = MotionPathPlugin.convertCoordinates(this.xItem.parent.elem, XItem.XCONTAINER.elem, this.localPosition);
            return {
                x, y,
                rotation: __classPrivateFieldGet(this, _XElem_instances, "a", _XElem_globalRotation_get),
                scale: __classPrivateFieldGet(this, _XElem_instances, "a", _XElem_globalScale_get)
            };
        }
        return this.localPosition;
    }
    get position() {
        return {
            local: this.localPosition,
            global: this.globalPosition,
            height: this.height,
            width: this.width
        };
    }
}
_XElem_instances = new WeakSet(), _XElem_globalRotation_get = function _XElem_globalRotation_get() {
    let totalRotation = 0, { parent } = this.xItem;
    while (parent) {
        const thisRotation = U.get(parent.elem, "rotation");
        if (typeof thisRotation === "number") {
            totalRotation += thisRotation;
        }
        ({ parent } = parent);
    }
    return totalRotation;
}, _XElem_globalScale_get = function _XElem_globalScale_get() {
    let totalScale = 1, { parent } = this.xItem;
    while (parent) {
        const thisScale = U.get(parent.elem, "scale");
        if (typeof thisScale === "number") {
            totalScale *= thisScale;
        }
        ({ parent } = parent);
    }
    return totalScale;
};