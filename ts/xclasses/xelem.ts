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
	XROOT, XItem
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
import type {KnownKeys} from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

// #region ████████ Type Definitions: TypeScript Interfaces Related to DOM Elements ████████ ~

export type Point = gsap.Point2D;
export type XAnim = gsap.core.Tween | gsap.core.Timeline;
export interface Position extends Point {
	height: number;
	width: number;
	rotation: number;
	scale: number;
	origin: Point;
}

export interface OnRender {
	set?: gsap.TweenVars,
	to?: gsap.TweenVars,
	from?: gsap.TweenVars,
	funcs?: Array<(xItem?: XItem) => void>
}

export type OnRenderFrozen = Omit<OnRender, "to"|"from">
export interface Renderable extends Position {
	id: string;
	renderApp: Application;
	xParent?: XItem | XROOT;

	elem: HTMLElement;
	elem$: JQuery<HTMLElement>;

	xRender: () => Promise<XItem|XROOT>;
	isRendered: boolean;
	xInitialize: () => Promise<XItem|XROOT>;
	isInitialized: boolean;
	onRender: Pick<OnRender, "set" | "funcs">

	pos: Point;
	size: number;
	radius: number;

	global: Position;
}

export interface Changeable extends Renderable {
	set: (vars: gsap.TweenVars) => XItem;
}
export interface Tweenable extends Changeable {
	xTweens: Record<string, XAnim>;
	xParent: XItem | XROOT;
	isFreezingRotate: boolean;

	onRender: OnRender;

	to: (vars: gsap.TweenVars) => XItem;
	from: (vars: gsap.TweenVars) => XItem;
	fromTo: (fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => XItem;

	tweenTimeScale(tweenID: string, timeScale?: number, duration?: number): gsap.core.Tween;
}
export interface XParent {
	xKids: Set<XItem>;
	hasKids: boolean;

	registerXKid(xKid: XItem): void;
	unregisterXKid(xKid: XItem): void;

	getXKids<X extends XItem>(classRef: ConstructorOf<X>, isGettingAll?: boolean): X[];

	adopt: (item: XItem, isRetainingPosition?: boolean) => void;
	disown: (item: XItem) => void;
}
export interface XElemOptions {
	onRender?: OnRender;
}
// #endregion ▄▄▄▄▄ Type Definitions ▄▄▄▄▄

// #region 🟩🟩🟩 XElem: Contains & Controls a DOM Element Linked to an XItem 🟩🟩🟩
export default class XElem<RenderApp extends XItem> implements Tweenable {

