// #region ████████ IMPORTS ████████ ~
import { 
// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
gsap, MotionPathPlugin, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
XItem } from "../helpers/bundler.js";
export default class XElem {
    constructor(xOptions) {
        this._isRenderReady = false;
        this.renderApp = xOptions.renderApp;
        this.id = this.renderApp.id;
        this.onRender = xOptions.onRender ?? {};
    }
    get parentApp() { return this.renderApp.parent; }
    get elem() { this.validateRender(); return this.renderApp.element[0]; }
    get elem$() { return $(this.elem); }
    get isRenderReady() { return this._isRenderReady; }
    async confirmRender(isRendering = true) {
        this._isRenderReady = this.isRenderReady || isRendering;
        // console.log(`[${this.id}] . confirmRender(${isRendering ?? ""}) --> ${this.isRendered ? "RENDERED" : "NOT Rendered"}`);
        if (this.isRendered) {
            return Promise.resolve(true);
        }
        if (!this.isRenderReady) {
            return Promise.resolve(false);
        }
        this.renderPromise = this.renderApp.renderApplication();
        await this.renderPromise;
        if (this.parentApp) {
            // const awaitTest = await this.parentApp.confirmRender();
            // console.log(`[${this.id}] PARENT:[${this.parentApp.id}] await this.parentApp.confirmRender(${isRendering}) = ${awaitTest}`);
            if (!(await this.parentApp.confirmRender())) {
                console.warn("Attempt to render child of unrendered parent.");
                return Promise.resolve(false);
            }
            this.parentApp?.adopt(this.renderApp, false);
        }
        if (this.onRender.set) {
            this.set(this.onRender.set);
        }
        if (this.onRender.to && this.onRender.from) {
            this.fromTo(this.onRender.from, this.onRender.to);
        }
        else if (this.onRender.to) {
            this.to(this.onRender.to);
        }
        else if (this.onRender.from) {
            this.from(this.onRender.from);
        }
        this.onRender.funcs?.forEach((func) => func(this.renderApp));
        return this.renderPromise;
    }
    get isRendered() { return this.renderApp.rendered; }
    validateRender() {
        if (!this.isRendered) {
            /*DEVCODE*/ debugger; /* eslint-disable-line no-debugger */ /*!DEVCODE*/
            throw Error(`Can't retrieve element of unrendered ${this.constructor.name ?? "XItem"} '${this.id}': Did you forget to await confirmRender?`);
        }
    }
    adopt(child, isRetainingPosition = true) {
        child.parent?.unregisterChild(child);
        this.renderApp.registerChild(child);
        if (this.isRendered && child.isRendered) {
            if (isRetainingPosition) {
                child.set(this.getLocalPosData(child));
            }
            child.elem$.appendTo(this.elem);
        }
    }
    // LOCAL SPACE: Position & Dimensions
    get x() { return U.pInt(this.isRendered ? U.get(this.elem, "x", "px") : this.onRender.set?.x); }
    get y() { return U.pInt(this.isRendered ? U.get(this.elem, "y", "px") : this.onRender.set?.y); }
    get pos() { return { x: this.x, y: this.y }; }
    get rotation() { return U.pFloat(this.isRendered ? U.get(this.elem, "rotation") : this.onRender.set?.rotation, 2); }
    get scale() { return U.pFloat(this.isRendered ? U.get(this.elem, "scale") : this.onRender.set?.scale, 2) || 1; }
    // XROOT SPACE (Global): Position & Dimensions
    get global() {
        this.validateRender();
        const self = this;
        return {
            get pos() {
                if (self.parentApp) {
                    self.parentApp.xElem.validateRender();
                    return MotionPathPlugin.convertCoordinates(self.parentApp.elem, XItem.XROOT.elem, self.pos);
                }
                return self.pos;
            },
            get x() { return this.pos.x; },
            get y() { return this.pos.y; },
            get rotation() {
                let totalRotation = self.rotation, { parentApp } = self;
                while (parentApp) {
                    parentApp.xElem.validateRender();
                    totalRotation += parentApp.rotation;
                    parentApp = parentApp.parent;
                }
                return totalRotation;
            },
            get scale() {
                let totalScale = self.scale, { parentApp } = self;
                while (parentApp) {
                    parentApp.xElem.validateRender();
                    totalScale *= parentApp.scale;
                    parentApp = parentApp.parent;
                }
                return totalScale;
            }
        };
    }
    get height() { return U.pInt(this.isRendered ? U.get(this.elem, "height", "px") : this.onRender.set?.height); }
    get width() { return U.pInt(this.isRendered ? U.get(this.elem, "width", "px") : this.onRender.set?.width); }
    get size() { return (this.height + this.width) / 2; }
    get radius() { return (this.height === this.width ? this.height : false); }
    getLocalPosData(ofItem, globalPoint) {
        this.validateRender();
        ofItem.xElem.validateRender();
        return {
            ...MotionPathPlugin.convertCoordinates(XItem.XROOT.elem, this.elem, globalPoint ?? ofItem.global.pos),
            rotation: ofItem.global.rotation - this.global.rotation,
            scale: ofItem.global.scale / this.global.scale
        };
    }
    set(vars) {
        if (this.isRendered) {
            return gsap.set(this.elem, vars);
        }
        this.onRender.set = {
            ...this.onRender.set ?? {},
            ...vars
        };
        return false;
    }
    to(vars) {
        if (this.isRendered) {
            return gsap.to(this.elem, vars);
        }
        this.onRender.to = {
            ...this.onRender.to ?? {},
            ...vars
        };
        return false;
    }
    from(vars) {
        if (this.isRendered) {
            return gsap.from(this.elem, vars);
        }
        this.onRender.from = {
            ...this.onRender.from ?? {},
            ...vars
        };
        return false;
    }
    fromTo(fromVars, toVars) {
        if (this.isRendered) {
            return gsap.fromTo(this.elem, fromVars, toVars);
        }
        this.onRender.to = {
            ...this.onRender.to ?? {},
            ...toVars
        };
        this.onRender.from = {
            ...this.onRender.from ?? {},
            ...fromVars
        };
        return false;
    }
}