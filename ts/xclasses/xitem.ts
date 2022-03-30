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
import type {XElemOptions, Tweenable, Renderable, XParent, ConstructorOf} from"../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮
export interface XItemOptions extends Partial<ApplicationOptions>, XElemOptions {
	id: string;
	keepID?: boolean;
}

const LISTENERS: Array<[keyof DocumentEventMap, (event: MouseEvent) => void]> = [
	["mousemove", (event) => {
		XItem.LogMouseMove(event.pageX, event.pageY);
	}]
];


export class XROOT extends Application implements Omit<Renderable, "onRender"|"set">, XParent {
	static override get defaultOptions(): ApplicationOptions {
		return {
			...super.defaultOptions,
			popOut: false,
			template: U.getTemplatePath("xitem")
		};
	}
	static RESET() { XItem.XROOT?.kill() }

	renderApp: Application = this;

	get elem() { return this.element[0] }
	get elem$() { return $(this.elem) }

	override get id() { return "XROOT" }
	x = 0;
	y = 0;
	rotation = 0;
	scale = 1;
	pos: Point = {x: 0, y: 0};
	origin: Point = {x: 0, y: 0};

	#height?: number;
	#width?: number;
	#size?: number;
	get height() { return (this.#height ??= U.get(this.elem, "height", "px")) }
	get width() { return (this.#width ??= U.get(this.elem, "width", "px")) }
	get size() { return (this.#size ??= (this.height + this.width) / 2) }
	get radius() { return this.size }

	get global() { return this }

	#xKids: Set<XItem> = new Set();
	get xKids() { return this.#xKids }
	get hasChildren() { return this.xKids.size > 0 }
	getXKids<X extends XItem>(classRef: ConstructorOf<X>, isGettingAll = false): X[] {
		const xKids: X[] = Array.from(this.xKids.values())
			.flat()
			.filter(U.isInstanceFunc(classRef));
		if (isGettingAll) {
			xKids.push(...Array.from(this.xKids.values()).map((xKid) => xKid.getXKids(classRef, true)).flat());
		}
		return xKids;
	}

	registerXKid(xKid: XItem) { this.xKids.add(xKid) }
	unregisterXKid(xKid: XItem) { this.xKids.delete(xKid) }

	constructor() {
		super({id: "XROOT"});
		this.renderApplication();
	}

	get isRendered() { return this.rendered }
	#renderPromise?: Promise<boolean>;
	async xRender(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (this.isRendered) {
				resolve(true);
			} else {
				this._render(true)
					.then(() => resolve(true))
					.catch(() => reject(false));
			}
		});
	}
	get isInitialized() { return this.rendered }
	async xInitialize(): Promise<boolean> {
		return Promise.resolve(this.isRendered);
	}
	async renderApplication() {
		if (this.#renderPromise) { return this.#renderPromise }
		this.#renderPromise = this.xRender();
		await this.#renderPromise;
		U.set(this.elem, {
			xPercent: 50,
			yPercent: 50
		});
		this.elem$.attr("id", "XROOT");
		return this.#renderPromise;
	}

	adopt(xItem: XItem) {
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
	disown(xItem: XItem) {
		this.unregisterXKid(xItem);
		return;
	}
	kill() {
		if (this.hasChildren) {
			this.getXKids(XItem).forEach((xItem) => xItem.kill());
		}
	}
}
export default class XItem extends Application implements Tweenable {

	static override get defaultOptions(): XItemOptions & ApplicationOptions {
		return U.objMerge(super.defaultOptions, {
			popOut: false,
			classes: ["x-item"],
			template: U.getTemplatePath("xitem"),
			xParent: XItem.XROOT,
			onRender: {
				set: {
					x(i, elem) { return -0.5 * (gsap.getProperty(elem, "width") as number) },
					y(i, elem) { return -0.5 * (gsap.getProperty(elem, "height") as number) },
					rotation: 0,
					scale: 1,
					xPercent: -50,
					yPercent: -50,
					transformOrigin: "50% 50%"
				}
			}
		} as Partial<XItemOptions>);
	}

	static #XROOT: XROOT;
	static get XROOT() {
		return (this.#XROOT ??= new XROOT());
	}

	protected static REGISTRY: Map<string,XItem> = new Map();
	public static Register(xItem: XItem) {
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
	public static LogMouseMove(x: number, y: number) {
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

	// readonly xOptions: XItemOptions;
	readonly xElem: XElem<typeof this>;

	renderApp: XItem = this;
	onRender = {};
	get tweens() { return this.xElem.tweens }

	get elem() { return this.xElem.elem }
	get elem$() { return this.xElem.elem$ }

	#xKids: Set<XItem> = new Set();
	get xKids() { return this.#xKids }
	get hasChildren() { return this.xKids.size > 0 }
	registerXKid(xKid: XItem) { this.xKids.add(xKid) }
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

	constructor(
		public readonly xOptions: XItemOptions,
		public xParent: XItem | XROOT = XItem.XROOT
	) {
		xOptions.id = U.getUID(`${xParent.id}-${xOptions.id}`.replace(/^XROOT-?/, "X-"));
		super(xOptions);
		this.xOptions = Object.assign(xOptions, this.options);
		this.xElem = new XElem(this, {
			onRender: this.xOptions.onRender
		});
		(this.constructor as typeof XItem).Register(this);
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

	async xInitialize(): Promise<boolean> {
		if (this.isInitialized) { return Promise.resolve(true) }
		if (await this.xElem.xRender()) {
			return Promise.allSettled(this.getXKids(XItem).map((xItem) => xItem.xInitialize()))
				.then(
					() => { this.#isInitialized = true; return Promise.resolve(true) },
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
	get origin() { return this.xElem.origin }
	get global() { return this.xElem.global }
	get height() { return this.xElem.height }
	get width() { return this.xElem.width }
	get size() { return this.xElem.size }
	get radius() { return this.xElem.radius }

	isFreezingRotate = false;

	get getDistanceTo() { return this.xElem.getDistanceTo.bind(this.xElem) }
	get getGlobalAngleTo() { return this.xElem.getGlobalAngleTo.bind(this.xElem) }

	get xRender() { return this.xElem.xRender.bind(this.xElem) }
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
