// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #region ====== GreenSock Animation ====== ~
gsap, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, DB, XGroup } from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮
const LISTENERS = [
    ["mousemove", (event) => {
            XROOT.LogMouseMove(event.pageX, event.pageY);
        }]
];
class XBaseItem extends Application {
    // #region ▮▮▮▮▮▮▮[Virtual Properties] Fields & Methods Subclasses Will Have to Override ▮▮▮▮▮▮▮ ~
    static get defaultOptions() {
        const defaultXOptions = {
            id: "XBASE_ITEM",
            classes: [],
            template: U.getTemplatePath("xitem"),
            isFreezingRotate: false,
            vars: {
                xPercent: -50,
                yPercent: -50,
                x: 0,
                y: 0,
                opacity: 0,
                rotation: 0,
                scale: 1,
                transformOrigin: "50% 50%"
            }
        };
        return U.objMerge({
            ...super.defaultOptions,
            popOut: false
        }, defaultXOptions);
    }
    static REGISTRY = new Map();
    xParent; //~ null only in the single case of the top XItem, XROOT.XROOT
    // #endregion ▮▮▮▮[Virtual Properties]▮▮▮▮
    // #region ▮▮▮▮▮▮▮[Static Registration] Registration & Retrieval of XItem Instances ▮▮▮▮▮▮▮ ~
    static Register(xItem) { this.REGISTRY.set(xItem.id, xItem); }
    static Unregister(xItem) { this.REGISTRY.delete(typeof xItem === "string" ? xItem : xItem.id); }
    static get All() { return Array.from(this.REGISTRY.values()); }
    static GetFromElement(elem) { return this.REGISTRY.get(elem.id); }
    // #endregion ▮▮▮▮[Static Registration]▮▮▮▮
    // #region ████████ CONSTRUCTOR & Essential Fields ████████ ~
    constructor(xParent, xOptions = {}) {
        xOptions.id ??= "X";
        if (xParent) {
            xOptions.id = U.getUID(`${xParent.id}-${xOptions.id}`);
        }
        DB.display(`[#${xOptions.id}] Constructing START`);
        super(xOptions);
        if (this instanceof XROOT) {
            this.xParent = null;
        }
        else {
            this.xParent = xParent ?? XROOT.XROOT;
        }
        this.isFreezingRotate = this.options.isFreezingRotate ?? false;
        DB.log(`[#${this.id}] END Constructing`);
    }
    // #endregion ▄▄▄▄▄ CONSTRUCTOR ▄▄▄▄▄
    get elem() { return this.element[0]; }
    get elem$() { return $(this.elem); }
    // #region ████████ Positioning: Positioning DOM Element in Local and Global (XROOT) Space ████████ ~
    // #region ░░░░░░░ Local Space ░░░░░░░ ~
    get x() { return U.pInt(this.rendered ? U.get(this.elem, "x", "px") : this.vars.x); }
    get y() { return U.pInt(this.rendered ? U.get(this.elem, "y", "px") : this.vars.y); }
    get pos() { return { x: this.x, y: this.y }; }
    get height() { return U.pInt(this.rendered ? U.get(this.elem, "height", "px") : this.vars.height); }
    get width() { return U.pInt(this.rendered ? U.get(this.elem, "width", "px") : this.vars.width); }
    get size() { return (this.height + this.width) / 2; }
    get rotation() { return U.cycleAngle(U.pFloat(this.rendered ? U.get(this.elem, "rotation") : this.vars.rotation, 2), [-180, 180]); }
    get scale() { return U.pFloat(this.rendered ? U.get(this.elem, "scale") : this.vars.scale, 2) || 1; }
    get origin() {
        return {
            x: -1 * U.pInt((this.rendered ? U.get(this.elem, "xPercent") : this.vars.xPercent)) * this.width,
            y: -1 * U.pInt((this.rendered ? U.get(this.elem, "yPercent") : this.vars.yPercent)) * this.height
        };
    }
    // #endregion ░░░░[Local Space]░░░░
    // #region ░░░░░░░ Global (XROOT) Space ░░░░░░░ ~
    get global() {
        const self = this;
        return {
            get pos() {
                return MotionPathPlugin.convertCoordinates(self.elem, XROOT.XROOT.elem, self.origin);
            },
            get x() { return this.pos.x; },
            get y() { return this.pos.y; },
            get height() { return self.height; },
            get width() { return self.width; },
            get rotation() {
                let totalRotation = self.rotation, { xParent } = self;
                while (xParent?.rendered) {
                    totalRotation += xParent.rotation;
                    ({ xParent } = xParent);
                }
                return U.cycleAngle(totalRotation, [-180, 180]);
            },
            get scale() {
                let totalScale = self.scale, { xParent } = self;
                while (xParent?.rendered) {
                    totalScale *= xParent.scale;
                    ({ xParent } = xParent);
                }
                return totalScale;
            }
        };
    }
    // #endregion ░░░░[Global (XROOT) Space]░░░░
    // #region ░░░░░░░ Converting from Global Space to Element's Local Space ░░░░░░░ ~
    getLocalPosData(ofItem, globalPoint) {
        return {
            ...MotionPathPlugin.convertCoordinates(XROOT.XROOT.elem, this.elem, globalPoint ?? ofItem.global.pos),
            rotation: U.cycleAngle(ofItem.global.rotation - this.global.rotation, [-180, 180]),
            scale: ofItem.global.scale / this.global.scale,
            height: ofItem.height,
            width: ofItem.width
        };
    }
    // #endregion ░░░░[Global to Local]░░░░
    // #region ░░░░░░░ Relative Positions ░░░░░░░ ~
    getDistanceTo(posRef, globalPoint) {
        const { x: tGlobalX, y: tGlobalY } = posRef instanceof XItem ? posRef.global : posRef;
        return U.getDistance({ x: tGlobalX, y: tGlobalY }, globalPoint ?? this.global);
    }
    getGlobalAngleTo(posRef, globalPoint) {
        const { x: tGlobalX, y: tGlobalY } = posRef instanceof XItem ? posRef.global : posRef;
        return U.getAngle({ x: tGlobalX, y: tGlobalY }, globalPoint ?? this.global);
    }
    // #endregion ░░░░[Relative Positions]░░░░
    // #endregion ▄▄▄▄▄ Positioning ▄▄▄▄▄
    // #region ████████ Rendering: Initial Rendering to DOM ████████ ~
    get vars() { return this.options.vars; }
    get isVisible() { return U.get(this.elem, "opacity") > 0; }
    _renderPromise;
    async render() {
        return (this._renderPromise = this._renderPromise
            ?? this._render(true, {})
                .then(() => {
                if (this.xParent) {
                    $(this.elem).appendTo(this.xParent.elem);
                }
                this.set(this.vars);
                return this;
            }));
    }
    // #endregion ▄▄▄▄▄ Rendering ▄▄▄▄▄
    // #region ████████ Tickers: Management of gsap.ticker Functions ████████ ~
    _tickers = new Set();
    addTicker(func) {
        this._tickers.add(func);
        gsap.ticker.add(func);
    }
    removeTicker(func) {
        this._tickers.delete(func);
        gsap.ticker.remove(func);
    }
    // #endregion ▄▄▄▄▄ Tickers ▄▄▄▄▄
    // #region ████████ GSAP: GSAP Animation Method Wrappers ████████ ~
    tweens = {};
    isFreezingRotate = false;
    /*~ Figure out a way to have to / from / fromTo methods on all XItems that:
            - will adjust animation timescale based on a maximum time to maximum distance ratio(and minspeed ratio ?)
            - if timescale is small enough, just uses.set() ~*/
    tweenTimeScale(tweenID, timeScale = 1, duration = 1) {
        const tween = this.tweens[tweenID];
        return gsap.to(tween, {
            timeScale,
            duration,
            ease: "sine.inOut"
        });
    }
    scaleTween(tween, vars, fromVal) {
        const duration = tween.duration();
        const { target, maxDelta, minDur = 0 } = vars.scaling ?? {};
        if (typeof target === "string" && typeof maxDelta === "number") {
            const startVal = U.get(this.elem, target);
            const endVal = fromVal ?? vars[target];
            if (typeof startVal === "number" && typeof duration === "number") {
                const delta = endVal - startVal;
                let scaleFactor = delta / maxDelta;
                if (minDur > 0 && (duration * scaleFactor) < minDur) {
                    scaleFactor = duration / minDur;
                }
                tween.timeScale(scaleFactor);
            }
        }
        return tween;
    }
    set(vars) {
        return gsap.set(this.elem, vars);
    }
    to(vars) {
        const { scaling, ...gsapVars } = vars;
        const tween = gsap.to(this.elem, gsapVars);
        if (vars.id) {
            this.tweens[vars.id] = tween;
        }
        if (vars.scaling) {
            this.scaleTween(tween, vars);
        }
        return tween;
    }
    from(vars) {
        const { scaling, ...gsapVars } = vars;
        const tween = gsap.from(this.elem, gsapVars);
        if (vars.id) {
            this.tweens[vars.id] = tween;
        }
        if (scaling) {
            const fromVal = vars[scaling.target];
            if (typeof U.get(this.elem, scaling.target) === "number") {
                this.scaleTween(tween, {
                    scaling,
                    ...vars,
                    [scaling.target]: U.get(this.elem, scaling.target)
                }, fromVal);
            }
        }
        return tween;
    }
    fromTo(fromVars, toVars) {
        const { scaling, ...gsapToVars } = toVars;
        const tween = gsap.fromTo(this.elem, fromVars, toVars);
        if (toVars.id) {
            this.tweens[toVars.id] = tween;
        }
        if (scaling) {
            const fromVal = fromVars[scaling.target] ?? U.get(this.elem, scaling.target);
            this.scaleTween(tween, toVars, typeof fromVal === "number" ? fromVal : U.pInt(U.get(this.elem, scaling.target)));
        }
        return tween;
    }
    // #endregion ▄▄▄▄▄ GSAP ▄▄▄▄▄
    async kill() {
        this._tickers.forEach((func) => gsap.ticker.remove(func));
        this._tickers.clear();
        this.xParent?.unregisterXKid(this);
        if (this.rendered) {
            gsap.killTweensOf(this.elem);
            this.elem$.remove();
        }
    }
    getData() {
        const context = super.getData();
        Object.assign(context, {
            id: this.id,
            classes: this.options.classes.join(" ")
        });
        return context;
    }
}
export class XBaseContainer extends XBaseItem {
    // #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
    static REGISTRY = new Map();
    // #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮
    #xKids = new Set();
    registerXKid(xKid) { this.#xKids.add(xKid); }
    unregisterXKid(xKid) { this.#xKids.delete(xKid); }
    get hasXKids() { return this.#xKids.size > 0; }
    get xKids() { return Array.from(this.#xKids); }
    getXKids(classRef, isGettingAll = false) {
        const xKids = Array.from(this.xKids.values())
            .flat()
            .filter(U.FILTERS.IsInstance(classRef));
        if (isGettingAll) {
            xKids.push(...xKids
                .map((xKid) => (xKid instanceof XGroup ? xKid.getXKids(classRef, true) : []))
                .flat());
        }
        return xKids;
    }
    // #region ████████ Parenting: Adopting & Managing Child XItems ████████ ~
    adoptElem(elem) {
        if (!this.rendered) {
            return;
        }
        let elem$;
        if (elem instanceof XBaseItem) {
            if (!elem.rendered) {
                return;
            }
            ({ elem$ } = elem);
        }
        else if (elem instanceof HTMLElement) {
            elem$ = $(elem);
        }
        else {
            elem$ = elem;
        }
        elem$.appendTo(this.elem);
    }
    async adopt(children) {
        const promises = [children].flat()
            .map(async (child) => {
            if (!this.#xKids.has(child)) {
                await child.xParent?.disown(child);
                child.xParent = this;
                this.registerXKid(child);
            }
            if (!this.rendered) {
                return child;
            }
            if (child.rendered) {
                child.set({
                    ...this.getLocalPosData(child),
                    ...child.isFreezingRotate
                        ? { rotation: -1 * this.global.rotation }
                        : {}
                });
            }
            else {
                await child.render();
            }
            this.adoptElem(child);
            return child;
        });
        if (promises.length === 1) {
            return promises[0];
        }
        return Promise.all(promises);
    }
    async disown(children) {
        [children].flat().forEach((xKid) => this.unregisterXKid(xKid));
    }
    async kill() {
        this.xKids.forEach((xKid) => xKid.kill());
        super.kill();
    }
    async render() {
        if (this._renderPromise) {
            return this._renderPromise;
        }
        const superPromise = super.render();
        this._renderPromise = superPromise
            .then(async () => {
            await this.adopt(this.xKids);
            return this;
        });
        return this._renderPromise;
    }
}
// #region 🟩🟩🟩 XROOT: Base Container for All XItems - Only XItem that Doesn't Need an XParent 🟩🟩🟩 ~
export class XROOT extends XBaseContainer {
    // #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
    static get defaultOptions() {
        const defaultXOptions = {
            id: "XROOT",
            classes: ["XROOT"],
            template: U.getTemplatePath("xroot"),
            isFreezingRotate: false,
            vars: {
                xPercent: 0,
                yPercent: 0,
                opacity: 1
            }
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    xParent = null;
    // #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮
    constructor() {
        super(null, {});
    }
    static #XROOT;
    static get XROOT() { return XROOT.#XROOT; }
    static async InitializeXROOT() {
        XROOT.XROOT?.kill();
        XROOT.#XROOT = new XROOT();
        await XROOT.#XROOT.render();
        return XROOT.#XROOT;
    }
    // #region ▮▮▮▮▮▮▮[Mouse Tracking] Centralized Listener for Track Mouse Cursor ▮▮▮▮▮▮▮ ~
    static #lastMouseUpdate = Date.now();
    static #mousePos = { x: 0, y: 0 };
    static LogMouseMove(x, y) {
        if (Date.now() - this.#lastMouseUpdate > 1000) {
            this.#lastMouseUpdate = Date.now();
            this.#mousePos = { x, y };
        }
        this.All
            .filter((xItem) => xItem instanceof XGroup && xItem.xParent === XROOT.XROOT)
            .forEach((xGroup) => {
            // https://greensock.com/forums/topic/17899-what-is-the-cleanest-way-to-tween-a-var-depending-on-the-cursor-position/
            // https://greensock.com/forums/topic/18717-update-tween-based-on-mouse-position/
        });
    }
}
// #endregion 🟩🟩🟩 XROOT 🟩🟩🟩
export default class XItem extends XBaseItem {
    // #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
    static get defaultOptions() {
        const defaultXOptions = {
            id: "XITEM",
            classes: ["x-item"],
            template: U.getTemplatePath("xitem"),
            isFreezingRotate: false,
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    // #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
    }
}