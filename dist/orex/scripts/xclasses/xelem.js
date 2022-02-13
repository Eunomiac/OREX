/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
gsap, MotionPathPlugin, 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, 
XItem } from "../helpers/bundler.js";
export default class XElem {
    constructor(options) {
        var _a, _b;
        this.id = (_a = options.id) !== null && _a !== void 0 ? _a : `x-elem-${U.getUID()}`;
        this.renderApp = options.renderApp;
        this._onRender = (_b = options.onRender) !== null && _b !== void 0 ? _b : {};
        if (!options.noImmediateRender) {
            this.render();
        }
    }
    get parentApp() { return this.renderApp.parent; }
    validateRender() {
        if (!this.isRendered) {
            throw Error(`[XELEM Error] Attempt to retrieve element of unrendered ${this.constructor.name}, id '${this.id}'`);
        }
    }
    get elem() { this.validateRender(); return this.renderApp.element[0]; }
    get elem$() { return $(this.elem); }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._renderPromise) {
                this._renderPromise = this.renderApp.renderApplication();
                yield this._renderPromise;
            }
            if (this.parentApp) {
                yield this.parentApp.xElem.render();
                this.parentApp.xElem.adopt(this.renderApp, false);
            }
            if (this._onRender.set) {
                this.set(this._onRender.set);
            }
            if (this._onRender.to && this._onRender.from) {
                this.fromTo(this._onRender.from, this._onRender.to);
            }
            else if (this._onRender.to) {
                this.to(this._onRender.to);
            }
            else if (this._onRender.from) {
                this.from(this._onRender.from);
            }
            return;
        });
    }
    get isRendered() { return this.renderApp.rendered; }
    adopt(child, isRetainingPosition = true) {
        this.validateRender();
        child.xElem.validateRender();
        if (isRetainingPosition) {
            this.set(this.getLocalPosData(child));
        }
        child.elem$.appendTo(this.elem);
    }
    // LOCAL SPACE: Position & Dimensions
    get _x() { return U.get(this.elem, "x", "px"); }
    get _y() { return U.get(this.elem, "y", "px"); }
    get _pos() { return { x: this._x, y: this._y }; }
    get _rotation() { return U.get(this.elem, "rotation"); }
    get _scale() { return U.get(this.elem, "scale"); }
    // XROOT SPACE (Global): Position & Dimensions
    get pos() {
        if (this.parentApp) {
            return MotionPathPlugin.convertCoordinates(this.parentApp.elem, XItem.XROOT.elem, this._pos);
        }
        return this._pos;
    }
    get x() { return this.pos.x; }
    get y() { return this.pos.y; }
    get rotation() {
        let totalRotation = 0, { parentApp } = this;
        while (parentApp) {
            const thisRotation = U.get(parentApp.elem, "rotation");
            if (typeof thisRotation === "number") {
                totalRotation += thisRotation;
            }
            parentApp = parentApp.parent;
        }
        return totalRotation;
    }
    get scale() {
        let totalScale = 1, { parentApp } = this;
        while (parentApp) {
            const thisScale = U.get(parentApp.elem, "scale");
            if (typeof thisScale === "number") {
                totalScale *= thisScale;
            }
            parentApp = parentApp.parent;
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
    to(vars) { this.validateRender; return gsap.to(this.elem, vars); }
    from(vars) { this.validateRender; return gsap.from(this.elem, vars); }
    fromTo(fromVars, toVars) { this.validateRender; return gsap.fromTo(this.elem, fromVars, toVars); }
    set(vars) { this.validateRender; return gsap.set(this.elem, vars); }
}