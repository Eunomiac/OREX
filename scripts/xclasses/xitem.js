// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #region ====== GreenSock Animation ====== ~
gsap, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, XElem, XGroup
// #endregion ▮▮▮▮[Utility]▮▮▮▮
 } from "../helpers/bundler.js";
const LISTENERS = [
    ["mousemove", (event) => {
            XItem.LogMouseMove(event.pageX, event.pageY);
        }]
];
export class XROOT extends Application {
    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            popOut: false,
            template: U.getTemplatePath("xitem")
        };
    }
    static #XROOT;
    static async INITIALIZE() {
        if (this.#XROOT) {
            return this.#XROOT.xInitialize();
        }
        this.#XROOT = new XROOT();
        return this.#XROOT.xInitialize();
    }
    static RESET() { this.ROOT.kill(); }
    static get ROOT() {
        if (!this.#XROOT) {
            const err = {};
            Error.captureStackTrace(err);
            console.error(err.stack);
            throw new Error(`Can't reference XROOT.ROOT before XROOT.INITIALIZE()\n\n${JSON.stringify(err.stack, null, 2)}`);
        }
        return this.#XROOT;
    }
    get id() { return "XROOT"; }
    renderApp = this;
    get elem() { return this.element[0]; }
    get elem$() { return $(this.elem); }
    x = 0;
    y = 0;
    rotation = 0;
    scale = 1;
    pos = { x: 0, y: 0 };
    origin = { x: 0, y: 0 };
    #height;
    #width;
    #size;
    get height() { return (this.#height ??= U.get(this.elem, "height", "px")); }
    get width() { return (this.#width ??= U.get(this.elem, "width", "px")); }
    get size() { return (this.#size ??= (this.height + this.width) / 2); }
    get radius() { return this.size; }
    get global() { return this; }
    #xKids = new Set();
    get xKids() { return this.#xKids; }
    get hasKids() { return this.xKids.size > 0; }
    getXKids(classRef, isGettingAll = false) {
        const xKids = Array.from(this.xKids.values())
            .flat()
            .filter(U.isInstanceFunc(classRef));
        if (isGettingAll) {
            xKids.push(...Array.from(this.xKids.values()).map((xKid) => xKid.getXKids(classRef, true)).flat());
        }
        return xKids;
    }
    registerXKid(xKid) { this.xKids.add(xKid); }
    unregisterXKid(xKid) { this.xKids.delete(xKid); }
    constructor() {
        super({ id: "XROOT" });
    }
    #renderPromise;
    get isRendered() { return this.rendered; }
    get isInitialized() { return this.rendered; }
    onRender = {
        set: {
            xPercent: -50,
            yPercent: -50,
            x(_, elem) { return 0.5 * U.get(elem, "width", "px"); },
            y(_, elem) { return 0.5 * U.get(elem, "height", "px"); }
        },
        funcs: [
            () => this.getXKids(XItem).forEach((xItem) => this.adopt(xItem))
        ]
    };
    async xRender() {
        await this.renderApplication();
        $(this.elem).attr("id", "XROOT");
        U.set(this.elem, this.onRender.set);
        await Promise.all(this.onRender.funcs.map((renderFunc) => renderFunc()));
        return this;
    }
    xInitialize = this.xRender;
    async renderApplication() {
        if (this.rendered) {
            this.#renderPromise ??= Promise.resolve(this);
        }
        return (this.#renderPromise ??= this._render(true).then(() => this));
    }
    adopt(child) {
        const { x, y } = child.global.pos;
        const childRotation = child.global.rotation;
        child.xParent?.disown(child);
        this.registerXKid(child);
        if (this.isRendered && child.isRendered) {
            child.set({
                x,
                y,
                rotation: child.isFreezingRotate ? 0 : (childRotation - this.global.rotation)
            });
            child.elem$.appendTo(this.elem);
        }
        else if (this.isRendered) {
            child.xElem.onRender.funcs ??= [];
            child.xElem.onRender.funcs.unshift(() => {
                this.adopt(child);
            });
        }
        else {
            this.onRender.funcs.push(() => this.adopt(child));
        }
    }
    // adopt(xItem: XItem) {
    // 	xItem.xParent.disown(xItem);
    // 	xItem.xParent = this;
    // 	if (this.isRendered && xItem.isRendered) {
    // 		xItem.elem$.appendTo(this.elem);
    // 		xItem.set({
    // 			...xItem.global.pos,
    // 			rotation: xItem.global.rotation,
    // 			scale: xItem.global.scale
    // 		});
    // 	this.registerXKid(xItem);
    // }
    disown(xItem) {
        this.unregisterXKid(xItem);
        return;
    }
    kill() {
        if (this.hasKids) {
            this.getXKids(XItem).forEach((xItem) => xItem.kill());
        }
    }
}
export default class XItem extends Application {
    xOptions;
    xParent;
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: ["x-item"],
            template: U.getTemplatePath("xitem"),
            xParent: XItem.XROOT,
            onRender: {
                set: {
                    x(_, elem) { return -0.5 * U.get(elem, "width", "px"); },
                    y(_, elem) { return -0.5 * U.get(elem, "height", "px"); },
                    xPercent: -50,
                    yPercent: -50,
                    rotation: 0,
                    scale: 1,
                    transformOrigin: "50% 50%"
                }
            }
        });
    }
    static #XROOT;
    static get XROOT() {
        return (this.#XROOT ??= new XROOT());
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
    #isInitialized = false; //~ xItem is rendered, parented, and onRender queues emptied
    // readonly xOptions: XItemOptions;
    xElem;
    renderApp = this;
    onRender = {
        set: {
            x(_, elem) { return -0.5 * U.get(elem, "width", "px"); },
            y(_, elem) { return -0.5 * U.get(elem, "height", "px"); },
            xPercent: -50,
            yPercent: -50,
            rotation: 0,
            scale: 1,
            transformOrigin: "50% 50%"
        }
    };
    get xTweens() { return this.xElem.xTweens; }
    get elem() { return this.xElem.elem; }
    get elem$() { return this.xElem.elem$; }
    #xKids = new Set();
    get xKids() { return this.#xKids; }
    get hasKids() { return this.xKids.size > 0; }
    registerXKid(xKid) { this.xKids.add(xKid); }
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
    constructor(xOptions, xParent = XItem.XROOT) {
        xOptions.id = U.getUID(`${xParent.id}-${xOptions.id}`.replace(/^XROOT-?/, "X-"));
        super(xOptions);
        this.xOptions = xOptions;
        this.xParent = xParent;
        this.xOptions = Object.assign(xOptions, this.options);
        this.xElem = new XElem(this, {
            onRender: this.xOptions.onRender
        });
        this.constructor.Register(this);
        xParent.adopt(this, false);
    }
    async xInitialize() {
        if (this.isInitialized) {
            return Promise.resolve(this);
        }
        if (await this.xElem.xRender()) {
            return Promise.allSettled(this.getXKids(XItem).map((xItem) => xItem.xInitialize()))
                .then(() => { this.#isInitialized = true; return Promise.resolve(this); }, () => Promise.reject(this));
        }
        return Promise.reject(this);
    }
    get isRendered() { return this.rendered; }
    get isInitialized() { return this.#isInitialized; }
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
    get radius() { return this.xElem.radius; }
    isFreezingRotate = false;
    get getDistanceTo() { return this.xElem.getDistanceTo.bind(this.xElem); }
    get getGlobalAngleTo() { return this.xElem.getGlobalAngleTo.bind(this.xElem); }
    get xRender() { return this.xElem.xRender.bind(this.xElem); }
    get adopt() { return this.xElem.adopt.bind(this.xElem); }
    get disown() { return this.xElem.disown.bind(this.xElem); }
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
    async renderApplication() {
        try {
            return this._render(true, {})
                .then(() => Promise.resolve(this));
        }
        catch (err) {
            this._state = Application.RENDER_STATES.ERROR;
            Hooks.onError("Application#render", err, {
                msg: `Error rendering ${this.constructor.name} id '#${this.id}'`,
                log: "error"
            });
            return Promise.reject(err);
        }
    }
}