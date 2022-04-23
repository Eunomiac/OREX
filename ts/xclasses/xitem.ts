// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ====== GreenSock Animation ====== ~
	gsap,
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U, DB,
	XGroup, XPool, XRoll,
	XDie, XTerm, XMod
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
} from "../helpers/bundler.js";
import type {ConstructorOf, XTermType} from"../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

// #region ▮▮▮▮▮▮▮ TYPE.DS ▮▮▮▮▮▮▮ ~
// #region ====== Base Types ====== ~
export type Point = gsap.Point2D;
export interface Position extends Point {
	height: number;
	width: number;
	rotation: number;
	scale: number;
}
export type Anim = gsap.core.Tween | gsap.core.Timeline;
export type RenderFunc = (xItem: BaseXItem) => Promise<void>;
// #endregion ___ Base Types ___
// #region ====== Utility Types ====== ~

// #endregion ___ Utility Types ___
// #region ====== XOptions: Defining 'Options' Parameter for XClass Initialization ====== ~
export type ScalingVars = {
	scaleTarget: keyof gsap.CSSProperties & string,
	maxDelta: number,
	maxDur?: number,
	minDur?: number
}
export interface XTweenVars extends gsap.TweenVars {
	durScaling?: ScalingVars;
}

export namespace XOptions {
	// BASES
	export interface BaseItem {
		isFreezingRotate: boolean;
		preRenderFuncs: RenderFunc[];
		postRenderFuncs: RenderFunc[];
		postRenderVars: Partial<gsap.CSSProperties>;
	}
	export interface ROOT extends BaseItem, ApplicationOptions {
		id: "XROOT";
		xParent: null;
	}
	export interface Item extends BaseItem, ApplicationOptions {
		xParent: XGroup;
	}
	export interface BaseTerm {
		type: XTermType;
	}

	// ITEMS

	export interface Group extends Item { }
	export interface Pool extends Group { }
	export interface Orbit extends Group { }
	export interface Arm extends Group { }
	export interface Roll extends Pool { }
	export interface Source extends Pool { }
	export interface Sink extends Pool { }

	// TERMS - XItems That Can Themselves be Components of XPools
	export interface Set extends Pool, BaseTerm { }
	export interface Die extends Item, BaseTerm { }
	export interface Mod extends Item, BaseTerm { }
	export interface Ghost extends Mod { }
	export interface Mutator extends Mod { }
	export interface Info extends Mod { }

	// OTHER - Miscellaneous Interactive XItems

	export interface Pad extends Item { }
}
// #endregion ___ XOptions ___
// #endregion ▮▮▮▮[TYPE.DS]▮▮▮▮


class BaseXItem<Options extends XOptions.BaseItem & ApplicationOptions> extends Application<Options> {

	static override get defaultOptions() {
		return U.objMerge(super.defaultOptions, {
			popOut: false,
			classes: ["x-item"],
			template: U.getTemplatePath("xitem"),
			postRenderVars: {
				xPercent: -50,
				yPercent: -50,
				x: 0,
				y: 0,
				opacity: 0,
				rotation: 0,
				scale: 1,
				transformOrigin: "50% 50%"
			}
		}) as XOptions.BaseItem & ApplicationOptions;
	}

	get classRef() { return this.constructor as typeof BaseXItem }

	// #region 🟪🟪🟪 RENDERABLE 🟪🟪🟪 ~

	get isRendered() { return this.rendered }
	get elem() { return this.element[0] }
	get elem$() { return $(this.elem) }

	xParent: XGroup | XROOT | null = XROOT.XROOT; //~ null only in the single case of the top XItem, XROOT.XROOT

	_preRenderFuncs: RenderFunc[] = [];
	_postRenderFuncs: RenderFunc[] = [];
	_postRenderVars: Partial<gsap.CSSProperties> = {};

	get preRenderFuncs() { return this._preRenderFuncs }
	get postRenderFuncs() { return this._postRenderFuncs }

	get postRenderVars() {
		const defaultOptions = this.classRef.defaultOptions as XOptions.BaseItem & ApplicationOptions;
		return U.objMerge(
			defaultOptions.postRenderVars,
			this._postRenderVars
		);
	}
	set postRenderVars(vars: Partial<gsap.CSSProperties>) {
		U.objMerge(
			this._postRenderVars,
			vars
		);
	}

