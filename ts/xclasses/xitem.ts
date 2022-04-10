// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ====== GreenSock Animation ====== ~
	gsap,
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U, DB,
	XElem, XROOT, XGroup, XPool, XRoll,
	XDie, XTerm, XMod
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
} from "../helpers/bundler.js";
import type {XGroupOptions, Renderable, Tweenable, ConstructorOf} from"../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮
export interface XItemOptions extends Partial<ApplicationOptions> {
	id: string;
	keepID?: boolean;
	isFreezingRotate?: boolean;
}

const LISTENERS: Array<[keyof DocumentEventMap, (event: MouseEvent) => void]> = [
	["mousemove", (event) => {
		XItem.LogMouseMove(event.pageX, event.pageY);
	}]
];

export interface lockedXItem<T extends XItem> extends XItem {
	xParent: XGroup
}
export default class XItem extends Application implements Renderable, Tweenable {
	// #region ▮▮▮▮▮▮▮[Subclass Static Overrides] Methods Subclasses will Have to Override ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & XItemOptions {
		return U.objMerge(super.defaultOptions, {
			popOut: false,
			classes: ["x-item"],
			template: U.getTemplatePath("xitem"),
			isFreezingRotate: false
		} as Partial<XItemOptions>);
	}

	static REGISTRY: Map<string, XItem> = new Map();
	// #endregion ▮▮▮▮[Subclass Static Overrides]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Static Registration] Registration & Retrieval of XItem Instances ▮▮▮▮▮▮▮ ~
	protected static get Structor() { return this.constructor as typeof XItem }

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
	// #endregion ▮▮▮▮[Static Registration]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Mouse Tracking] Centralized Listener for Track Mouse Cursor ▮▮▮▮▮▮▮ ~
	static #lastMouseUpdate: number = Date.now();
	static #mousePos: { x: number, y: number } = {x: 0, y: 0};
	static LogMouseMove(x: number, y: number) {
		if (Date.now() - this.#lastMouseUpdate > 1000) {
			this.#lastMouseUpdate = Date.now();
			this.#mousePos = {x, y};
		}
		this.GetAll()
			.filter((xItem) => xItem instanceof XGroup && xItem.xParent === XROOT.XROOT)
			.forEach((xGroup) => {
				// https://greensock.com/forums/topic/17899-what-is-the-cleanest-way-to-tween-a-var-depending-on-the-cursor-position/
				// https://greensock.com/forums/topic/18717-update-tween-based-on-mouse-position/
			});
	}
	// #endregion ▮▮▮▮[Mouse Tracking]▮▮▮▮

	// #region ████████ CONSTRUCTOR & Essential Fields ████████ ~
	readonly xElem: XElem<typeof this>;
	xParent: XGroup | null; //~ null only in the single case of the top XItem, XROOT.XROOT
	#xKids: Set<typeof this> = new Set();

	readonly xOptions: XItemOptions;
	defaultOnRenderOptions: Partial<gsap.CSSProperties> = {
		xPercent: -50,
		yPercent: -50,
		x: 0,
		y: 0,
		opacity: 1,
		rotation: 0,
		scale: 1,
		transformOrigin: "50% 50%"
	};
	onRenderOptions: Partial<gsap.CSSProperties> = {};
	get renderOptions() {
		return {
			...this.defaultOnRenderOptions,
			...this.onRenderOptions
		};
	}

	constructor(
		xParent: XGroup | null,
		{
			classes = [],
			...xOptions
		}: XItemOptions,
		onRenderOptions: Partial<gsap.CSSProperties>
	) {
		if (xParent) {
			xOptions.id = U.getUID(`${xParent.id}-${xOptions.id}`.replace(/^XROOT-?/, "X-"));
		}
		DB.display(`[#${xOptions.id}] Constructing START`);
		super(xOptions);
		this.options.classes.push(...classes);
		this.onRenderOptions = onRenderOptions;
		this.xOptions = {
			...xOptions,
			...this.options
		};
		if (xParent === null && xOptions.id === "XROOT") {
			this.xParent = null;
		} else {
			this.xParent = xParent ?? XROOT.XROOT;
		}
		this.xElem = new XElem(this);
		DB.log(`[#${xOptions.id}] END Constructing`);
	}
	// #endregion ▄▄▄▄▄ CONSTRUCTOR ▄▄▄▄▄


	renderApp: XItem = this;
	get tweens() { return this.xElem.tweens }

	get elem() { return this.xElem.elem }
	get elem$() { return this.xElem.elem$ }

	#initializePromise?: Promise<typeof this>;
	get initializePromise() { return this.#initializePromise }
	async initialize(renderOptions: Partial<gsap.CSSProperties> = {}): Promise<typeof this> {
		if (this.initializePromise) {
			DB.info(`[#${this.id}] Ignoring Initialize(): Already Promised!`, new Error().stack);
			return this.initializePromise;
		} else {
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

	get isRendered() { return this.rendered }
	isInitialized(): this is lockedXItem<typeof this> { return Boolean(this.#initializePromise) }
	get x() { return this.xElem.x }
	get y() { return this.xElem.y }
	get pos() { return this.xElem.pos }
	get rotation() { return this.xElem.rotation }
	get scale() { return this.xElem.scale }
	get origin() { return this.xElem.origin }
	get global() { return this.xElem.global }
	get height() { return this.xElem.height }
	get width() { return this.xElem.width }
	get size() { return this.xElem.size }

	isFreezingRotate = false;

	get getDistanceTo() { return this.xElem.getDistanceTo.bind(this.xElem) }
	get getGlobalAngleTo() { return this.xElem.getGlobalAngleTo.bind(this.xElem) }

	override async render(): Promise<typeof this> {
		try {
			await this._render(true, {});
			return Promise.resolve(this);
		} catch (err) {
			this._state = Application.RENDER_STATES.ERROR;
			Hooks.onError("Application#render", <Error>err, {
				msg: `An error occurred while rendering ${this.constructor.name} ${this.appId}`,
				log: "error"
			});
			return Promise.reject(`An error occurred while rendering ${this.constructor.name} ${this.appId}`);
		}
	}

	get adopt() { return this.xElem.adopt.bind(this.xElem) }
	get disown() { return this.xElem.disown.bind(this.xElem) }

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
	get tweenTimeScale() { return this.xElem.tweenTimeScale.bind(this.xElem) }

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

	override getData() {
		const context = super.getData();
		Object.assign(context, {
			id: this.id,
			classes: this.options.classes.join(" ")
		});
		return context;
	}
}
