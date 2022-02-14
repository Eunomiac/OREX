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

export interface Position extends Exclude<Point,PIXI.Point> {
	rotation: number,
	scale: number
}
export interface XElemOptions {
	id?: string;
	renderApp: XItem;
	noImmediateRender?: boolean;
	onRender?: {
		set?: gsap.TweenVars,
		to?: gsap.TweenVars,
		from?: gsap.TweenVars
	}
}

export interface DOMRenderer {
	id: string;
	renderApp: XItem;
	elem: HTMLElement;
	elem$: JQuery<HTMLElement>;
	asyncRender: () => Promise<void>;
	isRendered: boolean;

	// Local Coordinates
	_x: number,
	_y: number,
	_pos: Point,
	_rotation: number,
	_scale: number,

	// Global Coordinates
	x: number,
	y: number,
	pos: Point,
	rotation: number,
	scale: number,

	adopt: (xItem: XItem, isRetainingPosition?: boolean) => void,
	set: (vars: gsap.TweenVars) => gsap.core.Tween,
	to: (vars: gsap.TweenVars) => gsap.core.Tween,
	from: (vars: gsap.TweenVars) => gsap.core.Tween,
	fromTo: (fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => gsap.core.Tween
}

export default class XElem implements DOMRenderer {
	private _renderPromise?: Promise<void>;
	private _isParented?: boolean;

	public readonly id: string;
	public readonly renderApp: XItem;
	public get parentApp(): XItem | null { return this.renderApp.parent }
	private readonly _onRender: {set?: gsap.TweenVars, to?: gsap.TweenVars, from?: gsap.TweenVars};
	protected validateRender() {
		if (!this.isRendered) {
			debugger;
			throw Error(`Can't retrieve element of unrendered ${this.constructor.name ?? "XItem"} '${this.id}': Did you forget to await asyncRender?`);
		}
	}

	public get elem() { this.validateRender(); return this.renderApp.element[0] }
	public get elem$() { return $(this.elem) }

	public async asyncRender(): Promise<void> {
		if (!this._renderPromise) {
			this._renderPromise = this.renderApp.renderApplication();
			await this._renderPromise;
			if (this.parentApp) {
				await this.parentApp.asyncRender();
				this.parentApp.adopt(this.renderApp, false);
			}
			if (this._onRender.set) {
				this.set(this._onRender.set);
			}
			if (this._onRender.to && this._onRender.from) {
				this.fromTo(this._onRender.from, this._onRender.to);
			} else if (this._onRender.to) {
				this.to(this._onRender.to);
			} else if (this._onRender.from) {
				this.from(this._onRender.from);
			}
		}
		return this._renderPromise;
	}

	public get isRendered() { return this.renderApp.rendered }

	constructor(options: XElemOptions) {
		this.id = options.id ?? `x-elem-${U.getUID()}`;
		this.renderApp = options.renderApp;
		this._onRender = options.onRender ?? {};
		if (!options.noImmediateRender) {
			this.asyncRender();
		}
	}

	adopt(child: XItem, isRetainingPosition = true): void {
		this.validateRender();
		child.xElem.validateRender();
		if (isRetainingPosition) {
			this.set(this.getLocalPosData(child));
		}
		child.elem$.appendTo(this.elem);
	}

	// LOCAL SPACE: Position & Dimensions
	get _x() { return U.get(this.elem, "x", "px") }
	get _y() { return U.get(this.elem, "y", "px") }
	get _pos(): Point { return {x: this._x, y: this._y} }
	get _rotation() { return U.pFloat(U.get(this.elem, "rotation")) }
	get _scale() { return U.pFloat(U.get(this.elem, "scale")) || 1 }

	// XROOT SPACE (Global): Position & Dimensions
	get pos(): Point {
		if (this.parentApp && this.parentApp.isRendered) {
			return MotionPathPlugin.convertCoordinates(
				this.parentApp.elem,
				XItem.XROOT.elem,
				this._pos
			);
		}
		return this._pos;
	}
	get x() { return this.pos.x }
	get y() { return this.pos.y }
	get rotation() {
		let totalRotation = this._rotation,
						{parentApp} = this;
		while (parentApp && parentApp.isRendered) {
			totalRotation += U.pFloat(U.get(parentApp.elem, "rotation"));
			parentApp = parentApp.parent;
		}
		return totalRotation;
	}
	get scale() {
		let totalScale = 1,
						{parentApp} = this;
		while (parentApp && parentApp.isRendered) {
			totalScale *= U.pFloat(U.get(parentApp.elem, "scale"));
			parentApp = parentApp.parent;
		}
		return totalScale;
	}
	get height(): number { return U.get(this.elem, "height", "px") }
	get width(): number { return U.get(this.elem, "width", "px") }
	get size(): number { return (this.height + this.width) / 2 }
	get radius(): number | false { return (this.height === this.width ? this.height : false) }
	getLocalPosData(ofItem: XItem, globalPoint?: Point): Position {
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

	to(vars: gsap.TweenVars) { this.validateRender; return gsap.to(this.elem, vars) }
	from(vars: gsap.TweenVars) { this.validateRender; return gsap.from(this.elem, vars) }
	fromTo(fromVars: gsap.TweenVars, toVars: gsap.TweenVars) { this.validateRender; return gsap.fromTo(this.elem, fromVars, toVars) }
	set(vars: gsap.TweenVars) { this.validateRender; return gsap.set(this.elem, vars) }
}