	// #region ████████ Positioning: Positioning DOM Element in Local and Global (XROOT) Space ████████ ~
	// #region ░░░░░░░ Local Space ░░░░░░░ ~
	get x() { return U.pInt(U.get(this.elem, "x", "px")) }
	get y() { return U.pInt(U.get(this.elem, "y", "px")) }
	get height() { return U.pInt(U.get(this.elem, "height", "px")) }
	get width() { return U.pInt(U.get(this.elem, "width", "px")) }
	get size() { return (this.height + this.width) / 2 }
	get pos(): Point { return {x: this.x, y: this.y} }
	get rotation() { return U.cycleAngle(U.pFloat(U.get(this.elem, "rotation"), 2), [-180, 180]) }
	get scale() { return U.pFloat(U.get(this.elem, "scale"), 2) || 1 }
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
				return MotionPathPlugin.convertCoordinates(
					self.elem,
					XROOT.XROOT.elem,
					self.origin
				);
			},
			get x() { return this.pos.x },
			get y() { return this.pos.y },
			get height() { return self.height },
			get width() { return self.width },
			get rotation() {
				let totalRotation = self.rotation,
								{xParent} = self;
				while (xParent?.isRendered) {
					totalRotation += xParent.rotation;
					({xParent} = xParent);
				}
				return U.cycleAngle(totalRotation, [-180, 180]);
			},
			get scale() {
				let totalScale = self.scale,
								{xParent} = self;
				while (xParent?.isRendered) {
					totalScale *= xParent.scale;
					({xParent} = xParent);
				}
				return totalScale;
			}
		};
	}
	// #endregion ░░░░[Global (XROOT) Space]░░░░
	// #region ░░░░░░░ Converting from Global Space to Element's Local Space ░░░░░░░ ~
	getLocalPosData(ofItem: XItem, globalPoint?: Point): Position {
		return {
			...MotionPathPlugin.convertCoordinates(
				XROOT.XROOT.elem,
				this.elem,
				globalPoint ?? ofItem.global.pos
			),
			rotation: U.cycleAngle(ofItem.global.rotation - this.global.rotation, [-180, 180]),
			scale: ofItem.global.scale / this.global.scale,
			height: ofItem.height,
			width: ofItem.width
		};
	}
	// #endregion ░░░░[Global to Local]░░░░
	// #region ░░░░░░░ Relative Positions ░░░░░░░ ~
	getDistanceTo(posRef: XItem | { x: number, y: number }, globalPoint?: { x: number, y: number }) {
		const {x: tGlobalX, y: tGlobalY} = posRef instanceof XItem ? posRef.global : posRef;
		return U.getDistance({x: tGlobalX, y: tGlobalY}, globalPoint ?? this.global);
	}
	getGlobalAngleTo(posRef: XItem | { x: number, y: number }, globalPoint?: { x: number, y: number }) {
		const {x: tGlobalX, y: tGlobalY} = posRef instanceof XItem ? posRef.global : posRef;
		return U.getAngle({x: tGlobalX, y: tGlobalY}, globalPoint ?? this.global);
	}
	// #endregion ░░░░[Relative Positions]░░░░
	// #endregion ▄▄▄▄▄ Positioning ▄▄▄▄▄

	set(vars: gsap.TweenVars): gsap.core.Tween { return gsap.set(this.elem, vars) }

	constructor(options: Options) {
		super(options);
		if (options.xParent) {
			options.id = U.getUID(`${xParent.id}-${options.id ?? this.constructor.name}`.replace(/^XROOT-?/, "X-"));
		}
		if (xParent === null && options.id === "XROOT") {
			this.xParent = null;
		} else {
			this.xParent = xParent ?? XROOT.XROOT;
		}
	}

	override async render(): Promise<typeof this> {
		try {
			await this._render(true, {});
			return this;
		} catch (err) {
			this._state = Application.RENDER_STATES.ERROR;
			return Promise.reject(`An error occurred while rendering ${this.constructor.name} ${this.appId}`);
		}
	}

	override kill() {
		super.kill();
		if (this.xParent) {
			this.xParent.unregisterXKid(this);
		}
		this.elem$.remove();
	}

	override getData() {
		const context = super.getData();
		Object.assign(context, {
			id: this.id,
			classes: this.options.classes.join(" ")
		});
		return context;
	}

	// #endregion 🟪🟪🟪 RENDERABLE 🟪🟪🟪


}


// #region ▮▮▮▮▮▮▮[Mixins] Compartmentalized Functionality for XItems ▮▮▮▮▮▮▮ ~
export function IsRenderable<Options extends XOptions.BaseItem, TBase extends ConstructorOf<BaseXItem<Options>>>(Base: TBase) {
	return class Renderable extends Base {

	};
}

