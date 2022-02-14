/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
gsap, MotionPathPlugin, 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, 
XItem } from "../helpers/bundler.js";
export default class XElem {
    constructor(options) {
        this.id = options.id ?? `x-elem-${U.getUID()}`;
        this.renderApp = options.renderApp;
        this._onRender = options.onRender ?? {};
        if (!options.noImmediateRender) {
            this.asyncRender();
        }
    }
    get parentApp() { return this.renderApp.parent; }
    validateRender() {
        if (!this.isRendered) {
            debugger;
            throw Error(`Can't retrieve element of unrendered ${this.constructor.name ?? "XItem"} '${this.id}': Did you forget to await asyncRender?`);
        }
    }
    get elem() { this.validateRender(); return this.renderApp.element[0]; }
    get elem$() { return $(this.elem); }
    async asyncRender() {
        if (!this._renderPromise) {
            this._renderPromise = this.renderApp.renderApplication();
            await this._renderPromise;
            if (this.parentApp) {
                await this.parentApp.asyncRender();
                this.parentApp.adopt(this.renderApp, false);
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
        }
        return this._renderPromise;
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
    get _rotation() { return U.pFloat(U.get(this.elem, "rotation")); }
    get _scale() { return U.pFloat(U.get(this.elem, "scale")) || 1; }
    // XROOT SPACE (Global): Position & Dimensions
    get pos() {
        if (this.parentApp && this.parentApp.isRendered) {
            return MotionPathPlugin.convertCoordinates(this.parentApp.elem, XItem.XROOT.elem, this._pos);
        }
        return this._pos;
    }
    get x() { return this.pos.x; }
    get y() { return this.pos.y; }
    get rotation() {
        let totalRotation = this._rotation, { parentApp } = this;
        while (parentApp && parentApp.isRendered) {
            totalRotation += U.pFloat(U.get(parentApp.elem, "rotation"));
            parentApp = parentApp.parent;
        }
        return totalRotation;
    }
    get scale() {
        let totalScale = 1, { parentApp } = this;
        while (parentApp && parentApp.isRendered) {
            totalScale *= U.pFloat(U.get(parentApp.elem, "scale"));
            parentApp = parentApp.parent;
        }
        return totalScale;
    }
    get height() { return U.get(this.elem, "height", "px"); }
    get width() { return U.get(this.elem, "width", "px"); }
    get size() { return (this.height + this.width) / 2; }
    get radius() { return (this.height === this.width ? this.height : false); }
    getLocalPosData(ofItem, globalPoint) {
        return {
            ...MotionPathPlugin.convertCoordinates(XItem.XROOT.elem, this.elem, globalPoint ?? ofItem.pos ?? { x: 0, y: 0 }),
            rotation: ofItem?.rotation ?? 0 - this.rotation,
            scale: ofItem?.scale ?? 1 / this.scale
        };
    }
    to(vars) { this.validateRender; return gsap.to(this.elem, vars); }
    from(vars) { this.validateRender; return gsap.from(this.elem, vars); }
    fromTo(fromVars, toVars) { this.validateRender; return gsap.fromTo(this.elem, fromVars, toVars); }
    set(vars) { this.validateRender; return gsap.set(this.elem, vars); }
}