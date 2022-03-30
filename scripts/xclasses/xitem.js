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
    static RESET() { XItem.XROOT?.kill(); }
    renderApp = this;
    get elem() { return this.element[0]; }
    get elem$() { return $(this.elem); }
    get id() { return "XROOT"; }
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
    get hasChildren() { return this.xKids.size > 0; }
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
        this.renderApplication();
    }
    get isRendered() { return this.rendered; }
    #renderPromise;
    async xRender() {
        return new Promise((resolve, reject) => {
            if (this.isRendered) {
                resolve(true);
            }
            else {
                this._render(true)
                    .then(() => resolve(true))
                    .catch(() => reject(false));
            }
        });
    }
    get isInitialized() { return this.rendered; }
    async xInitialize() {
        return Promise.resolve(this.isRendered);
    }
    async renderApplication() {
        if (this.#renderPromise) {
            return this.#renderPromise;
        }
        this.#renderPromise = this.xRender();
        await this.#renderPromise;
        U.set(this.elem, {
            xPercent: 50,
            yPercent: 50
        });
        this.elem$.attr("id", "XROOT");
        return this.#renderPromise;
    }
    adopt(xItem) {
        xItem.xParent.disown(xItem);
        xItem.xParent = this;
        xItem.elem$.appendTo(this.elem$);
        xItem.set({
            ...xItem.global.pos,
            rotation: xItem.global.rotation,
            scale: xItem.global.scale
        });
        this.registerXKid(xItem);
    }
    disown(xItem) {
        this.unregisterXKid(xItem);
        return;
    }
    kill() {
        if (this.hasChildren) {
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
                    x(i, elem) { return -0.5 * gsap.getProperty(elem, "width"); },
                    y(i, elem) { return -0.5 * gsap.getProperty(elem, "height"); },
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
    onRender = {};
    get tweens() { return this.xElem.tweens; }
    get elem() { return this.xElem.elem; }
    get elem$() { return this.xElem.elem$; }
    #xKids = new Set();
    get xKids() { return this.#xKids; }
    get hasChildren() { return this.xKids.size > 0; }
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
    }
    // constructor(xParent: XItem | null, {classes = [], ...xOptions}: XItemOptions) {
    // 	super(xOptions);
    // 	// this.constructor().Register(this);
    // 	this.options.classes.push(...classes);
    // 	this.xOptions = Object.assign(xOptions, this.options);
    // 	if (xParent === null) {
    // 		this.#xParent = null;
    // 	} else {
    // 		this.#xParent = xParent ?? XItem.XROOT;
    // 	}
    // 	this.xElem = new XElem(this, {
    // 		onRender: this.xOptions.onRender
    // 	});
    // 	(this.constructor as typeof XItem).Register(this);
    // }
    async xInitialize() {
        if (this.isInitialized) {
            return Promise.resolve(true);
        }
        if (await this.xElem.xRender()) {
            return Promise.allSettled(this.getXKids(XItem).map((xItem) => xItem.xInitialize()))
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