export function CanParent<Options extends XOptions.BaseItem, TBase extends ConstructorOf<BaseXItem<Options>>>(Base: TBase) {
	return class XContainer extends IsRenderable(Base) {

		_xKids: Set<BaseXItem> = new Set();
		get xKids(): Set<BaseXItem> { return this._xKids }
		get hasXKids() { return this.xKids.size > 0 }

		registerXKid(xKid: XItem) { this.xKids.add(xKid) }
		unregisterXKid(xKid: XItem) { this.xKids.delete(xKid) }

		getXKids<X extends BaseXItem>(classRef: ConstructorOf<X>): X[] {
			const xKids: X[] = Array.from(this.xKids.values())
				.flat()
				.filter(U.FILTERS.IsInstance(classRef)) as X[];
			return xKids;
		}
		async addXItem<T extends XItem>(xItem: T): Promise<T> {
			this.adopt(xItem);
			return xItem;
		}
		async addXItems<T extends XItem>(xItems: T[]): Promise<T[]> {
			return Promise.allSettled(xItems.map((xItem) => this.addXItem(xItem)))
				.then(
					() => Promise.resolve(xItems),
					() => Promise.reject()
				);
		}

		adopt(child: XItem): void {
			child.xParent?.disown(child);
			child.xParent = this;
			this.registerXKid(child);

			child.set({
				...this.getLocalPosData(child),
				...child.options.isFreezingRotate ? {rotation: -1 * this.global.rotation} : {}
			});

			child.elem$.appendTo(this.elem);
		}
		disown(child: XItem): void {
			this.unregisterXKid(child);
		}

		adoptXItem(child: XItem): void {
			this.elem$.append(child.elem);
		}

		override kill() {
			if (this.hasXKids) {
				this.getXKids(BaseXItem).forEach((xItem) => xItem.kill());
			}
		}
	};
}
export function IsTweenable<Options extends XOptions.BaseItem, TBase extends ConstructorOf<BaseXItem<Options>>>(Base: TBase) {
	return class Tweenable extends IsRenderable(Base) {
		tweens: Record<string, Anim> = {};
		isFreezingRotate = false;

		/*~ Figure out a way to have to / from / fromTo methods on all XItems that:
				- will adjust animation timescale based on a maximum time to maximum distance ratio(and minspeed ratio ?)
				- if timescale is small enough, just uses.set() ~*/

		scaleTween<T extends Anim>(tween: T, {durScaling: scalingDuration, ...vars}: XTweenVars, fromVal?: number): T {
			const duration = tween.duration();
			const {scaleTarget, maxDelta, minDur = 0} = scalingDuration ?? {};
			if (typeof scaleTarget === "string" && typeof maxDelta === "number") {
				const startVal = U.get(this.elem, scaleTarget);
				const endVal = fromVal ?? vars[scaleTarget];
				if (typeof startVal === "number" && typeof duration === "number") {
					const delta = endVal - startVal;
					let scaleFactor = delta / maxDelta;
					if (minDur > 0 && (duration * scaleFactor) < minDur) {
						scaleFactor = duration / minDur;
					}
					tween.timeScale(scaleFactor);
				}
			}
			return tween;
		}
		to({durScaling: scalingDuration, ...vars}: XTweenVars): gsap.core.Tween {
			const tween = gsap.to(this.elem, vars);
			if (vars.id) {
				this.tweens[vars.id] = tween;
			}
			if (scalingDuration) {
				this.scaleTween(tween, {durScaling: scalingDuration, ...vars});
			}
			return tween;
		}
		from({durScaling: scalingDuration, ...vars}: XTweenVars): gsap.core.Tween {
			const tween = gsap.from(this.elem, vars);
			if (vars.id) {
				this.tweens[vars.id] = tween;
			}
			if (scalingDuration && scalingDuration.scaleTarget) {
				const fromVal = vars[scalingDuration.scaleTarget];
				if (typeof U.get(this.elem, scalingDuration.scaleTarget) === "number") {
					this.scaleTween(tween, {
						durScaling: scalingDuration,
						...vars,
						[scalingDuration.scaleTarget]: U.get(this.elem, scalingDuration.scaleTarget)
					}, fromVal);
				}
			}
			return tween;
		}
		fromTo(fromVars: gsap.TweenVars, {durScaling: scalingDuration, ...toVars}: XTweenVars): gsap.core.Tween {
			const tween = gsap.fromTo(this.elem, fromVars, toVars);
			if (toVars.id) {
				this.tweens[toVars.id] = tween;
			}
			if (scalingDuration && scalingDuration.scaleTarget) {
				const fromVal = fromVars[scalingDuration.scaleTarget] ?? U.get(this.elem, scalingDuration.scaleTarget);
				this.scaleTween(tween, {durScaling: scalingDuration, ...toVars}, typeof fromVal === "number" ? fromVal : U.pInt(U.get(this.elem, scalingDuration.scaleTarget)));
			}
			return tween;
		}
		tweenTimeScale(tweenID: keyof typeof this.tweens, timeScale = 1, duration = 1) {
			const tween = this.tweens[tweenID];
			return gsap.to(tween, {
				timeScale,
				duration,
				ease: "sine.inOut"
			});
		}
	};
}
// #endregion ▮▮▮▮[Mixins]▮▮▮▮

