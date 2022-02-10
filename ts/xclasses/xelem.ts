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

	public static getTemplatePath(fileRelativePath: string) {
		return `/systems/orex/templates/${
			`${fileRelativePath}.hbs`.replace(/\.*\/*\\*(?:systems|orex|templates)\/*\\*|(\..{2,})\.hbs$/g, "$1")
		}`;
	}

	constructor(xItem: XItem) {
		this._xItem = xItem;
	}

	get elem() { return this._xItem.elem }
	get xItem() { return this._xItem }
	get parent() { return this._xItem.parent }

	// LOCAL SPACE: Position & Dimensions
	get _x() { return U.get(this.elem, "x", "px") }
	get _y() { return U.get(this.elem, "y", "px") }
	get _pos(): point { return {x: this._x, y: this._y} }
	get _rotation() { return <number>U.get(this.elem, "rotation") }
	get _scale() { return <number>U.get(this.elem, "scale") }

	// XROOT SPACE (Global): Position & Dimensions
	get pos(): point {
		if (this.parent) {
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
						{parent} = this._xItem;
		while (parent) {
			const thisRotation = U.get(parent.elem, "rotation");
			if (typeof thisRotation === "number") {
				totalRotation += thisRotation;
			}
			({parent} = parent);
		}
		return totalRotation;
	}
	get scale() {
		let totalScale = 1,
						{parent} = this._xItem;
		while (parent) {
			const thisScale = U.get(parent.elem, "scale");
			if (typeof thisScale === "number") {
				totalScale *= thisScale;
			}
			({parent} = parent);
		}
		return totalScale;
	}

	getLocalPosData(xItem: XItem, globalPoint?: point): pointFull {
		return {
			...MotionPathPlugin.convertCoordinates(
				XItem.XROOT.elem,
				this.elem,
				globalPoint ?? xItem.pos
			),
			rotation: xItem.rotation - this.rotation,
			scale: xItem.scale / this.scale
		};
	}
	adopt(xItem: XItem, isRetainingPosition = true) {
		this.xItem.whenRendered(() => {
			if (isRetainingPosition) {
				xItem.set(this.getLocalPosData(xItem));
			}
			$(xItem.elem).appendTo(this.elem);
		});
	}

	get height(): number { return U.get(this.elem, "height", "px") }
	get width(): number { return U.get(this.elem, "width", "px") }
	get size(): number { return (this.height + this.width) / 2 }
	get radius(): number | false { return (this.height === this.width ? this.height : false) }
}