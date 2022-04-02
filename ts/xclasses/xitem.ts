// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ====== GreenSock Animation ====== ~
	gsap,
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U, DB,
	XElem, XGroup
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
} from "../helpers/bundler.js";
import type {XElemOptions, DOMRenderer, GSAPController, ConstructorOf} from"../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮
export interface XItemOptions extends ApplicationOptions, XElemOptions {
	id: string;
	keepID?: boolean;
}

const LISTENERS: Array<[keyof DocumentEventMap, (event: MouseEvent) => void]> = [
	["mousemove", (event) => {
		XItem.LogMouseMove(event.pageX, event.pageY);
	}]
];

export default class XItem extends Application implements DOMRenderer, GSAPController {

	static override get defaultOptions(): ApplicationOptions & XItemOptions {
		return U.objMerge(super.defaultOptions, {
			popOut: false,
			classes: ["x-item"],
			template: U.getTemplatePath("xitem"),
			xParent: XItem.XROOT,
			onRender: {
				set: {
					xPercent: -50,
					yPercent: -50,
					x: 0,
					y: 0,
					rotation: 0,
					scale: 1,
					transformOrigin: "50% 50%"
				}
			}
		} as Partial<XItemOptions>);
	}

	static #XROOT: XItem;
	static get XROOT() { return XItem.#XROOT }
	static async InitializeXROOT(): Promise<boolean> {
		if (XItem.XROOT) {
			XItem.XROOT.kill();
		}
		XItem.#XROOT = new XItem(null, {id: "XROOT", onRender: {set: {xPercent: 0, yPercent: 0}}});
		return XItem.#XROOT.initialize();
	}

	static REGISTRY: Map<string,XItem> = new Map();
	static Register(xItem: XItem) {
		this.REGISTRY.set(xItem.id, xItem);
	}
	static Unregister(xItem: string | XItem | XElem<XItem> | HTMLElement) {
		this.REGISTRY.delete(typeof xItem === "string" ? xItem : xItem.id);
	}
	static GetAll() {
		return Array.from(this.REGISTRY.values());
	}
	static GetFromElement(elem: HTMLElement): XItem | false {
		if (this.REGISTRY.has(elem.id)) {
			return this.REGISTRY.get(elem.id) as XItem;
		}
		return false;
	}
	static #lastMouseUpdate: number = Date.now();
	static #mousePos: {x: number, y: number} = {x: 0, y: 0};
	static LogMouseMove(x: number, y: number) {
		if (Date.now() - this.#lastMouseUpdate > 1000) {
			this.#lastMouseUpdate = Date.now();
			this.#mousePos = {x, y};
		}
		this.GetAll()
			.filter((xItem) => xItem instanceof XGroup && xItem.xParent === XItem.XROOT)
			.forEach((xGroup) => {
				// https://greensock.com/forums/topic/17899-what-is-the-cleanest-way-to-tween-a-var-depending-on-the-cursor-position/
				// https://greensock.com/forums/topic/18717-update-tween-based-on-mouse-position/
			});
	}

	#isInitialized = false; //~ xItem is rendered, parented, and onRender queues emptied
	#xParent: XItem | null; //~ null only in the single case of the top XItem, XItem.XROOT
	#xKids: Set<XItem> = new Set();
	readonly isFreezingRotate: boolean = false; // ~set to 'true' to always maintain 0 rotation (e.g. for xTerms)
	readonly xOptions: XItemOptions;
	readonly xElem: XElem<typeof this>;

	get elem() { return this.xElem.elem }
	get elem$() { return this.xElem.elem$ }
	get tweens() { return this.xElem.tweens }
	get xParent(): XItem | null { return this.#xParent }
	set xParent(xParent: XItem | null) { this.#xParent = xParent ?? XItem.XROOT }
	get xKids(): Set<XItem> { return this.#xKids }
	get hasChildren() { return this.xKids.size > 0 }
	registerXKid(xKid: XItem) { xKid.xParent = this; this.xKids.add(xKid) }
	unregisterXKid(xKid: XItem) { this.xKids.delete(xKid) }
	getXKids<X extends XItem>(classRef: ConstructorOf<X>, isGettingAll = false): X[] {
		const xKids: X[] = Array.from(this.xKids.values())
			.flat()
			.filter(U.isInstanceFunc(classRef));
		if (isGettingAll) {
			xKids.push(...Array.from(this.xKids.values()).map((xKid) => xKid.getXKids(classRef, true)).flat());
		}
		return xKids;
	}
	constructor(xParent: XItem | null, {classes = [], ...xOptions}: Partial<XItemOptions>) {
		if (xParent) {
			xOptions.id = U.getUID(`${xParent.id}-${xOptions.id}`.replace(/^X?ROOT-?/, "X-"));
		}
		DB.display(`[#${xOptions.id}] Constructing START`);
		super(xOptions);
		// this.constructor().Register(this);
		this.options.classes.push(...classes);
		this.xOptions = Object.assign(xOptions, this.options);
		if (xParent === null) {
			this.#xParent = null;
		} else {
			this.#xParent = xParent ?? XItem.XROOT;
		}
		this.xElem = new XElem(this, {
			onRender: this.xOptions.onRender
		});
		(this.constructor as typeof XItem).Register(this);
		DB.log(`[#${xOptions.id}] END Constructing`);
	}

	async initialize(): Promise<boolean> {
		if (this.isInitialized) {
			DB.info(`[#${this.id}] Ignoring Initialize(): Already Initialized!`, new Error().stack);
		} else {
			DB.display(`[#${this.id}] Initializing START`);
		}
		if (this.isInitialized) { return Promise.resolve(true) }
		if (await this.xElem.confirmRender(true)) {
			DB.display(`[#${this.id}] END Initializing: Initializing XKIDS ...`);
			this.#isInitialized = true;
			return Promise.allSettled(this.getXKids(XItem).map((xItem) => xItem.initialize()))
				.then(
					() => Promise.resolve(true),
					() => Promise.resolve(false)
				);
		}
		return Promise.resolve(false);
	}

	get isRendered() { return this.rendered }
	get isInitialized() { return this.#isInitialized }
	get x() { return this.xElem.x }
	get y() { return this.xElem.y }
	get pos() { return this.xElem.pos }
	get rotation() { return this.xElem.rotation }
	get scale() { return this.xElem.scale }
	get global() { return this.xElem.global }
	get height() { return this.xElem.height }
	get width() { return this.xElem.width }
	get size() { return this.xElem.size }
	get radius() { return this.xElem.radius }

	get getDistanceTo() { return this.xElem.getDistanceTo.bind(this.xElem) }
	get getGlobalAngleTo() { return this.xElem.getGlobalAngleTo.bind(this.xElem) }

	get renderApp() { return this }
	get confirmRender() { return this.xElem.confirmRender.bind(this.xElem) }
	get adopt() { return this.xElem.adopt.bind(this.xElem) }

	private _tickers: Set<() => void> = new Set();
	addTicker(func: () => void): void {
		this._tickers.add(func);
		gsap.ticker.add(func);
	}
	removeTicker(func: () => void): void {
		this._tickers.delete(func);
		gsap.ticker.remove(func);
	}

	get set() { return this.xElem.set.bind(this.xElem) }
	get to() { return this.xElem.to.bind(this.xElem) }
	get from() { return this.xElem.from.bind(this.xElem) }
	get fromTo() { return this.xElem.fromTo.bind(this.xElem) }

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

	override getData() {
		const context = super.getData();
		Object.assign(context, {
			id: this.id,
			classes: this.options.classes.join(" ")
		});
		return context;
	}

	async renderApplication(): Promise<boolean> {
		try {
			await this._render(true, {});
			return Promise.resolve(true);
		} catch (err) {
			this._state = Application.RENDER_STATES.ERROR;
			Hooks.onError("Application#render", <Error>err, {
				msg: `An error occurred while rendering ${this.constructor.name} ${this.appId}`,
				log: "error"
			});
			return Promise.resolve(false);
		}
	}
}
