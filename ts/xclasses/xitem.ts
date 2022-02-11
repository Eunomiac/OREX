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
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export default class XItem extends Application implements Partial<DOMElement> {
	private static _XROOT?: XItem;
	private static _TICKERS: Array<anyFunc> = [];

	static override get defaultOptions(): ApplicationOptions {
		return U.objMerge(super.defaultOptions, {
			popOut: false,
			template: U.getTemplatePath("xitem")
		});
	}

	public static AddTicker(func: anyFunc): void {
		this._TICKERS.push(func);
		gsap.ticker.add(func);
	}
	public static XKill(): void {
		if (XItem._XROOT) {
			$(XItem._XROOT.elem).remove();
			XItem._TICKERS.forEach((func) => gsap.ticker.remove(func));
			delete XItem._XROOT;
		}
	}
	public static get XROOT(): XItem {
		if (!this._XROOT) {
			this._XROOT = new XItem({
				id: "x-root",
				parent: "SANDBOX"
			});
		}
		return this._XROOT;
	}

	public _xElem: XElem;

	constructor(options: XOptions) {
		super(options);
		this.options.classes.unshift("x-item");
		this._xElem = new XElem(this);
	}

	get isRendered() { return this.rendered }
	get elem() { return this._xElem.elem }
	get parent() { return this._xElem.parent }
	get _x() { return this._xElem._x }
	get _y() { return this._xElem._y }
	get _pos() { return this._xElem._pos }
	get _rotation() { return this._xElem._rotation }
	get _scale() { return this._xElem._scale }
	get x() { return this._xElem.x }
	get y() { return this._xElem.y }
	get pos() { return this._xElem.pos }
	get rotation() { return this._xElem.rotation }
	get scale() { return this._xElem.scale }

	get adopt() { return this._xElem.adopt.bind(this._xElem) }
	get set() { return this._xElem.set.bind(this._xElem) }
	get to() { return this._xElem.to.bind(this._xElem) }
	get from() { return this._xElem.from.bind(this._xElem) }
	get fromTo() { return this._xElem.fromTo.bind(this._xElem) }

	override getData() {
		const context = super.getData();
		Object.assign(context, {
			id: this.id,
			classes: this.options.classes.join(" ")
		});
		return context;
	}

	public async renderApp(): Promise<void> {
		try {
			return await this._render(true, {});
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