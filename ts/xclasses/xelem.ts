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

export interface Position extends Exclude<Point, PIXI.Point> {
	rotation: number;
	scale: number;
}
export interface XElemOptions {
	renderApp: XItem;
	onRender?: {
		set?: gsap.TweenVars,
		to?: gsap.TweenVars,
		from?: gsap.TweenVars,
		funcs?: Array<(xItem?: XItem) => void>;
	}
}

export interface DOMRenderer extends Position {
	id: string;
	renderApp: XItem;
	elem: HTMLElement;
	elem$: JQuery<HTMLElement>;
	confirmRender: () => Promise<boolean>;
	isRendered: boolean;
	isRenderReady: boolean;

	x: number,
	y: number,
	pos: Point,
	rotation: number,
	scale: number,
	height: number,
	width: number,
	size: number,
	radius: number | false,
	global: Position,

	adopt: (xItem: XItem, isRetainingPosition?: boolean) => void,
}
export interface GSAPController {
	tweens: Record<string, gsap.core.Tween|gsap.core.Timeline>;

	set: (vars: gsap.TweenVars) => gsap.core.Tween | false,
	to: (vars: gsap.TweenVars) => gsap.core.Tween | false,
	from: (vars: gsap.TweenVars) => gsap.core.Tween | false,
	fromTo: (fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => gsap.core.Tween | false
}
export default class XElem implements DOMRenderer, GSAPController {
	private renderPromise?: Promise<boolean>;
	public tweens: Record<string, gsap.core.Tween | gsap.core.Timeline> = {};

	public readonly id: string;
	public readonly renderApp: XItem;
	public get parentApp(): XItem | null { return this.renderApp.xParent }
	public readonly onRender: {
		set?: gsap.TweenVars,
		to?: gsap.TweenVars,
		from?: gsap.TweenVars,
		funcs?: Array<<X extends typeof XItem>(xItem: InstanceType<X>) => void>
	};

	public get elem() { this.validateRender(); return this.renderApp.element[0] }
	public get elem$() { return $(this.elem) }

	protected _isRenderReady = false;
	public get isRenderReady(): boolean { return this._isRenderReady }

	public async confirmRender(isRendering = true): Promise<boolean> {
		this._isRenderReady = this.isRenderReady || isRendering;
		if (this.isRendered) { return Promise.resolve(true) }
		if (!this.isRenderReady) { return Promise.resolve(false) }
		this.renderPromise = this.renderApp.renderApplication();
		await this.renderPromise;
		if (this.parentApp) {
			if (!(await this.parentApp.confirmRender())) {
				console.warn("Attempt to render child of unrendered parent.");
				return Promise.resolve(false);
			}
			this.parentApp?.adopt(this.renderApp, false);
		}
		if (this.onRender.set) {
			this.set(this.onRender.set);
		}
		if (this.onRender.to && this.onRender.from) {
			this.fromTo(this.onRender.from, this.onRender.to);
		} else if (this.onRender.to) {
			this.to(this.onRender.to);
		} else if (this.onRender.from) {
			this.from(this.onRender.from);
		}
		this.onRender.funcs?.forEach((func) => func(this.renderApp));
		return this.renderPromise;
	}
	public get isRendered() { return this.renderApp.rendered }
	protected validateRender() {
		if (!this.isRendered) {
			throw Error(`Can't retrieve element of unrendered ${this.constructor.name ?? "XItem"} '${this.id}': Did you forget to await confirmRender?`);
		}
	}

	constructor(xOptions: XElemOptions) {
		this.renderApp = xOptions.renderApp;
		this.id = this.renderApp.id;
		this.onRender = xOptions.onRender ?? {};
	}

	adopt(child: XItem, isRetainingPosition = true): void {
		child.xParent?.unregisterXKid(child);
		this.renderApp.registerXKid(child);
		if (this.isRendered && child.isRendered) {
			if (isRetainingPosition) {
				child.set(this.getLocalPosData(child));
			}
			child.elem$.appendTo(this.elem);
		}
	}

