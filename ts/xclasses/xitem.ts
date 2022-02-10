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

export default class XItem extends Application implements DOMElement {
	private static _XROOT?: XItem;
	private static _TICKERS: Array<anyFunc> = [];

	static override get defaultOptions(): ApplicationOptions {
		return U.objMerge(super.defaultOptions, {
			popOut: false,
			classes: U.unique([...super.defaultOptions.classes, "x-item"]),
			template: XElem.getTemplatePath("xitem")
		});
	}

	static AddTicker(func: anyFunc) {
		this._TICKERS.push(func);
		gsap.ticker.add(func);
	}
	static XKill() {
		if (XItem._XROOT) {
			$(XItem._XROOT.elem).remove();
			XItem._TICKERS.forEach((func) => gsap.ticker.remove(func));
			delete XItem._XROOT;
		}
	}

	static get XROOT(): XItem {
		if (!this._XROOT) {
			this._XROOT = new XItem({
				id: "x-root"
			}, null);
		}
		return this._XROOT;
	}

	private _parent: XItem | null;
	private _xElem: XElem;
	private _renderPromise: anyPromise | null = null;

	constructor(options: Partial<ApplicationOptions> = {}, parent: XItem | null = XItem.XROOT) {
		super(U.objMerge(options, {classes: ["x-item", ...options.classes ?? []]}));
		this._parent = parent;
		this._xElem = new XElem(this);
		this.parent?.adopt(this, false);
	}

	get elem() { return this.element[0] }
	get parent() { return this._parent }
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

	override getData() {
		const context = super.getData();
		Object.assign(context, {
			id: this.id,
			classes: this.options.classes.join(" ")
		});
		return context;
	}

	asyncRender(force = true, options = {}) {
		return (this._renderPromise = this._renderPromise ?? super._render(force, options).catch((err) => {
			this._state = Application.RENDER_STATES.ERROR;
			Hooks.onError("Application#render", err, {
				msg: `An error occurred while rendering ${this.constructor.name} ${this.appId}`,
				log: "error",
				...options
			});
		}));
	}
	whenRendered(func: anyFunc) { return this.rendered ? func() : this.asyncRender().then(func) }

	to(vars: gsap.TweenVars) {
		return this.whenRendered(() => gsap.to(this.elem, vars));
	}
	from(vars: gsap.TweenVars) {
		return this.whenRendered(() => gsap.from(this.elem, vars));
	}
	fromTo(fromVars: gsap.TweenVars, toVars: gsap.TweenVars) {
		return this.whenRendered(() => gsap.fromTo(this.elem, fromVars, toVars));
	}
	set(vars: gsap.TweenVars) { return this.whenRendered(() => gsap.set(this.elem, vars)) }

}