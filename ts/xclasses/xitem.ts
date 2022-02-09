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
	private static _XCONTAINER: XItem;

	static override get defaultOptions(): ApplicationOptions {
		return mergeObject(super.defaultOptions, {
			popOut: false,
			classes: ["x-item"],
			template: U.getTemplatePath("xcontainer.hbs")
		});
	}

	static get XCONTAINER(): XItem {
		if (!this._XCONTAINER) {
			this._XCONTAINER = new XItem({
				id: "x-container"
			}, null);
		}
		return this._XCONTAINER;
	}

	private _parent: XItem | null;
	private _xElem: XElem;

	constructor(options: XOptions = {}, parent: XItem | null = XItem.XCONTAINER) {
		super(options);
		this._parent = parent;
		this._xElem = new XElem(this);
		this.render(true);
		this._parent?.adopt(this);
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
	get adopt() { return this._xElem.adopt }

	override getData() {
		const context = super.getData();

		Object.assign(context, {
			id: this.id,
			classes: this.options.classes.join(" ")
		});

		return context;
	}
	to(vars: gsap.TweenVars): Promise<gsap.core.Tween> | gsap.core.Tween {
		return U.waitForRender(this, () => gsap.to(this.elem, vars));
	}
	from(vars: gsap.TweenVars): Promise<gsap.core.Tween> | gsap.core.Tween {
		return U.waitForRender(this, () => gsap.from(this.elem, vars));
	}
	fromTo(fromVars: gsap.TweenVars, toVars: gsap.TweenVars): Promise<gsap.core.Tween> | gsap.core.Tween {
		return U.waitForRender(this, () => gsap.fromTo(this.elem, fromVars, toVars));
	}
	set(vars: gsap.TweenVars): Promise<gsap.core.Tween> | gsap.core.Tween {
		return U.waitForRender(this, () => gsap.set(this.elem, vars), 200);
	}

}