export default class XItem<Options extends XOptions.Item = XOptions.Item> extends BaseXItem<Options> {

	// #region ▮▮▮▮▮▮▮[Subclass Static Overrides] Methods Subclasses will Have to Override ▮▮▮▮▮▮▮ ~

	static REGISTRY: Map<string, XItem> = new Map();
	// #endregion ▮▮▮▮[Subclass Static Overrides]▮▮▮▮
	// // #region ▮▮▮▮▮▮▮[Static Registration] Registration & Retrieval of XItem Instances ▮▮▮▮▮▮▮ ~
	protected static get Structor() { return this.constructor as typeof XItem }

	static Register(xItem: XItem) {
		this.REGISTRY.set(xItem.id, xItem);
	}
	static Unregister(xItem: string | XItem | HTMLElement) {
		this.REGISTRY.delete(typeof xItem === "string" ? xItem : xItem.id);
	}
	static GetAll() {
		return Array.from(this.REGISTRY.values());
	}
	static GetFromElement(elem: HTMLElement): XItem | false {
		return this.REGISTRY.get(elem.id) || false;
	}
	// #endregion ▮▮▮▮[Static Registration]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Mouse Tracking] Centralized Listener for Track Mouse Cursor ▮▮▮▮▮▮▮ ~
	static #lastMouseUpdate: number = Date.now();
	static #mousePos: { x: number, y: number } = {x: 0, y: 0};
	static LogMouseMove(x: number, y: number) {
		if (Date.now() - this.#lastMouseUpdate > 1000) {
			this.#lastMouseUpdate = Date.now();
			this.#mousePos = {x, y};
		}
		this.GetAll()
			.filter((xItem) => xItem instanceof XGroup && xItem.xParent === XROOT.XROOT)
			.forEach((xGroup) => {
				// https://greensock.com/forums/topic/17899-what-is-the-cleanest-way-to-tween-a-var-depending-on-the-cursor-position/
				// https://greensock.com/forums/topic/18717-update-tween-based-on-mouse-position/
			});
	}
	// #endregion ▮▮▮▮[Mouse Tracking]▮▮▮▮

	// #region ████████ CONSTRUCTOR & Essential Fields ████████ ~
	constructor(options: Partial<Options> = {}) {
		DB.display(`[#${options.id ?? "???"}] Constructing START`);
		super(options);
		DB.log(`[#${options.id ?? this.constructor.name}] END Constructing`);
	}
	// #endregion ▄▄▄▄▄ CONSTRUCTOR ▄▄▄▄▄

	private _tickers: Set<() => void> = new Set();
	addTicker(func: () => void): void {
		this._tickers.add(func);
		gsap.ticker.add(func);
	}
	removeTicker(func: () => void): void {
		this._tickers.delete(func);
		gsap.ticker.remove(func);
	}

	kill() {
		this._tickers.forEach((func) => gsap.ticker.remove(func));
		this._tickers.clear();
		(this.constructor as typeof BaseXItem).Unregister(this);
	}

}

const canParentXItem = CanParent(BaseXItem);
export class XROOT extends canParentXItem {
	static async Make(): Promise<XROOT> {
		XROOT.XROOT?.kill();
		XROOT.#XROOT = new XROOT();
		await XROOT.#XROOT.render();
		return XROOT.#XROOT;
	}
	static override REGISTRY: Map<string, XROOT> = new Map();
	static override get defaultOptions() {
		return {
			...XItem.defaultOptions,
			classes: ["XROOT"]
		};
	}

	static #XROOT: XROOT;
	static get XROOT() { return XROOT.#XROOT }
	static async InitializeXROOT(): Promise<XROOT> { return XROOT.Make() }
	declare xParent: null;
	constructor() {
		super({id: "XROOT", xParent: null, postRenderVars: {xPercent: 0, yPercent: 0}});
	}
}
// const LISTENERS: Array<[keyof DocumentEventMap, (event: MouseEvent) => void]> = [
// 	["mousemove", (event) => {
// 		XItem.LogMouseMove(event.pageX, event.pageY);
// 	}]
// ];
