// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
	gsap,
	Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools,
	RoughEase,
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U, DB,
	XElem, XGroup
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
} from "../helpers/bundler.js";
import type {XElemOptions, DOMRenderer, GSAPController} from"../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
export interface XItemOptions extends Partial<ApplicationOptions>, Partial<XElemOptions> {
	id: string;
	keepID?: boolean;
}

export default class XItem extends Application implements Partial<DOMRenderer>, Partial<GSAPController> {

	public static override get defaultOptions(): ApplicationOptions {
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

	private static _XROOT: XItem;
	public static get XROOT() { return XItem._XROOT }
	public static async InitializeXROOT(): Promise<boolean> {
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
			}});
		return XItem._XROOT.initialize();
	}

	protected _isInitialized = false; //~ xItem is rendered, parented, and onRender queues emptied
	protected _xParent: XItem | null; //~ null only in the single case of the top XItem, XItem.XROOT
	protected _xKids: Set<XItem> = new Set();
	public readonly xOptions: XItemOptions;
	public readonly xElem: XElem;

	public get elem() { return this.xElem.elem }
	public get elem$() { return this.xElem.elem$ }
	public get xParent(): XItem | null { return this._xParent }
	public set xParent(xParent: XItem | null) { this._xParent = xParent ?? XItem.XROOT }
	public get xKids(): Set<XItem> { return this._xKids }
	public get hasChildren() { return this.xKids.size > 0 }
	public registerXKid(xKid: XItem) { xKid.xParent = this; this.xKids.add(xKid) }
	public unregisterXKid(xKid: XItem) { this.xKids.delete(xKid) }
	public getXKids<X extends XItem>(classRef: ConstructorOf<X>, isGettingAll = false): Array<X> {
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
	constructor(xParent: XItem | null, {classes = [], ...xOptions}: XItemOptions) {
		if (!xOptions.keepID) {
			xOptions.id += U.getUID();
		}
		super(xOptions);
		this.options.classes.push(...classes);
		this.xOptions = Object.assign(xOptions, this.options);
		if (xParent === null) {
			this._xParent = null;
		} else {
			this._xParent = xParent ?? XItem.XROOT;
		}
		this.xElem = new XElem({
			renderApp: this,
			onRender: this.xOptions.onRender
		});
	}

	async initialize(): Promise<boolean> {
		if (this.isInitialized) { return Promise.resolve(true) }
		if (await this.xElem.confirmRender(true)) {
			return Promise.allSettled(this.getXKids(XItem).map((xItem) => xItem.initialize()))
				.then(
					() => { this._isInitialized = true; return Promise.resolve(true) },
					() => Promise.resolve(false)
				);
		}
		return Promise.resolve(false);
	}

	get isRendered() { return this.rendered }
	get isInitialized() { return this._isInitialized }
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

	get confirmRender() { return this.xElem.confirmRender.bind(this.xElem) }
	get adopt() { return this.xElem.adopt.bind(this.xElem) }

	private _TICKERS: Set<() => void> = new Set();
	public addTicker(func: () => void): void {
		this._TICKERS.add(func);
		gsap.ticker.add(func);
	}
	public removeTicker(func: () => void): void {
		this._TICKERS.delete(func);
		gsap.ticker.remove(func);
	}

	get set() { return this.xElem.set.bind(this.xElem) }
	get to() { return this.xElem.to.bind(this.xElem) }
	get from() { return this.xElem.from.bind(this.xElem) }
	get fromTo() { return this.xElem.fromTo.bind(this.xElem) }

	public kill() {
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

	override getData() {
		const context = super.getData();
		Object.assign(context, {
			id: this.id,
			classes: this.options.classes.join(" ")
		});
		return context;
	}

	public async renderApplication(): Promise<boolean> {
		if (!this.xElem.isRenderReady) {
			DB.error("Attempt to render an unready Application");
			return Promise.resolve(false);
		}
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
