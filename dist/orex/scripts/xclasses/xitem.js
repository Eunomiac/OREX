
// ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮
import { 
// ====== GreenSock Animation ======
gsap, 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, DB, XElem, XGroup
 } from "../helpers/bundler.js";
const LISTENERS = [
    ["mousemove", (event) => {
            XItem.LogMouseMove(event.pageX, event.pageY);
        }]
];
export default class XItem extends Application {
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
    static #XROOT;
    static get XROOT() { return XItem.#XROOT; }
    static async InitializeXROOT() {
        if (XItem.XROOT) {
            XItem.XROOT.kill();
        }
        XItem.#XROOT = new XItem(null, {
            id: "XROOT",
            onRender: {
                set: {
                    xPercent: 0,
                    yPercent: 0
                }
            }
        });
        return XItem.#XROOT.initialize();
    }
    static REGISTRY = new Map();
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
    static #lastMouseUpdate = Date.now();
    static #mousePos = { x: 0, y: 0 };
    static LogMouseMove(x, y) {
        if (Date.now() - this.#lastMouseUpdate > 1000) {
            this.#lastMouseUpdate = Date.now();
            this.#mousePos = { x, y };
        }
        this.GetAll()
            .filter((xItem) => xItem instanceof XGroup && xItem.xParent === XItem.XROOT)
            .forEach((xGroup) => {
            // https://greensock.com/forums/topic/17899-what-is-the-cleanest-way-to-tween-a-var-depending-on-the-cursor-position/
            // https://greensock.com/forums/topic/18717-update-tween-based-on-mouse-position/
        });
    }
    #isInitialized = false;
    #xParent;
    #xKids = new Set();
    isFreezingRotate = false; // ~set to 'true' to always maintain 0 rotation (e.g. for xTerms)
    xOptions;
    xElem;
    get elem() { return this.xElem.elem; }
    get elem$() { return this.xElem.elem$; }
    get xParent() { return this.#xParent; }
    set xParent(xParent) { this.#xParent = xParent ?? XItem.XROOT; }
    get xKids() { return this.#xKids; }
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
    constructor(xParent, { classes = [], ...xOptions }) {
        if (xParent) {
            xOptions.id = U.getUID(`${xParent.id}-${xOptions.id}`.replace(/^X?ROOT-?/, "X-"));
        }
        super(xOptions);
        // this.constructor().Register(this);
        this.options.classes.push(...classes);
        this.xOptions = Object.assign(xOptions, this.options);
        if (xParent === null) {
            this.#xParent = null;
        }
        else {
            this.#xParent = xParent ?? XItem.XROOT;
        }
        this.xElem = new XElem(this, {
            onRender: this.xOptions.onRender
        });
        this.constructor.Register(this);
    }
    async initialize() {
        if (this.isInitialized) {
            return Promise.resolve(true);
        }
        if (await this.xElem.confirmRender(true)) {
            return Promise.allSettled(this.getXKids(XItem).map((xItem) => xItem.initialize()))
                .then(() => { this.#isInitialized = true; return Promise.resolve(true); }, () => Promise.resolve(false));
        }
        return Promise.resolve(false);
    }
    get isRendered() { return this.rendered; }
    get isInitialized() { return this.#isInitialized; }
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
    get getDistanceTo() { return this.xElem.getDistanceTo.bind(this.xElem); }
    get getGlobalAngleTo() { return this.xElem.getGlobalAngleTo.bind(this.xElem); }
    get confirmRender() { return this.xElem.confirmRender.bind(this.xElem); }
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