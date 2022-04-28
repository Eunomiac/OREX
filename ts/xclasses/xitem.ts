// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ====== GreenSock Animation ====== ~
	gsap,
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U, DB,
	XGroup, XPool, XRoll,
	XDie, XMod
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
} from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

const LISTENERS: Array<[keyof DocumentEventMap, (event: MouseEvent) => void]> = [
	["mousemove", (event) => {
		XROOT.LogMouseMove(event.pageX, event.pageY);
	}]
];

class XBaseItem extends Application implements DOMRenderer, Tweenable {
	// #region ▮▮▮▮▮▮▮[Virtual Properties] Fields & Methods Subclasses Will Have to Override ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Base> {

		const defaultXOptions: Required<XOptions.Base> = {
			id: "XBASE_ITEM",
			classes: [],
			template: U.getTemplatePath("xitem"),
			isFreezingRotate: false,
			vars: {
				xPercent: -50,
				yPercent: -50,
				x: 0,
				y: 0,
				opacity: 0,
				rotation: 0,
				scale: 1,
				transformOrigin: "50% 50%"
			}
		};
		return U.objMerge(
			{
				...super.defaultOptions,
				popOut: false
			},
			defaultXOptions
		);
	}
	static REGISTRY: Map<string, XBaseItem> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Base>;
	xParent: XParent | null; //~ null only in the single case of the top XItem, XROOT.XROOT
	// #endregion ▮▮▮▮[Virtual Properties]▮▮▮▮

	// #region ▮▮▮▮▮▮▮[Static Registration] Registration & Retrieval of XItem Instances ▮▮▮▮▮▮▮ ~
	static Register(xItem: XBaseItem) { this.REGISTRY.set(xItem.id, xItem) }
	static Unregister(xItem: string | XBaseItem | HTMLElement) { this.REGISTRY.delete(typeof xItem === "string" ? xItem : xItem.id) }

	static get All() { return Array.from(this.REGISTRY.values()) }
	static GetFromElement(elem: HTMLElement) { return this.REGISTRY.get(elem.id) }
	// #endregion ▮▮▮▮[Static Registration]▮▮▮▮

	// #region ████████ CONSTRUCTOR & Essential Fields ████████ ~
	constructor(xParent: XParent | null, xOptions: Partial<XOptions.Base> = {}) {
		xOptions.id ??= "X";
		if (xParent) {
			xOptions.id = U.getUID(`${xParent.id}-${xOptions.id}`);
		}
		DB.display(`[#${xOptions.id}] Constructing START`);
		super(xOptions);
		if (this instanceof XROOT) {
			this.xParent = null;
		} else {
			this.xParent = xParent ?? XROOT.XROOT;
		}
		this.isFreezingRotate = this.options.isFreezingRotate ?? false;
		DB.log(`[#${this.id}] END Constructing`);
	}
	// #endregion ▄▄▄▄▄ CONSTRUCTOR ▄▄▄▄▄

	get elem() { return this.element[0] }
	get elem$() { return $(this.elem) }

	// #region ████████ Positioning: Positioning DOM Element in Local and Global (XROOT) Space ████████ ~
	// #region ░░░░░░░ Local Space ░░░░░░░ ~
	get x() { return U.pInt(this.rendered ? U.get(this.elem, "x", "px") : this.vars.x) }
	get y() { return U.pInt(this.rendered ? U.get(this.elem, "y", "px") : this.vars.y) }
	get pos(): Point { return {x: this.x, y: this.y} }

	get height() { return U.pInt(this.rendered ? U.get(this.elem, "height", "px") : this.vars.height) }
	get width() { return U.pInt(this.rendered ? U.get(this.elem, "width", "px") : this.vars.width) }
	get size() { return (this.height + this.width) / 2 }

	get rotation() { return U.cycleAngle(U.pFloat(this.rendered ? U.get(this.elem, "rotation") : this.vars.rotation, 2), [-180, 180]) }
	get scale() { return U.pFloat(this.rendered ? U.get(this.elem, "scale") : this.vars.scale, 2) || 1 }

	get origin() {
		return {
			x: -1 * U.pInt((this.rendered ? U.get(this.elem, "xPercent") : this.vars.xPercent)) * this.width,
			y: -1 * U.pInt((this.rendered ? U.get(this.elem, "yPercent") : this.vars.yPercent)) * this.height
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
				while (xParent?.rendered) {
					totalRotation += xParent.rotation;
					({xParent} = xParent);
				}
				return U.cycleAngle(totalRotation, [-180, 180]);
			},
			get scale() {
				let totalScale = self.scale,
								{xParent} = self;
				while (xParent?.rendered) {
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
	// #region ████████ Rendering: Initial Rendering to DOM ████████ ~
	get vars() { return this.options.vars }

	get isVisible() { return U.get(this.elem, "opacity") > 0 }

	_renderPromise?: Promise<this>;
	override async render(): Promise<this> {
		return (this._renderPromise = this._renderPromise
			?? this._render(true, {})
				.then(() => {
					if (this.xParent) {
						$(this.elem).appendTo(this.xParent.elem);
					}
					this.set(this.vars);
					return this;
				}));
	}
	// #endregion ▄▄▄▄▄ Rendering ▄▄▄▄▄

	// #region ████████ Tickers: Management of gsap.ticker Functions ████████ ~
	private _tickers: Set<() => void> = new Set();
	addTicker(func: () => void): void {
		this._tickers.add(func);
		gsap.ticker.add(func);
	}
	removeTicker(func: () => void): void {
		this._tickers.delete(func);
		gsap.ticker.remove(func);
	}
	// #endregion ▄▄▄▄▄ Tickers ▄▄▄▄▄

	// #region ████████ GSAP: GSAP Animation Method Wrappers ████████ ~
	tweens: Record<string, Anim> = {};
	isFreezingRotate = false;
	/*~ Figure out a way to have to / from / fromTo methods on all XItems that:
			- will adjust animation timescale based on a maximum time to maximum distance ratio(and minspeed ratio ?)
			- if timescale is small enough, just uses.set() ~*/


	tweenTimeScale(tweenID: keyof typeof this.tweens, timeScale = 1, duration = 1) {
		const tween = this.tweens[tweenID];
		return gsap.to(tween, {
			timeScale,
			duration,
			ease: "sine.inOut"
		});
	}
	scaleTween<T extends Anim>(tween: T, vars: XTweenVars, fromVal?: number): T {
		const duration = tween.duration();
		const {target, maxDelta, minDur = 0} = vars.scaling ?? {};
		if (typeof target === "string" && typeof maxDelta === "number") {
			const startVal = U.get(this.elem, target);
			const endVal = fromVal ?? vars[target];
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
	set(vars: gsap.TweenVars): gsap.core.Tween {
		return gsap.set(this.elem, vars);
	}
	to(vars: XTweenVars): gsap.core.Tween {
		const {scaling, ...gsapVars} = vars;
		const tween = gsap.to(this.elem, gsapVars);
		if (vars.id) {
			this.tweens[vars.id] = tween;
		}
		if (vars.scaling) {
			this.scaleTween(tween, vars);
		}
		return tween;
	}
	from(vars: XTweenVars): gsap.core.Tween {
		const {scaling, ...gsapVars} = vars;
		const tween = gsap.from(this.elem, gsapVars);
		if (vars.id) {
			this.tweens[vars.id] = tween;
		}
		if (scaling) {
			const fromVal = vars[scaling.target];
			if (typeof U.get(this.elem, scaling.target) === "number") {
				this.scaleTween(tween, {
					scaling,
					...vars,
					[scaling.target]: U.get(this.elem, scaling.target)
				}, fromVal);
			}
		}
		return tween;
	}
	fromTo(fromVars: gsap.TweenVars, toVars: XTweenVars): gsap.core.Tween {
		const {scaling, ...gsapToVars} = toVars;
		const tween = gsap.fromTo(this.elem, fromVars, toVars);
		if (toVars.id) {
			this.tweens[toVars.id] = tween;
		}
		if (scaling) {
			const fromVal = fromVars[scaling.target] ?? U.get(this.elem, scaling.target);
			this.scaleTween(tween, toVars, typeof fromVal === "number" ? fromVal : U.pInt(U.get(this.elem, scaling.target)));
		}
		return tween;
	}
	// #endregion ▄▄▄▄▄ GSAP ▄▄▄▄▄

	async kill() {
		this._tickers.forEach((func) => gsap.ticker.remove(func));
		this._tickers.clear();
		this.xParent?.unregisterXKid(this as XKid);
		if (this.rendered) {
			gsap.killTweensOf(this.elem);
			this.elem$.remove();
		}
	}

	override getData() {
		const context = super.getData();
		Object.assign(context, {
			id: this.id,
			classes: this.options.classes.join(" ")
		});
		return context;
	}
}

export class XBaseContainer extends XBaseItem implements XParent {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override REGISTRY: Map<string, XBaseContainer> = new Map();
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	#xKids: Set<XKid & XItem> = new Set();
	registerXKid(xKid: XKid & XItem) { this.#xKids.add(xKid) }
	unregisterXKid(xKid: XKid & XItem) { this.#xKids.delete(xKid) }

	get hasXKids() { return this.#xKids.size > 0 }
	get xKids(): XKid[] { return Array.from(this.#xKids) }
	getXKids<X extends XKid>(classRef: ConstructorOf<X>, isGettingAll = false): X[] {
		const xKids: X[] = Array.from(this.xKids.values())
			.flat()
			.filter(U.FILTERS.IsInstance(classRef)) as X[];
		if (isGettingAll) {
			xKids.push(...xKids
				.map((xKid) => (xKid instanceof XGroup ? xKid.getXKids(classRef, true) : []))
				.flat());
		}
		return xKids;
	}

	// #region ████████ Parenting: Adopting & Managing Child XItems ████████ ~
	adoptElem(elem: XBaseItem|HTMLElement|JQuery<HTMLElement>) {
		if (!this.rendered) { return }
		let elem$: JQuery<HTMLElement>;
		if (elem instanceof XBaseItem) {
			if (!elem.rendered) { return }
			({elem$} = elem);
		} else if (elem instanceof HTMLElement) {
			elem$ = $(elem);
		} else {
			elem$ = elem;
		}
		elem$.appendTo(this.elem);
	}

	async adopt<T extends XItem>(children: T): Promise<T & XKid>
	async adopt<T extends XItem>(children: T[]): Promise<Array<T & XKid>>
	async adopt<T extends XItem>(children: T | T[]): Promise<T & XKid | Array<T & XKid>> {
		const promises = ([children].flat() as T[])
			.map(async (child) => {
				if (!this.#xKids.has(child)) {
					await child.xParent?.disown(child as XKid);
					child.xParent = this;
					this.registerXKid(child as T & XKid);
				}
				if (!this.rendered) { return child }
				if (child.rendered) {
					child.set({
						...this.getLocalPosData(child),
						...child.isFreezingRotate
							? {rotation: -1 * this.global.rotation}
							: {}
					});
				} else {
					await child.render();
				}
				this.adoptElem(child);
				return child;
			});
		if (promises.length === 1) {
			return promises[0];
		}
		return Promise.all(promises);
	}
	async disown(children: XKid & XItem | Array<XKid & XItem>): Promise<void> {
		[children].flat().forEach((xKid) => this.unregisterXKid(xKid));
	}

	override async kill() {
		this.xKids.forEach((xKid) => xKid.kill());
		super.kill();
	}

	override async render(): Promise<this> {
		if (this._renderPromise) { return this._renderPromise }
		const superPromise = super.render();
		this._renderPromise = superPromise
			.then(async () => {
				await this.adopt(this.xKids as Array<XKid & XItem>);
				return this;
			});
		return this._renderPromise;
	}
	// #endregion ▄▄▄▄▄ Rendering ▄▄▄▄▄
	// #endregion ▄▄▄▄▄ Parenting ▄▄▄▄▄
}

// #region 🟩🟩🟩 XROOT: Base Container for All XItems - Only XItem that Doesn't Need an XParent 🟩🟩🟩 ~
export class XROOT extends XBaseContainer {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.ROOT> {

		const defaultXOptions: Required<XOptions.ROOT> = {
			id: "XROOT",
			classes: ["XROOT"],
			template: U.getTemplatePath("xroot"),
			isFreezingRotate: false,
			vars: {
				xPercent: 0,
				yPercent: 0,
				opacity: 1
			}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XROOT> = new Map();
	declare options: ApplicationOptions & Required<XOptions.ROOT>;
	override xParent = null;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor() {
		super(null, {});
	}

	static #XROOT: XROOT;
	static get XROOT() { return XROOT.#XROOT }
	static async InitializeXROOT() {
		XROOT.XROOT?.kill();
		XROOT.#XROOT = new XROOT();
		await XROOT.#XROOT.render();
		return XROOT.#XROOT;
	}
	// #region ▮▮▮▮▮▮▮[Mouse Tracking] Centralized Listener for Track Mouse Cursor ▮▮▮▮▮▮▮ ~
	static #lastMouseUpdate: number = Date.now();
	static #mousePos: { x: number, y: number } = {x: 0, y: 0};
	static LogMouseMove(x: number, y: number) {
		if (Date.now() - this.#lastMouseUpdate > 1000) {
			this.#lastMouseUpdate = Date.now();
			this.#mousePos = {x, y};
		}
		this.All
			.filter((xItem) => xItem instanceof XGroup && xItem.xParent === XROOT.XROOT)
			.forEach((xGroup) => {
				// https://greensock.com/forums/topic/17899-what-is-the-cleanest-way-to-tween-a-var-depending-on-the-cursor-position/
				// https://greensock.com/forums/topic/18717-update-tween-based-on-mouse-position/
			});
	}
	// #endregion ▮▮▮▮[Mouse Tracking]▮▮▮▮
}
// #endregion 🟩🟩🟩 XROOT 🟩🟩🟩
export default class XItem extends XBaseItem {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Item> {

		const defaultXOptions: Required<XOptions.Item> = {
			id: "XITEM",
			classes: ["x-item"],
			template: U.getTemplatePath("xitem"),
			isFreezingRotate: false,
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}

	static override REGISTRY: Map<string, XItem> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Item>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XParent, xOptions: XOptions.Item) {
		super (xParent, xOptions);
	}
}
