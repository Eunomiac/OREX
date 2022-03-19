var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _XItem_XROOT, _XItem_isInitialized, _XItem_xParent, _XItem_xKids;
// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #region ====== GreenSock Animation ====== ~
gsap, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, DB, XElem } from "../helpers/bundler.js";
export default class XItem extends Application {
    constructor(xParent, { classes = [], ...xOptions }) {
        if (xParent) {
            xOptions.id = U.getUID(`${xParent.id}-${xOptions.id}`.replace(/^X?ROOT-?/, "X-"));
        }
        super(xOptions);
        _XItem_isInitialized.set(this, false); //~ xItem is rendered, parented, and onRender queues emptied
        _XItem_xParent.set(this, void 0); //~ null only in the single case of the top XItem, XItem.XROOT
        _XItem_xKids.set(this, new Set());
        this._tickers = new Set();
        // this.constructor().Register(this);
        this.options.classes.push(...classes);
        this.xOptions = Object.assign(xOptions, this.options);
        if (xParent === null) {
            __classPrivateFieldSet(this, _XItem_xParent, null, "f");
        }
        else {
            __classPrivateFieldSet(this, _XItem_xParent, xParent ?? XItem.XROOT, "f");
        }
        this.xElem = new XElem(this, {
            onRender: this.xOptions.onRender
        });
        this.constructor.Register(this);
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: ["x-item"],
            template: U.getTemplatePath("xitem"),
            xParent: XItem.XROOT,
            onRender: {
                set: {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    xPercent: -50,
                    yPercent: -50,
                    transformOrigin: "50% 50%"
                }
            }
        });
    }
    static get XROOT() { return __classPrivateFieldGet(XItem, _a, "f", _XItem_XROOT); }
    static async InitializeXROOT() {
        if (XItem.XROOT) {
            XItem.XROOT.kill();
        }
        __classPrivateFieldSet(XItem, _a, new XItem(null, {
            id: "XROOT",
            onRender: {
                set: {
                    xPercent: 0,
                    yPercent: 0
                }
            }
        }), "f", _XItem_XROOT);
        return __classPrivateFieldGet(XItem, _a, "f", _XItem_XROOT).initialize();
    }
    static Register(xItem) {
        xItem.constructor.REGISTRY.set(xItem.id, xItem);
    }
    static Unregister(xItem) {
        xItem.constructor.REGISTRY.delete(typeof xItem === "string" ? xItem : xItem.id);
    }
    static GetAll() {
        return Array.from(this.REGISTRY.values());
    }
    get elem() { return this.xElem.elem; }
    get elem$() { return this.xElem.elem$; }
    get xParent() { return __classPrivateFieldGet(this, _XItem_xParent, "f"); }
    set xParent(xParent) { __classPrivateFieldSet(this, _XItem_xParent, xParent ?? XItem.XROOT, "f"); }
    get xKids() { return __classPrivateFieldGet(this, _XItem_xKids, "f"); }
    get hasChildren() { return this.xKids.size > 0; }
    registerXKid(xKid) { xKid.xParent = this; this.xKids.add(xKid); }
    unregisterXKid(xKid) { this.xKids.delete(xKid); }
    getXKids(classRef, isGettingAll = false) {
        const xKids = Array.from(this.xKids.values())
            .flat()
            .filter(U.isInstanceFunc(classRef));
        if (isGettingAll) {
            xKids.push(...Array.from(this.xKids.values()).map((xKid) => xKid.getXKids(classRef, true)).flat());
        }
        return xKids;
    }
    async initialize() {
        if (this.isInitialized) {
            return Promise.resolve(true);
        }
        if (await this.xElem.confirmRender(true)) {
            return Promise.allSettled(this.getXKids(XItem).map((xItem) => xItem.initialize()))
                .then(() => { __classPrivateFieldSet(this, _XItem_isInitialized, true, "f"); return Promise.resolve(true); }, () => Promise.resolve(false));
        }
        return Promise.resolve(false);
    }
    get isRendered() { return this.rendered; }
    get isInitialized() { return __classPrivateFieldGet(this, _XItem_isInitialized, "f"); }
    get x() { return this.xElem.x; }
    get y() { return this.xElem.y; }
    get pos() { return this.xElem.pos; }
    get rotation() { return this.xElem.rotation; }
    get scale() { return this.xElem.scale; }
    get global() { return this.xElem.global; }
    get height() { return this.xElem.height; }
    get width() { return this.xElem.width; }
    get size() { return this.xElem.size; }
    get radius() { return this.xElem.radius; }
    get confirmRender() { return this.xElem.confirmRender.bind(this.xElem); }
    get adopt() { return this.xElem.adopt.bind(this.xElem); }
    addTicker(func) {
        this._tickers.add(func);
        gsap.ticker.add(func);
    }
    removeTicker(func) {
        this._tickers.delete(func);
        gsap.ticker.remove(func);
    }
    get set() { return this.xElem.set.bind(this.xElem); }
    get to() { return this.xElem.to.bind(this.xElem); }
    get from() { return this.xElem.from.bind(this.xElem); }
    get fromTo() { return this.xElem.fromTo.bind(this.xElem); }
    kill() {
        if (this.hasChildren) {
            this.getXKids(XItem).forEach((xItem) => xItem.kill());
        }
        this._tickers.forEach((func) => gsap.ticker.remove(func));
        this._tickers.clear();
        if (this.xParent instanceof XItem) {
            this.xParent.unregisterXKid(this);
        }
        if (this.isRendered) {
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
    async renderApplication() {
        if (!this.xElem.isRenderReady) {
            DB.error("Attempt to render an unready Application");
            return Promise.resolve(false);
        }
        try {
            await this._render(true, {});
            return Promise.resolve(true);
        }
        catch (err) {
            this._state = Application.RENDER_STATES.ERROR;
            Hooks.onError("Application#render", err, {
                msg: `An error occurred while rendering ${this.constructor.name} ${this.appId}`,
                log: "error"
            });
            return Promise.resolve(false);
        }
    }
}
_a = XItem, _XItem_isInitialized = new WeakMap(), _XItem_xParent = new WeakMap(), _XItem_xKids = new WeakMap();
_XItem_XROOT = { value: void 0 };
XItem.REGISTRY = new Map();