	// #region ▮▮▮▮▮▮▮ [Render Control] Async Confirmation of Element Rendering ▮▮▮▮▮▮▮ ~
	#isRendered = false;
	get isRendered() { return this.renderApp.rendered && this.#isRendered }

	#renderPromise?: Promise<RenderApp>;
	onRender: OnRender;
	async xRender(): Promise<RenderApp> {
		if (this.isRendered) {
			this.#renderPromise ??= Promise.resolve(this.renderApp);
		}
		return (this.#renderPromise ??= this.renderApp.renderApplication()
			.then(async () => {
				if (this.onRender.set) {
					this.set(this.onRender.set);
				}
				this.#isRendered = true;
				if (this.onRender.to && this.onRender.from) {
					this.fromTo(this.onRender.from, this.onRender.to);
				} else if (this.onRender.to) {
					this.to(this.onRender.to);
				} else if (this.onRender.from) {
					this.from(this.onRender.from);
				}

				await Promise.all((this.onRender.funcs ?? []).map((func) => func(this.renderApp)));
				return this.renderApp;
			}));
	}
	protected validateRender() {
		if (!this.isRendered) {
			throw Error(`Can't retrieve element of unrendered ${
				this.constructor.name ?? "XItem"
			} [ ${this.id} ]: Did you forget to await confirmRender?`);
		}
	}
	get isInitialized() { return this.renderApp.isInitialized }
	get xInitialize() { return this.renderApp.xInitialize.bind(this.renderApp) }
	// #endregion ▮▮▮▮[Render Control]▮▮▮▮

	// #region ████████ CONSTRUCTOR & Essential Fields ████████ ~
	readonly id: string;
	readonly renderApp: RenderApp;
	get elem() { this.validateRender(); return this.renderApp.element[0] }
	get elem$() { return $(this.elem) }

	constructor(renderApp: RenderApp, xOptions: XElemOptions) {
		this.renderApp = renderApp;
		this.id = this.renderApp.id;
		this.onRender = xOptions.onRender ?? {};
	}
	// #endregion ▄▄▄▄▄ CONSTRUCTOR ▄▄▄▄▄

	// #region ████████ Parenting: Adopting & Managing Child XItems ████████ ~
	get xParent(): XItem | XROOT { return this.renderApp.xParent }

	adopt(child: XItem, isRetainingPosition = true): void {
		const localPosData = isRetainingPosition ? this.getLocalPosData(child) : {};
		const childRotation = child.global.rotation;
		child.xParent?.disown(child);
		this.renderApp.registerXKid(child);
		if (this.isRendered && child.isRendered) {
			if (isRetainingPosition || child.isFreezingRotate) {
				child.set({
					...isRetainingPosition ? localPosData : {},
					...child.isFreezingRotate ? {rotation: childRotation - this.global.rotation} : {}
				});
			}
			child.elem$.appendTo(this.elem);
		} else if (this.isRendered) {
			child.xElem.onRender.funcs ??= [];
			child.xElem.onRender.funcs.unshift(() => {
				this.adopt(child, isRetainingPosition);
			});
		} else {
			this.onRender.funcs ??= [];
			this.onRender.funcs.push(() => this.adopt(child, isRetainingPosition));
		}
	}
	disown(child: XItem): void {
		this.renderApp.unregisterXKid(child);
	}

	tweenTimeScale(tweenID: keyof typeof this.xTweens, timeScale = 1, duration = 1) {
		const tween = this.xTweens[tweenID];
		return gsap.to(tween, {
			timeScale,
			duration,
			ease: "sine.inOut"
		});
	}
	// #endregion ▄▄▄▄▄ Parenting ▄▄▄▄▄

	// #region ████████ Positioning: Positioning DOM Element in Local and Global (XROOT) Space ████████ ~
	// #region ░░░░░░░ Local Space ░░░░░░░ ~
	get x() { return U.pInt(this.isRendered ? U.get(this.elem, "x", "px") : this.onRender.set?.x) }
	get y() { return U.pInt(this.isRendered ? U.get(this.elem, "y", "px") : this.onRender.set?.y) }
	get xPercent() { return this.isRendered ? U.get(this.elem, "xPercent") : this.onRender.set?.xPercent ?? -50 }
	get yPercent() { return this.isRendered ? U.get(this.elem, "yPercent") : this.onRender.set?.yPercent ?? -50 }
	get pos(): Point { return {x: this.x, y: this.y} }
	get rotation() { return U.pFloat(this.isRendered ? U.get(this.elem, "rotation") : this.onRender.set?.rotation, 2) }
	get scale() { return U.pFloat(this.isRendered ? U.get(this.elem, "scale") : this.onRender.set?.scale, 2) || 1 }
	get origin() {
		return {
			x: -1 * (gsap.getProperty(this.elem, "xPercent") as number / 100) * this.width,
			y: -1 * (gsap.getProperty(this.elem, "yPercent") as number / 100) * this.height
		};
	}
	// #endregion ░░░░[Local Space]░░░░
	// #region ░░░░░░░ Global (XROOT) Space ░░░░░░░ ~
	get global() {
		const self = this;
		return {
			get pos() {
				if (self.isRendered) {
					return MotionPathPlugin.convertCoordinates(
						self.elem,
						XItem.XROOT.elem,
						self.origin
					);
				}
				return self.pos;
			},
			get x() { return this.pos.x },
			get y() { return this.pos.y },
			get height() { return self.height * this.scale },
			get width() { return self.width * this.scale },
			get rotation() {
				let totalRotation = self.rotation,
								{xParent: parentApp} = self;
				while (parentApp instanceof XItem) {
					totalRotation += parentApp.rotation;
					parentApp = parentApp.xParent;
				}
				return totalRotation;
			},
			get scale() {
				let totalScale = self.scale,
								{xParent: parentApp} = self;
				while (parentApp instanceof XItem) {
					totalScale *= parentApp.scale;
					parentApp = parentApp.xParent;
				}
				return totalScale;
			},
			get origin() { return self.origin }
		};
	}

	get height() { return U.pInt(this.isRendered ? U.get(this.elem, "height", "px") : this.onRender.set?.height) }
	get width() { return U.pInt(this.isRendered ? U.get(this.elem, "width", "px") : this.onRender.set?.width) }
	get size() { return (this.height + this.width) / 2 }
	get radius() { return this.size }
	// #endregion ░░░░[Global (XROOT) Space]░░░░
	// #region ░░░░░░░ Converting from Global Space to Element's Local Space ░░░░░░░ ~
	getLocalPosData(ofItem: XItem, globalPoint?: Point): Position {
		return {
			...this.isRendered && ofItem.isRendered
				? MotionPathPlugin.convertCoordinates(
					XItem.XROOT.elem,
					this.elem,
					globalPoint ?? ofItem.global.pos
				)
				: ofItem.pos,
			rotation: ofItem.global.rotation - this.global.rotation,
			scale: ofItem.global.scale / this.global.scale,
			height: ofItem.height,
			width: ofItem.width,
			origin: ofItem.xElem.origin
		};
	}
	// #endregion ░░░░[Global to Local]░░░░
	// #region ░░░░░░░ Relative Positions ░░░░░░░ ~
	getDistanceTo(posRef: XItem | {x: number, y: number}, globalPoint?: {x: number, y: number}) {
		const {x: tGlobalX, y: tGlobalY} = posRef instanceof XItem ? posRef.global : posRef;
		return U.getDistance({x: tGlobalX, y: tGlobalY}, globalPoint ?? this.global);
	}
	getGlobalAngleTo(posRef: XItem | {x: number, y: number}, globalPoint?: {x: number, y: number}) {
		const {x: tGlobalX, y: tGlobalY} = posRef instanceof XItem ? posRef.global : posRef;
		return U.getAngle({x: tGlobalX, y: tGlobalY}, globalPoint ?? this.global);
	}
	// #endregion ░░░░[Relative Positions]░░░░
	// #endregion ▄▄▄▄▄ Positioning ▄▄▄▄▄

	// #region ████████ GSAP: GSAP Animation Method Wrappers ████████ ~
	xTweens: Record<string, XAnim> = {};
	get isFreezingRotate() { return this.renderApp.isFreezingRotate }
	/*~ Figure out a way to have to / from / fromTo methods on all XItems that:
			- will adjust animation timescale based on a maximum time to maximum distance ratio(and minspeed ratio ?)
			- if timescale is small enough, just uses.set() ~*/

	set(vars: gsap.TweenVars): RenderApp {
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
	to(vars: gsap.TweenVars): RenderApp {
		if (this.isRendered) {
			const tween = gsap.to(this.elem, vars);
			if (vars.id) {
				this.xTweens[vars.id] = tween;
			}
		} else {
			this.onRender.to = {
				...this.onRender.to ?? {},
				...vars
			};
		}
		return this.renderApp;
	}
	from(vars: gsap.TweenVars): RenderApp {
		if (this.isRendered) {
			const tween = gsap.from(this.elem, vars);
			if (vars.id) {
				this.xTweens[vars.id] = tween;
			}
		} else {
			this.onRender.from = {
				...this.onRender.from ?? {},
				...vars
			};
		}
		return this.renderApp;
	}
	fromTo(fromVars: gsap.TweenVars, toVars: gsap.TweenVars): RenderApp {
		if (this.isRendered) {
			const tween = gsap.fromTo(this.elem, fromVars, toVars);
			if (toVars.id) {
				this.xTweens[toVars.id] = tween;
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