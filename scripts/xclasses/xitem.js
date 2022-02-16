// #region ████████ IMPORTS ████████ ~
import { 
// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
gsap, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, XElem
// #endregion ▮▮▮▮[Utility]▮▮▮▮
 } from "../helpers/bundler.js";
export default class XItem extends Application {
    constructor(xOptions) {
        super(xOptions);
        this._isInitialized = false; //~ xItem is rendered, parented, and onRender queues emptied
        this._xChildren = new Set();
        this._TICKERS = new Set();
        this.xOptions = xOptions;
        if (xOptions.parent === null) {
            this._parent = null;
        }
        else if (xOptions.parent instanceof XItem) {
            this._parent = xOptions.parent;
        }
        else {
            this._parent = XItem.XROOT;
        }
        this.xElem = new XElem({
            renderApp: this,
            onRender: xOptions.onRender
        });
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: [...super.defaultOptions.classes, "x-item"],
            template: U.getTemplatePath("xitem")
        });
    }
    static get XROOT() { return XItem._XROOT; }
    static async InitializeXROOT() {
        if (XItem.XROOT) {
            XItem.XROOT.kill();
        }
        XItem._XROOT = new XItem({ id: "x-root", parent: null });
        return XItem._XROOT.initialize();
    }
    get elem() { return this.xElem.elem; }
    get elem$() { return this.xElem.elem$; }
    get parent() { return this._parent; }
    set parent(parent) {
        this._parent = parent ?? XItem.XROOT;
        if (this.isRendered && this._parent.isRendered) {
            this._parent.adopt(this);
        }
    }
    get xChildren() { return this._xChildren; }
    get hasChildren() { return this.xChildren.size > 0; }
    registerChild(child) { this.xChildren.add(child); }
    unregisterChild(child) { this.xChildren.delete(child); }
    getXChildren(classRef, isGettingAll = false) {
        const classCheck = U.isUndefined(classRef) ? XItem : classRef;
        if (isGettingAll) {
            return Array.from(this.xChildren.values())
                .map((xItem) => xItem.getXChildren(undefined, true))
                .flat()
                .filter((xItem) => xItem instanceof classCheck);
        }
        return Array.from(this.xChildren.values()).filter((xItem) => xItem instanceof classCheck);
    }
    async initialize() {
        if (this.isInitialized) {
            return Promise.resolve(true);
        }
        if (await this.xElem.confirmRender(true)) {
            return Promise.allSettled(this.getXChildren().map((xItem) => xItem.initialize()))
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
            this.getXChildren().forEach((xItem) => xItem.kill());
        }
        this._TICKERS.forEach((func) => gsap.ticker.remove(func));
        this._TICKERS.clear();
        if (this.parent instanceof XItem) {
            this.parent.unregisterChild(this);
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
            console.warn("Attempt to render an unready Application");
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