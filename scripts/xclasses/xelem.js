var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _XElem_isRenderReady;
// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #region ====== GreenSock Animation ====== ~
gsap, MotionPathPlugin, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮ XItems ▮▮▮▮▮▮▮
XItem
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ Type Definitions ▄▄▄▄▄
// #region 🟩🟩🟩 XElem: Contains & Controls a DOM Element Linked to an XItem 🟩🟩🟩
export default class XElem {
    constructor(renderApp, xOptions) {
        _XElem_isRenderReady.set(this, false);
        // #endregion ░░░░[Converting from Global to Element's Local Space]░░░░
        // #endregion ▄▄▄▄▄ Positioning ▄▄▄▄▄
        // #region ████████ GSAP: GSAP Animation Method Wrappers ████████ ~
        this.tweens = {};
        this.renderApp = renderApp;
        this.id = this.renderApp.id;
        this.onRender = xOptions.onRender ?? {};
    }
    get isRenderReady() { return __classPrivateFieldGet(this, _XElem_isRenderReady, "f"); }
    async confirmRender(isRendering = true) {
        __classPrivateFieldSet(this, _XElem_isRenderReady, this.isRenderReady || isRendering, "f");
        if (this.isRendered) {
            return Promise.resolve(true);
        }
        if (!this.isRenderReady) {
            return Promise.resolve(false);
        }
        this.renderPromise = this.renderApp.renderApplication();
        await this.renderPromise;
        if (this.parentApp) {
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
            throw Error(`Can't retrieve element of unrendered ${this.constructor.name ?? "XItem"} '${this.id}': Did you forget to await confirmRender?`);
        }
    }
    get elem() { this.validateRender(); return this.renderApp.element[0]; }
    get elem$() { return $(this.elem); }
    // #endregion ▄▄▄▄▄ CONSTRUCTOR ▄▄▄▄▄
    // #region ████████ Parenting: Adopting & Managing Child XItems ████████ ~
    get parentApp() { return this.renderApp.xParent; }
    adopt(child, isRetainingPosition = true) {
        child.xParent?.unregisterXKid(child);
        this.renderApp.registerXKid(child);
        if (this.isRendered && child.isRendered) {
            if (isRetainingPosition) {
                child.set(this.getLocalPosData(child));
            }
            child.elem$.appendTo(this.elem);
        }
    }
    // #endregion ▄▄▄▄▄ Parenting ▄▄▄▄▄
    // #region ████████ Positioning: Positioning DOM Element in Local and Global (XROOT) Space ████████ ~
    // #region ░░░░░░░ Local Space ░░░░░░░ ~
    get x() { return U.pInt(this.isRendered ? U.get(this.elem, "x", "px") : this.onRender.set?.x); }
    get y() { return U.pInt(this.isRendered ? U.get(this.elem, "y", "px") : this.onRender.set?.y); }
    get pos() { return { x: this.x, y: this.y }; }
    get rotation() { return U.pFloat(this.isRendered ? U.get(this.elem, "rotation") : this.onRender.set?.rotation, 2); }
    get scale() { return U.pFloat(this.isRendered ? U.get(this.elem, "scale") : this.onRender.set?.scale, 2) || 1; }
    // #endregion ░░░░[Local Space]░░░░
    // #region ░░░░░░░ Global (XROOT) Space ░░░░░░░ ~
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
                    parentApp = parentApp.xParent;
                }
                return totalRotation;
            },
            get scale() {
                let totalScale = self.scale, { parentApp } = self;
                while (parentApp) {
                    parentApp.xElem.validateRender();
                    totalScale *= parentApp.scale;
                    parentApp = parentApp.xParent;
                }
                return totalScale;
            }
        };
    }
    get height() { return U.pInt(this.isRendered ? U.get(this.elem, "height", "px") : this.onRender.set?.height); }
    get width() { return U.pInt(this.isRendered ? U.get(this.elem, "width", "px") : this.onRender.set?.width); }
    get size() { return (this.height + this.width) / 2; }
    get radius() { return (this.height === this.width ? this.height : false); }
    // #endregion ░░░░[Global (XROOT) Space]░░░░
    // #region ░░░░░░░ Converting from Global to Element's Local Space ░░░░░░░ ~
    getLocalPosData(ofItem, globalPoint) {
        this.validateRender();
        ofItem.xElem.validateRender();
        return {
            ...MotionPathPlugin.convertCoordinates(XItem.XROOT.elem, this.elem, globalPoint ?? ofItem.global.pos),
            rotation: ofItem.global.rotation - this.global.rotation,
            scale: ofItem.global.scale / this.global.scale
        };
    }
    /*~ Figure out a way to have to / from / fromTo methods on all XItems that:
            - will adjust animation timescale based on a maximum time to maximum distance ratio(and minspeed ratio ?)
            - if timescale is small enough, just uses.set() ~*/
    set(vars) {
        if (this.isRendered) {
            gsap.set(this.elem, vars);
        }
        else {
            this.onRender.set = {
                ...this.onRender.set ?? {},
                ...vars
            };
        }
        return this.renderApp;
    }
    to(vars) {
        if (this.isRendered) {
            const tween = gsap.to(this.elem, vars);
            if (vars.id) {
                this.tweens[vars.id] = tween;
            }
        }
        else {
            this.onRender.to = {
                ...this.onRender.to ?? {},
                ...vars
            };
        }
        return this.renderApp;
    }
    from(vars) {
        if (this.isRendered) {
            const tween = gsap.from(this.elem, vars);
            if (vars.id) {
                this.tweens[vars.id] = tween;
            }
        }
        else {
            this.onRender.from = {
                ...this.onRender.from ?? {},
                ...vars
            };
        }
        return this.renderApp;
    }
    fromTo(fromVars, toVars) {
        if (this.isRendered) {
            const tween = gsap.fromTo(this.elem, fromVars, toVars);
            if (toVars.id) {
                this.tweens[toVars.id] = tween;
            }
        }
        else {
            this.onRender.to = {
                ...this.onRender.to ?? {},
                ...toVars
            };
            this.onRender.from = {
                ...this.onRender.from ?? {},
                ...fromVars
            };
        }
        return this.renderApp;
    }
}
_XElem_isRenderReady = new WeakMap();
// #endregion 🟩🟩🟩 XElem 🟩🟩🟩