	// LOCAL SPACE: Position & Dimensions
	get x() { return U.pInt(this.isRendered ? U.get(this.elem, "x", "px") : this.onRender.set?.x) }
	get y() { return U.pInt(this.isRendered ? U.get(this.elem, "y", "px") : this.onRender.set?.y) }
	get pos(): Point { return {x: this.x, y: this.y} }
	get rotation() { return U.pFloat(this.isRendered ? U.get(this.elem, "rotation") : this.onRender.set?.rotation, 2) }
	get scale() { return U.pFloat(this.isRendered ? U.get(this.elem, "scale") : this.onRender.set?.scale, 2) || 1 }

	// XROOT SPACE (Global): Position & Dimensions
	get global() {
		this.validateRender();
		const self = this;
		return {
			get pos() {
				if (self.parentApp) {
					self.parentApp.xElem.validateRender();
					return MotionPathPlugin.convertCoordinates(
						self.parentApp.elem,
						XItem.XROOT.elem,
						self.pos
					);
				}
				return self.pos;
			},
			get x() { return this.pos.x },
			get y() { return this.pos.y },
			get rotation() {
				let totalRotation = self.rotation,
								{parentApp} = self;
				while (parentApp) {
					parentApp.xElem.validateRender();
					totalRotation += parentApp.rotation;
					parentApp = parentApp.xParent;
				}
				return totalRotation;
			},
			get scale() {
				let totalScale = self.scale,
								{parentApp} = self;
				while (parentApp) {
					parentApp.xElem.validateRender();
					totalScale *= parentApp.scale;
					parentApp = parentApp.xParent;
				}
				return totalScale;
			}
		};
	}

	get height() { return U.pInt(this.isRendered ? U.get(this.elem, "height", "px") : this.onRender.set?.height) }
	get width() { return U.pInt(this.isRendered ? U.get(this.elem, "width", "px") : this.onRender.set?.width) }
	get size() { return (this.height + this.width) / 2 }
	get radius(): number | false { return (this.height === this.width ? this.height : false) }

	getLocalPosData(ofItem: XItem, globalPoint?: Point): Position {
		this.validateRender();
		ofItem.xElem.validateRender();
		return {
			...MotionPathPlugin.convertCoordinates(
				XItem.XROOT.elem,
				this.elem,
				globalPoint ?? ofItem.global.pos
			),
			rotation: ofItem.global.rotation - this.global.rotation,
			scale: ofItem.global.scale / this.global.scale
		};
	}

	/* Figure out a way to have to / from / fromTo methods on all XItems that:
			- will adjust animation timescale based on a maximum time to maximum distance ratio(and minspeed ratio ?)
			- if timescale is small enough, just uses.set() */

	set(vars: gsap.TweenVars) {
		if (this.isRendered) {
			return gsap.set(this.elem, vars);
		}
		this.onRender.set = {
			...this.onRender.set ?? {},
			...vars
		};
		return false;
	}
	to(vars: gsap.TweenVars) {
		if (this.isRendered) {
			const tween = gsap.to(this.elem, vars);
			if (vars.id) {
				this.tweens[vars.id] = tween;
			}
			return tween;
		}
		this.onRender.to = {
			...this.onRender.to ?? {},
			...vars
		};
		return false;
	}
	from(vars: gsap.TweenVars) {
		if (this.isRendered) {
			const tween = gsap.from(this.elem, vars);
			if (vars.id) {
				this.tweens[vars.id] = tween;
			}
			return tween;
		}
		this.onRender.from = {
			...this.onRender.from ?? {},
			...vars
		};
		return false;
	}
	fromTo(fromVars: gsap.TweenVars, toVars: gsap.TweenVars) {
		if (this.isRendered) {
			const tween = gsap.fromTo(this.elem, fromVars, toVars);
			if (toVars.id) {
				this.tweens[toVars.id] = tween;
			}
			return tween;
		}
		this.onRender.to = {
			...this.onRender.to ?? {},
			...toVars
		};
		this.onRender.from = {
			...this.onRender.from ?? {},
			...fromVars
		};
		return false;
	}
}