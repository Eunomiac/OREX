// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ====== GreenSock Animation ====== ~
	gsap,
	Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	RoughEase,
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮ XItems ▮▮▮▮▮▮▮
	XItem, XROOT, XGroup
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
import type {KnownKeys} from "../helpers/bundler.js";
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
export interface ConfirmedXItem<T extends XItem> extends XItem {
	xParent: XGroup
}
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
	export interface BaseItem extends Partial<ApplicationOptions> {
		id?: string;
		preRenderFuncs?: XInitFunc[];
		postRenderFuncs?: XInitFunc[];
		postRenderVars?:
	}
	export interface BaseTerm {
		type: XTermType
	}

	// ITEMS
	export interface Item extends Partial<BaseItem> {
		id: string
	}
	export interface Group extends Partial<Item> {
		keepID: false
	}
	export interface Pool extends Partial<Group> { }
	export interface Orbit extends Partial<Group> { }
	export interface Arm extends Partial<Group> { }
	export interface Roll extends Partial<Pool> { }
	export interface Source extends Partial<Pool> { }
	export interface Sink extends Partial<Pool> { }

	// TERMS - XItems That Can Themselves be Components of XPools
	export interface Set extends Partial<Pool>, BaseTerm { }
	export interface Die extends Partial<Item>, BaseTerm { }
	export interface Mod extends Partial<Item>, BaseTerm { }
	export interface Ghost extends Mod { }
	export interface Mutator extends Mod { }
	export interface Info extends Mod { }

	// OTHER - Miscellaneous Interactive XItems
	export interface ROOT extends Partial<Item> {
		id: "XROOT",
		keepID: true
	}
	export interface Pad extends Partial<Item> { }
}
// #endregion ___ XOptions ___
// #endregion ▮▮▮▮[TYPE.DS]▮▮▮▮
// #region ====== Basic Types ====== ~

// #endregion ___ Basic Types ___

// #region ====== Options: Schemas for Options Objects ====== ~

// #endregion ___ Options ___

// #region ░░░░░░░[Interfaces]░░░░ Class Interfaces ░░░░░░░ ~


export interface DOMRenderer extends Position {
	id: string;
	renderApp: Application;
	xParent: XGroup | null;

	elem: HTMLElement;
	elem$: JQuery<HTMLElement>;

	pos: Point,
	global: Position
}
export interface Tweenable extends DOMRenderer {
	tweens: Record<string, Anim>;

	set: (vars: gsap.TweenVars) => gsap.core.Tween | boolean
	to: ({ durScaling: scalingDuration, ...vars }: XTweenVars) => gsap.core.Tween,
	from: ({ durScaling: scalingDuration, ...vars }: XTweenVars) => gsap.core.Tween,
	fromTo: (fromVars: gsap.TweenVars, { durScaling: scalingDuration, ...toVars }: XTweenVars) => gsap.core.Tween
}
export interface Renderable extends Pick<Tweenable, "set"> { }
// #endregion ░░░░[Interfaces]░░░░

// #region 🟩🟩🟩 XElem: Contains & Controls a DOM Element Linked to an XItem 🟩🟩🟩
export default class XElem<RenderItem extends XItem> implements DOMRenderer, Renderable {

	// #region ████████ CONSTRUCTOR & Essential Fields ████████ ~
	// readonly renderApp: RenderItem;

	// get id() { return this.renderApp.id }
	// get elem() { return this.renderApp.element[0] }
	// get elem$() { return $(this.elem) }

	// constructor(renderApp: RenderItem) {
	// 	this.renderApp = renderApp;
	// }
	// #endregion ▄▄▄▄▄ CONSTRUCTOR ▄▄▄▄▄

	// adoptXItem(child: XItem): void {
	// 	this.elem$.append(child.elem);
	// }

	// #region ████████ Parenting: Adopting & Managing Child XItems ████████ ~
	get xParent(): XGroup | null { return this.renderApp.xParent }

	adopt(child: XItem, isRetainingPosition = true): void {
		if (this.renderApp instanceof XGroup) {
			child.xParent?.disown(child);
			child.xParent = this.renderApp;
			this.renderApp.registerXKid(child);

			child.set({
				...this.getLocalPosData(child),
				...child.xOptions.isFreezingRotate ? {rotation: -1 * this.global.rotation} : {}
			});

			child.elem$.appendTo(this.elem);
		}
	}
	disown(child: XItem): void {
		if (this.renderApp instanceof XGroup) {
			this.renderApp.unregisterXKid(child);
		}
	}

