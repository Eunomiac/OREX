
// ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮
import { 
// ====== GreenSock Animation ======
gsap, 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, DB, XElem, XROOT, XGroup
 } from "../helpers/bundler.js";
const LISTENERS = [
    ["mousemove", (event) => {
            XItem.LogMouseMove(event.pageX, event.pageY);
        }]
];
export default class XItem extends Application {
    // ▮▮▮▮▮▮▮[Subclass Static Overrides] Methods Subclasses will Have to Override ▮▮▮▮▮▮▮
    static async Make(xParent, options, onRenderOptions) {
        const xItem = new this.constructor(xParent, options, onRenderOptions);
        await xItem.render();
        xParent.adopt(xItem);
        this.constructor.Register?.(xItem);
        xItem.set(onRenderOptions);
        return xItem;
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: ["x-item"],
            template: U.getTemplatePath("xitem"),
            isFreezingRotate: false
        });
    }
    static REGISTRY = new Map();
    // ▮▮▮▮▮▮▮[Static Registration] Registration & Retrieval of XItem Instances ▮▮▮▮▮▮▮
    static get Structor() { return this.constructor; }
    static Register(xItem) {
        this.Structor.REGISTRY.set(xItem.id, xItem);
    }
    static Unregister(xItem) {
        this.Structor.REGISTRY.delete(typeof xItem === "string" ? xItem : xItem.id);
    }
    static GetAll() {
        return Array.from(this.REGISTRY.values());
    }
    static GetFromElement(elem) {
        if (this.REGISTRY.has(elem.id)) {
            return this.REGISTRY.get(elem.id);
        }
        return false;
    }
    // ▮▮▮▮▮▮▮[Mouse Tracking] Centralized Listener for Track Mouse Cursor ▮▮▮▮▮▮▮
    static #lastMouseUpdate = Date.now();
    static #mousePos = { x: 0, y: 0 };
    static LogMouseMove(x, y) {
        if (Date.now() - this.#lastMouseUpdate > 1000) {
            this.#lastMouseUpdate = Date.now();
            this.#mousePos = { x, y };
        }
        this.GetAll()
            .filter((xItem) => xItem instanceof XGroup && xItem.xParent === XROOT.XROOT)
            .forEach((xGroup) => {
            // https://greensock.com/forums/topic/17899-what-is-the-cleanest-way-to-tween-a-var-depending-on-the-cursor-position/
            // https://greensock.com/forums/topic/18717-update-tween-based-on-mouse-position/
        });
    }
    // ████████ CONSTRUCTOR & Essential Fields ████████
    xElem;
    _xParent;
    #xKids = new Set();
    xOptions;
    onRenderOptions = {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        transformOrigin: "50% 50%"
    };
    constructor(xParent, { classes = [], ...xOptions }, onRenderOptions) {
        if (xParent) {
            xOptions.id = U.getUID(`${xParent.id}-${xOptions.id}`.replace(/^XROOT-?/, "X-"));
        }
        DB.display(`[#${xOptions.id}] Constructing START`);
        super(xOptions);
        this.options.classes.push(...classes);
        this.onRenderOptions = {
            xPercent: -50,
            yPercent: -50,
            transformOrigin: "50% 50%",
            x: 0,
            y: 0,
            ...onRenderOptions
        };
        this.xOptions = {
            ...xOptions,
            ...this.options
        };
        if (xParent === null && xOptions.id === "XROOT") {
            this._xParent = null;
        }
        else {
            this._xParent = xParent ?? XROOT.XROOT;
        }
        this.xElem = new XElem(this);
        DB.log(`[#${xOptions.id}] END Constructing`);
    }
    get elem() { return this.xElem.elem; }
    get elem$() { return this.xElem.elem$; }
    get tweens() { return this.xElem.tweens; }
    get xParent() { return this._xParent; }
    set xParent(xParent) { this._xParent = xParent ?? XROOT.XROOT; }
    get xKids() { return this.#xKids; }
    get hasKids() { return this.xKids.size > 0; }
    registerXKid(xKid) {
        if (xKid instanceof XItem) {
            xKid.xParent = this;
            this.xKids.add(xKid);
        }
    }
    unregisterXKid(xKid) {
        this.xKids.delete(xKid);
    }
    getXKids(classRef, isGettingAll = false) {
        const xKids = Array.from(this.xKids.values())
            .flat()
            .filter(U.FILTERS.IsInstance(classRef));
        if (isGettingAll) {
            xKids.push(...Array.from(this.xKids.values()).map((xKid) => xKid.getXKids(classRef, true)).flat());
        }
        return xKids;
    }
    #initializePromise;
    get initializePromise() { return this.#initializePromise; }
    async initialize(renderOptions = {}) {
        if (this.initializePromise) {
            DB.info(`[#${this.id}] Ignoring Initialize(): Already Promised!`, new Error().stack);
            return this.initializePromise;
        }
        else {
            DB.display(`[#${this.id}] Initializing START`);
        }
        this.onRenderOptions = {
            ...this.onRenderOptions,
            ...renderOptions
        };
        DB.display(`[#${this.id}] END Initializing: Setting Initial Render Options ...`);
        this.set(this.onRenderOptions);
        return Promise.allSettled(this.getXKids(XItem).map((xItem) => xItem.initialize({})))
            .then(() => Promise.resolve(this), () => Promise.reject());
    }
    get isRendered() { return this.rendered; }
    get isInitialized() { return Boolean(this.#initializePromise); }
    get x() { return this.xElem.x; }
    get y() { return this.xElem.y; }
    get pos() { return this.xElem.pos; }
    get rotation() { return this.xElem.rotation; }
    get scale() { return this.xElem.scale; }
    get global() { return this.xElem.global; }
    get height() { return this.xElem.height; }
    get width() { return this.xElem.width; }
    get size() { return this.xElem.size; }
    get getDistanceTo() { return this.xElem.getDistanceTo.bind(this.xElem); }
    get getGlobalAngleTo() { return this.xElem.getGlobalAngleTo.bind(this.xElem); }
    get renderApp() { return this; }
    async render() {
        try {
            await this._render(true, {});
            return Promise.resolve(this);
        }
        catch (err) {
            this._state = Application.RENDER_STATES.ERROR;
            Hooks.onError("Application#render", err, {
                msg: `An error occurred while rendering ${this.constructor.name} ${this.appId}`,
                log: "error"
            });
            return Promise.reject(`An error occurred while rendering ${this.constructor.name} ${this.appId}`);
        }
    }
    get adopt() { return this.xElem.adopt.bind(this.xElem); }
    _tickers = new Set();
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
        if (this.hasKids) {
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
}