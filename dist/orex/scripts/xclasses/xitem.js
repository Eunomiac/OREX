
// ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮
import { 
// ====== GreenSock Animation ======
gsap, 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, DB, XElem, XROOT, XGroup } from "../helpers/bundler.js";
const LISTENERS = [
    ["mousemove", (event) => {
            XItem.LogMouseMove(event.pageX, event.pageY);
        }]
];
export default class XItem extends Application {
    // ▮▮▮▮▮▮▮[Subclass Static Overrides] Methods Subclasses will Have to Override ▮▮▮▮▮▮▮
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: ["x-item"],
            template: U.getTemplatePath("xitem"),
            isFreezingRotate: false,
            postRenderVars: {
                xPercent: -50,
                yPercent: -50,
                x: 0,
                y: 0,
                opacity: 0,
                rotation: 0,
                scale: 1,
                transformOrigin: "50% 50%"
            }
        });
    }
    static REGISTRY = new Map();
    // ▮▮▮▮▮▮▮[Static Registration] Registration & Retrieval of XItem Instances ▮▮▮▮▮▮▮
    // protected static get Structor() { return this.constructor as typeof XItem }
    static Register(xItem) {
        this.REGISTRY.set(xItem.id, xItem);
    }
    static Unregister(xItem) {
        this.REGISTRY.delete(typeof xItem === "string" ? xItem : xItem.id);
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
    xParent;
    #xKids = new Set();
    #renderOptions = {
        preRenderFuncs: [],
        postRenderFuncs: [],
        postRenderVars: {},
        postInitFuncs: []
    };
    get preRenderFuncs() { return this.#renderOptions.preRenderFuncs; }
    get postRenderFuncs() { return this.#renderOptions.postRenderFuncs; }
    get postRenderVars() {
        return U.objMerge(this.constructor.defaultOptions.postRenderVars, this.#renderOptions.postRenderVars);
    }
    get postInitFuncs() { return this.#renderOptions.postInitFuncs; }
    constructor(xParent, renderOptions = {}, id = "") {
        const options = { id: id ?? "" };
        if (xParent) {
            options.id = U.getUID(`${xParent.id}-${options.id}`.replace(/^XROOT-?/, "X-"));
        }
        DB.display(`[#${options.id}] Constructing START`);
        super(options);
        this.#renderOptions = renderOptions;
        if (xParent === null && id === "XROOT") {
            this.xParent = null;
        }
        else {
            this.xParent = xParent ?? XROOT.XROOT;
        }
        this.xElem = new XElem(this);
        DB.log(`[#${options.id}] END Constructing`);
    }
    renderApp = this;
    get tweens() { return this.xElem.tweens; }
    get elem() { return this.xElem.elem; }
    get elem$() { return this.xElem.elem$; }
    #initializePromise;
    get initializePromise() { return this.#initializePromise; }
    async initialize(renderOptions = {}) {
        if (this.initializePromise) {
            // DB.info(`[#${this.id}] Ignoring Initialize(): Already Promised!`, new Error().stack);
            return this.initializePromise;
        }
        else {
            DB.display(`[#${this.id}] Initializing START`);
        }
        this.#initializePromise = Promise.resolve(this);
        this.onRenderOptions = {
            ...this.onRenderOptions,
            ...renderOptions
        };
        DB.display(`[#${this.id}] END Initializing: Setting Initial Render Options ...`);
        this.set(this.renderOptions);
        return this.#initializePromise;
    }
    get isRendered() { return this.rendered; }
    // isInitialized(): this is lockedXItem<typeof this> { return Boolean(this.#initializePromise) }
    get x() { return this.xElem.x; }
    get y() { return this.xElem.y; }
    get pos() { return this.xElem.pos; }
    get rotation() { return this.xElem.rotation; }
    get scale() { return this.xElem.scale; }
    get origin() { return this.xElem.origin; }
    get global() { return this.xElem.global; }
    get height() { return this.xElem.height; }
    get width() { return this.xElem.width; }
    get size() { return this.xElem.size; }
    isFreezingRotate = false;
    get getDistanceTo() { return this.xElem.getDistanceTo.bind(this.xElem); }
    get getGlobalAngleTo() { return this.xElem.getGlobalAngleTo.bind(this.xElem); }
    async render() {
        try {
            await this._render(true, {});
            // await this.initialize();
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
    adopt(child, isRetainingPosition = true) {
        this.xElem.adopt(child, isRetainingPosition);
    }
    disown(child) {
        this.xElem.disown(child);
    }
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
    get tweenTimeScale() { return this.xElem.tweenTimeScale.bind(this.xElem); }
    kill() {
        if (this instanceof XGroup && this.hasKids) {
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