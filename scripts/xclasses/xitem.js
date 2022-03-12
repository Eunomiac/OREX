// #region ████████ IMPORTS ████████ ~
import { 
// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
gsap, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, DB, XElem
// #endregion ▮▮▮▮[Utility]▮▮▮▮
 } from "../helpers/bundler.js";
export default class XItem extends Application {
    constructor(xParent, { classes = [], ...xOptions }) {
        if (!xOptions.keepID) {
            xOptions.id += U.getUID();
        }
        super(xOptions);
        this._isInitialized = false; //~ xItem is rendered, parented, and onRender queues emptied
        this._xKids = new Set();
        this._TICKERS = new Set();
        this.options.classes.push(...classes);
        this.xOptions = Object.assign(xOptions, this.options);
        if (xParent === null) {
            this._xParent = null;
        }
        else {
            this._xParent = xParent ?? XItem.XROOT;
        }
        this.xElem = new XElem({
            renderApp: this,
            onRender: this.xOptions.onRender
        });
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
    static get XROOT() { return XItem._XROOT; }
    static async InitializeXROOT() {
        if (XItem.XROOT) {
            XItem.XROOT.kill();
        }
        XItem._XROOT = new XItem(null, {
            id: "x-root",
            keepID: true,
            onRender: {
                set: {
                    xPercent: 0,
                    yPercent: 0
                }
            }
        });
        return XItem._XROOT.initialize();
    }
    get elem() { return this.xElem.elem; }
    get elem$() { return this.xElem.elem$; }
    get xParent() { return this._xParent; }
    set xParent(xParent) { this._xParent = xParent ?? XItem.XROOT; }
    get xKids() { return this._xKids; }
    get hasChildren() { return this.xKids.size > 0; }
    registerXKid(xKid) { xKid.xParent = this; this.xKids.add(xKid); }
    unregisterXKid(xKid) { this.xKids.delete(xKid); }
    getXKids(classRef, isGettingAll = false) {
        if (isGettingAll) {
            return Array.from(this.xKids.values())
                .map((xItem) => xItem.getXKids(classRef, true))
                .flat()
                .filter(U.isInstanceFunc(classRef));
        }
        return Array.from(this.xKids.values())
            .flat()
            .filter(U.isInstanceFunc(classRef));
    }
    async initialize() {
        if (this.isInitialized) {
            return Promise.resolve(true);
        }
        if (await this.xElem.confirmRender(true)) {
            return Promise.allSettled(this.getXKids(XItem).map((xItem) => xItem.initialize()))
                .then(() => { this._isInitialized = true; return Promise.resolve(true); }, () => Promise.resolve(false));
        }
        return Promise.resolve(false);
    }
    get isRendered() { return this.rendered; }
    get isInitialized() { return this._isInitialized; }
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
        this._TICKERS.add(func);
        gsap.ticker.add(func);
    }
    removeTicker(func) {
        this._TICKERS.delete(func);
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
        this._TICKERS.forEach((func) => gsap.ticker.remove(func));
        this._TICKERS.clear();
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