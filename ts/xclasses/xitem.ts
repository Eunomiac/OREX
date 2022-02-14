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
	parent?: XItem | null;
}
export default class XItem extends Application {
	private static _XROOT: XItem;
	private static _TICKERS: Array<() => void> = [];

	public static override get defaultOptions(): ApplicationOptions {
		return U.objMerge({...super.defaultOptions}, {
			popOut: false,
			template: U.getTemplatePath("xitem")
		});
	}

	public static get XROOT(): XItem { return XItem._XROOT }
	public static InitializeXROOT(): void {
		$(XItem._XROOT?.elem).remove();
		XItem._TICKERS.forEach((func) => gsap.ticker.remove(func));
		XItem._XROOT = new XItem({id: "x-root", parent: null});
	}
	public static AddTicker(func: () => void): void {
		this._TICKERS.push(func);
		gsap.ticker.add(func);
	}

	private _parent: XItem | null;
	public readonly xOptions: XItemOptions;
	public readonly xElem: XElem;
	public get parent(): XItem | null { return this._parent }
	public set parent(parentXItem: XItem | null) {
		this._parent = parentXItem;
		if (this.isRendered && parentXItem?.isRendered) {
			parentXItem.adopt(this);
		}
	}
	public get elem() { return this.xElem.elem }
	public get elem$() { return this.xElem.elem$ }

	constructor(xOptions: XItemOptions) {
		super(xOptions);
		this.xOptions = xOptions;
		this.options.classes.unshift("x-item");
		if (xOptions.parent === null) {
			this._parent = null;
		} else if (xOptions.parent instanceof XItem) {
			this._parent = xOptions.parent;
		} else {
			this._parent = XItem.XROOT;
		}
		this.xElem = new XElem({
			id: this.id,
			renderApp: this,
			noImmediateRender: xOptions.noImmediateRender,
			onRender: xOptions.onRender
		});
	}

	get isRendered() { return this.rendered }
	get _x() { return this.xElem._x }
	get _y() { return this.xElem._y }
	get _pos() { return this.xElem._pos }
	get _rotation() { return this.xElem._rotation }
	get _scale() { return this.xElem._scale }
	get x() { return this.xElem.x }
	get y() { return this.xElem.y }
	get pos() { return this.xElem.pos }
	get rotation() { return this.xElem.rotation }
	get scale() { return this.xElem.scale }
	get height() { return this.xElem.height }
	get width() { return this.xElem.width }
	get size() { return this.xElem.size }
	get radius() { return this.xElem.radius }

	get asyncRender() { return this.xElem.asyncRender.bind(this.xElem) }
	get adopt() { return this.xElem.adopt.bind(this.xElem) }
	get set() { return this.xElem.set.bind(this.xElem) }
	get to() { return this.xElem.to.bind(this.xElem) }
	get from() { return this.xElem.from.bind(this.xElem) }
	get fromTo() { return this.xElem.fromTo.bind(this.xElem) }

	override getData() {
		const context = super.getData();
		Object.assign(context, {
			id: this.id,
			classes: this.options.classes.join(" ")
		});
		return context;
	}

	public async renderApplication(): Promise<void> {
		try {
			return this._render(true, {});
		} catch (err) {
			this._state = Application.RENDER_STATES.ERROR;
			Hooks.onError("Application#render", <Error>err, {
				msg: `An error occurred while rendering ${this.constructor.name} ${this.appId}`,
				log: "error"
			});
			return Promise.reject(err);
		}
	}
}