	tweenTimeScale(tweenID: keyof typeof this.tweens, timeScale = 1, duration = 1) {
		const tween = this.tweens[tweenID];
		return gsap.to(tween, {
			timeScale,
			duration,
			ease: "sine.inOut"
		});
	}
	// #endregion ▄▄▄▄▄ Parenting ▄▄▄▄▄

	// // #region ████████ Positioning: Positioning DOM Element in Local and Global (XROOT) Space ████████ ~
	// // #region ░░░░░░░ Local Space ░░░░░░░ ~
	// get x() { return U.pInt(U.get(this.elem, "x", "px")) }
	// get y() { return U.pInt(U.get(this.elem, "y", "px")) }
	// get pos(): Point { return {x: this.x, y: this.y} }
	// get rotation() { return U.cycleAngle(U.pFloat(U.get(this.elem, "rotation"), 2), [-180, 180]) }
	// get scale() { return U.pFloat(U.get(this.elem, "scale"), 2) || 1 }
	// get origin() {
	// 	return {
	// 		x: -1 * (gsap.getProperty(this.elem, "xPercent") as number / 100) * this.width,
	// 		y: -1 * (gsap.getProperty(this.elem, "yPercent") as number / 100) * this.height
	// 	};
	// }
	// // #endregion ░░░░[Local Space]░░░░
	// // #region ░░░░░░░ Global (XROOT) Space ░░░░░░░ ~
	// get global() {
	// 	const self = this;
	// 	return {
	// 		get pos() {
	// 			return MotionPathPlugin.convertCoordinates(
	// 				self.elem,
	// 				XROOT.XROOT.elem,
	// 				self.origin
	// 			);
	// 		},
	// 		get x() { return this.pos.x },
	// 		get y() { return this.pos.y },
	// 		get height() { return self.height },
	// 		get width() { return self.width },
	// 		get rotation() {
	// 			let totalRotation = self.rotation,
	// 							{xParent} = self;
	// 			while (xParent?.isRendered) {
	// 				totalRotation += xParent.rotation;
	// 				({xParent} = xParent);
	// 			}
	// 			return U.cycleAngle(totalRotation, [-180, 180]);
	// 		},
	// 		get scale() {
	// 			let totalScale = self.scale,
	// 							{xParent} = self;
	// 			while (xParent?.isRendered) {
	// 				totalScale *= xParent.scale;
	// 				({xParent} = xParent);
	// 			}
	// 			return totalScale;
	// 		}
	// 	};
	// }

	// get height() { return U.pInt(U.get(this.elem, "height", "px")) }
	// get width() { return U.pInt(U.get(this.elem, "width", "px")) }
	// get size() { return (this.height + this.width) / 2 }
	// // #endregion ░░░░[Global (XROOT) Space]░░░░
	// // #region ░░░░░░░ Converting from Global Space to Element's Local Space ░░░░░░░ ~
	// getLocalPosData(ofItem: XItem, globalPoint?: Point): Position {
	// 	return {
	// 		...MotionPathPlugin.convertCoordinates(
	// 			XROOT.XROOT.elem,
	// 			this.elem,
	// 			globalPoint ?? ofItem.global.pos
	// 		),
	// 		rotation: U.cycleAngle(ofItem.global.rotation - this.global.rotation, [-180, 180]),
	// 		scale: ofItem.global.scale / this.global.scale,
	// 		height: ofItem.height,
	// 		width: ofItem.width
	// 	};
	// }
	// // #endregion ░░░░[Global to Local]░░░░
	// // #region ░░░░░░░ Relative Positions ░░░░░░░ ~
	// getDistanceTo(posRef: XItem | {x: number, y: number}, globalPoint?: {x: number, y: number}) {
	// 	const {x: tGlobalX, y: tGlobalY} = posRef instanceof XItem ? posRef.global : posRef;
	// 	return U.getDistance({x: tGlobalX, y: tGlobalY}, globalPoint ?? this.global);
	// }
	// getGlobalAngleTo(posRef: XItem | {x: number, y: number}, globalPoint?: {x: number, y: number}) {
	// 	const {x: tGlobalX, y: tGlobalY} = posRef instanceof XItem ? posRef.global : posRef;
	// 	return U.getAngle({x: tGlobalX, y: tGlobalY}, globalPoint ?? this.global);
	// }
	// // #endregion ░░░░[Relative Positions]░░░░
	// // #endregion ▄▄▄▄▄ Positioning ▄▄▄▄▄

	// #region ████████ GSAP: GSAP Animation Method Wrappers ████████ ~
	tweens: Record<string, Anim> = {};
	get isFreezingRotate() { return this.renderApp.isFreezingRotate }
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
	// #endregion ▄▄▄▄▄ GSAP ▄▄▄▄▄
}
// #endregion 🟩🟩🟩 XElem 🟩🟩🟩