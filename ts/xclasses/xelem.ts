// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ====== GreenSock Animation ====== ~
	gsap,
	Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools,
	RoughEase,
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮ XItems ▮▮▮▮▮▮▮
	XItem
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
import type {KnownKeys} from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

// #region ████████ Type Definitions: TypeScript Interfaces Related to DOM Elements ████████ ~
export interface Position extends Exclude<Point, PIXI.Point> {
	rotation: number;
	scale: number;
}
export type XAnim = gsap.core.Tween | gsap.core.Timeline;
export interface XElemOptions {
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
	tweens: Record<string, XAnim>;

	set: (vars: gsap.TweenVars) => XItem,
	to: (vars: gsap.TweenVars) => XItem,
	from: (vars: gsap.TweenVars) => XItem,
	fromTo: (fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => XItem
}
// #endregion ▄▄▄▄▄ Type Definitions ▄▄▄▄▄

// #region 🟩🟩🟩 XElem: Contains & Controls a DOM Element Linked to an XItem 🟩🟩🟩
export default class XElem<RenderItem extends XItem> implements DOMRenderer, GSAPController {

	// #region ▮▮▮▮▮▮▮ [Render Control] Async Confirmation of Element Rendering ▮▮▮▮▮▮▮ ~
	private renderPromise?: Promise<boolean>;
	#isRenderReady = false;
	get isRenderReady(): boolean { return this.#isRenderReady }
	async confirmRender(isRendering = true): Promise<boolean> {
		this.#isRenderReady = this.isRenderReady || isRendering;
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

	get isRendered() { return this.renderApp.rendered }
	protected validateRender() {
		if (!this.isRendered) {
			throw Error(`Can't retrieve element of unrendered ${this.constructor.name ?? "XItem"} '${this.id}': Did you forget to await confirmRender?`);
		}
	}

	readonly onRender: {
		set?: gsap.TweenVars,
		to?: gsap.TweenVars,
		from?: gsap.TweenVars,
		funcs?: Array<<X extends typeof XItem>(xItem: InstanceType<X>) => void>
	};
	// #endregion ▮▮▮▮[Render Control]▮▮▮▮

	// #region ████████ CONSTRUCTOR & Essential Fields ████████ ~
	readonly id: string;
	readonly renderApp: RenderItem;
	get elem() { this.validateRender(); return this.renderApp.element[0] }
	get elem$() { return $(this.elem) }

	constructor(renderApp: RenderItem, xOptions: XElemOptions) {
		this.renderApp = renderApp;
		this.id = this.renderApp.id;
		this.onRender = xOptions.onRender ?? {};
	}
	// #endregion ▄▄▄▄▄ CONSTRUCTOR ▄▄▄▄▄

	// #region ████████ Parenting: Adopting & Managing Child XItems ████████ ~
	get parentApp(): XItem | null { return this.renderApp.xParent }

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
	// #endregion ▄▄▄▄▄ Parenting ▄▄▄▄▄

	// #region ████████ Positioning: Positioning DOM Element in Local and Global (XROOT) Space ████████ ~
	// #region ░░░░░░░ Local Space ░░░░░░░ ~
	get x() { return U.pInt(this.isRendered ? U.get(this.elem, "x", "px") : this.onRender.set?.x) }
	get y() { return U.pInt(this.isRendered ? U.get(this.elem, "y", "px") : this.onRender.set?.y) }
	get pos(): Point { return {x: this.x, y: this.y} }
	get rotation() { return U.pFloat(this.isRendered ? U.get(this.elem, "rotation") : this.onRender.set?.rotation, 2) }
	get scale() { return U.pFloat(this.isRendered ? U.get(this.elem, "scale") : this.onRender.set?.scale, 2) || 1 }
	// #endregion ░░░░[Local Space]░░░░
	// #region ░░░░░░░ Global (XROOT) Space ░░░░░░░ ~
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
	// #endregion ░░░░[Global (XROOT) Space]░░░░
	// #region ░░░░░░░ Converting from Global to Element's Local Space ░░░░░░░ ~
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
	// #endregion ░░░░[Converting from Global to Element's Local Space]░░░░
	// #endregion ▄▄▄▄▄ Positioning ▄▄▄▄▄

	// #region ████████ GSAP: GSAP Animation Method Wrappers ████████ ~
	tweens: Record<string, XAnim> = {};
	/*~ Figure out a way to have to / from / fromTo methods on all XItems that:
			- will adjust animation timescale based on a maximum time to maximum distance ratio(and minspeed ratio ?)
			- if timescale is small enough, just uses.set() ~*/

	set(vars: gsap.TweenVars): RenderItem {
		if (this.isRendered) {
			gsap.set(this.elem, vars);
		} else {
			this.onRender.set = {
				...this.onRender.set ?? {},
				...vars
			};
		}
		return this.renderApp;
	}
	to(vars: gsap.TweenVars): RenderItem {
		if (this.isRendered) {
			const tween = gsap.to(this.elem, vars);
			if (vars.id) {
				this.tweens[vars.id] = tween;
			}
		} else {
			this.onRender.to = {
				...this.onRender.to ?? {},
				...vars
			};
		}
		return this.renderApp;
	}
	from(vars: gsap.TweenVars): RenderItem {
		if (this.isRendered) {
			const tween = gsap.from(this.elem, vars);
			if (vars.id) {
				this.tweens[vars.id] = tween;
			}
		} else {
			this.onRender.from = {
				...this.onRender.from ?? {},
				...vars
			};
		}
		return this.renderApp;
	}
	fromTo(fromVars: gsap.TweenVars, toVars: gsap.TweenVars): RenderItem {
		if (this.isRendered) {
			const tween = gsap.fromTo(this.elem, fromVars, toVars);
			if (toVars.id) {
				this.tweens[toVars.id] = tween;
			}
		} else {
			this.onRender.to = {
				...this.onRender.to ?? {},
				...toVars
			};
			this.onRender.from = {
				...this.onRender.from ?? {},
				...fromVars
			};
		}
		return this.renderApp;
	}
	// #endregion ▄▄▄▄▄ GSAP ▄▄▄▄▄
}
// #endregion 🟩🟩🟩 XElem 🟩🟩🟩