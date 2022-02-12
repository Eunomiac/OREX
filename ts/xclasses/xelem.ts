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
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	XItem
} from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export default class XElem implements DOMElement {
	private _xItem: XItem;
	private _parent: XItem | null;
	private _isParented = false;
	private _renderPromise?: anyPromise;
	private _style?: Partial<gsap.CSSProperties>;

	constructor(xItem: XItem) {
		const options = <XOptions>xItem.options;
		this._xItem = xItem;
		this._parent = options.parent;
		this._style = options.style;
		if (options.isRendering !== false) {
			if (this._parent !== null) {
				this._parent = this._parent ?? XItem.XROOT;
			}
			this.asyncRender();
		}
	}

	get xItem() { return this._xItem }
	get elem() { return this.xItem.element[0] }
	get parent(): XItem | null { return this._parent }
	get isRendered() { return this.xItem.isRendered }
	get isParented() { return this._isParented }

	// LOCAL SPACE: Position & Dimensions
	get _x() { return U.get(this.elem, "x", "px") }
	get _y() { return U.get(this.elem, "y", "px") }
	get _pos(): point { return {x: this._x, y: this._y} }
	get _rotation() { return <number>U.get(this.elem, "rotation") }
	get _scale() { return <number>U.get(this.elem, "scale") }

	// XROOT SPACE (Global): Position & Dimensions
	get pos(): point {
		if (this.parent instanceof XItem) {
			return MotionPathPlugin.convertCoordinates(
				this.parent.elem,
				XItem.XROOT.elem,
				this._pos
			);
		}
		return this._pos;
	}
	get x() { return this.pos.x }
	get y() { return this.pos.y }
	get rotation() {
		let totalRotation = 0,
						{parent} = this.xItem;
		while (parent instanceof XItem) {
			const thisRotation = U.get(parent.elem, "rotation");
			if (typeof thisRotation === "number") {
				totalRotation += thisRotation;
			}
			parent = ({parent} = parent);
		}
		return totalRotation;
	}
	get scale() {
		let totalScale = 1,
						{parent} = this.xItem;
		while (parent instanceof XItem) {
			const thisScale = U.get(parent.elem, "scale");
			if (typeof thisScale === "number") {
				totalScale *= thisScale;
			}
			({parent} = parent);
		}
		return totalScale;
	}
	get height(): number { return U.get(this.elem, "height", "px") }
	get width(): number { return U.get(this.elem, "width", "px") }
	get size(): number { return (this.height + this.width) / 2 }
	get radius(): number | false { return (this.height === this.width ? this.height : false) }
	getLocalPosData(ofItem: XItem, globalPoint?: point): pointFull {
		return {
			...MotionPathPlugin.convertCoordinates(
				XItem.XROOT.elem,
				this.elem,
				globalPoint ?? ofItem.pos ?? {x: 0, y: 0}
			),
			rotation: ofItem?.rotation ?? 0 - this.rotation,
			scale: ofItem?.scale ?? 1 / this.scale
		};
	}

	async asyncRender() {
		if (this._renderPromise) {
			return this._renderPromise;
		}
		this._renderPromise = this.xItem.renderApp();
		if (this.parent instanceof XItem) {
			this.parent.adopt(this.xItem, false);
		}
		if (this._style) {
			this.set(this._style);
		}
		return this._renderPromise;
	}
	whenRendered(func: anyFunc) { return this.isRendered ? func() : this.asyncRender().then(func) }

	adopt(xParent: XItem, isRetainingPosition = true): anyPromise {
		return this.whenRendered(() => {
			xParent.whenRendered(() => {
				if (isRetainingPosition) {
					this.set(this.getLocalPosData(xParent));
				}
				$(xParent.elem).appendTo(this.elem);
			});
		});
	}

	to(vars: gsap.TweenVars) { return this.whenRendered(() => gsap.to(this.elem, vars)) }
	from(vars: gsap.TweenVars) { return this.whenRendered(() => gsap.from(this.elem, vars)) }
	fromTo(fromVars: gsap.TweenVars, toVars: gsap.TweenVars) { return this.whenRendered(() => gsap.fromTo(this.elem, fromVars, toVars)) }
	set(vars: gsap.TweenVars) { return this.whenRendered(() => gsap.set(this.elem, vars)) }


}