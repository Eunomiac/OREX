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
	U,
	XElem
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
} from "../helpers/bundler.js";
import type {XElemOptions} from "../xclasses/xelem.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export interface XItemOptions extends Partial<ApplicationOptions>, Partial<XElemOptions> {
	id: string;
	parent?: XItem | null;
}
export default class XItem extends Application {

	public static override get defaultOptions(): ApplicationOptions {
		return U.objMerge(super.defaultOptions, {
			popOut: false,
			classes: [...super.defaultOptions.classes, "x-item"],
			template: U.getTemplatePath("xitem")
		});
	}

	private static _XROOT: XItem;
	public static get XROOT() { return XItem._XROOT }
	public static async InitializeXROOT(): Promise<boolean> {
		if (XItem.XROOT) {
			XItem.XROOT.kill();
		}
		XItem._XROOT = new XItem({id: "x-root", parent: null});
		return XItem._XROOT.initialize();
	}

	protected _isInitialized = false; //~ xItem is rendered, parented, and onRender queues emptied
	protected _parent: XItem | null; //~ null only in the single case of the top XItem, XItem.XROOT
	protected _xChildren: Set<XItem> = new Set();
	public readonly xOptions: XItemOptions;
	public readonly xElem: XElem;

	public get elem() { return this.xElem.elem }
	public get elem$() { return this.xElem.elem$ }
	public get parent(): XItem | null { return this._parent }
	public set parent(parent: XItem | null) {
		this._parent = parent ?? XItem.XROOT;
		if (this.isRendered && this._parent.isRendered) {
			this._parent.adopt(this);
		}
	}
	public get xChildren(): Set<XItem> { return this._xChildren }
	public get hasChildren() { return this.xChildren.size > 0 }
	public registerChild(child: XItem) { this.xChildren.add(child) }
	public unregisterChild(child: XItem) { this.xChildren.delete(child) }
	public getXChildren<X extends typeof XItem>(classRef?: X, isGettingAll = false): Array<XItem> {
		const classCheck: typeof XItem = U.isUndefined(classRef) ? XItem : classRef;
		if (isGettingAll) {
			return Array.from(this.xChildren.values())
				.map((xItem) => xItem.getXChildren(undefined, true))
				.flat()
				.filter((xItem) => xItem instanceof classCheck);
		}
		return Array.from(this.xChildren.values()).filter((xItem) => xItem instanceof classCheck);
	}

	constructor(xOptions: XItemOptions) {
		super(xOptions);
		this.xOptions = xOptions;
		if (xOptions.parent === null) {
			this._parent = null;
		} else if (xOptions.parent instanceof XItem) {
			this._parent = xOptions.parent;
		} else {
			this._parent = XItem.XROOT;
		}
		this.xElem = new XElem({
			renderApp: this,
			onRender: xOptions.onRender
		});
	}

	async initialize(): Promise<boolean> {
		if (this.isInitialized) { return Promise.resolve(true) }
		if (await this.xElem.confirmRender(true)) {
			return Promise.allSettled(this.getXChildren().map((xItem) => xItem.initialize()))
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
			console.warn("Attempt to render an unready Application");
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
