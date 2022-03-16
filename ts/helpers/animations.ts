// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
	gsap,
	Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools, // GreenSock Animation Platform
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
	XElem,
	XItem,
	XGroup, XPool, XRoll,
	XDie
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "./bundler.js";
import type {KnownKeys, Concrete} from "./bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

namespace XGSAP {

	export enum Type {
		TO = "TO",
		FROM = "FROM",
		FROMTO = "FROMTO",
		SET = "SET",
		TIMELINE = "TIMELINE"
	}

	export type KnownTweenVars = Concrete<Pick<gsap.TweenVars, KnownKeys<gsap.TweenVars>>>;
	export interface Vars extends Partial<KnownTweenVars> {
		xGroup: XGroup,
		type?: XGSAP.Type
	}
	export interface AnimVars extends gsap.TweenVars {
		type: XGSAP.Type,
		timeStamp?: gsap.Position
	}
	export type AnimVarsFunc = (config: XGSAP.Vars) => XGSAP.AnimVars[];
	export type AnimVarsDict = Record<string, XGSAP.AnimVarsFunc>;
}

const XAnimVars: XGSAP.AnimVarsDict = {
	rotateXPool: (config: XGSAP.Vars) => {
		config = {
			rotation: "+=360",
			duration: 10,
			...config
		};
		return [
			{
				type: XGSAP.Type.TO,
				rotation: config.rotation,
				duration: config.duration,
				repeat: -1,
				ease: "none",
				callbackScope: config.xGroup,
				onUpdate() {
					this.xItems.forEach((xItem: XItem) => {
						if (xItem.xParent?.isInitialized) {
							xItem.set({rotation: -1 * xItem.xParent.global.rotation});
						}
					});
				}
			}
		];
	},
	fadeDieText: (config: XGSAP.Vars) => {
		config = {
			duration: 0.15,
			ease: "power2.out",
			...config
		};
		return [
			{
				type: XGSAP.Type.TO,
				color: "transparent",
				outlineWidth: 0,
				autoAlpha: 0,
				duration: config.duration,
				ease: config.ease
			}
		];
	},
	pulseRolledDie: (config: XGSAP.Vars) => {
		config = {
			stagger: 0.15,
			duration: 1,
			...config
		};
		return [
			{
				type: XGSAP.Type.TIMELINE,
				stagger: config.stagger
			},
			{
				type: XGSAP.Type.TO,
				timeStamp: ">",
				color: "black",
				outlineWidth: 0,
				outlineOffset: 0,
				autoAlpha: 0.5,
				duration: typeof config.duration === "number" ? config.duration * (1 / 5) : config.duration,
				ease: "power2.out"
			},
			{
				type: XGSAP.Type.TO,
				timeStamp: ">",
				scale: 1.5,
				duration: typeof config.duration === "number" ? config.duration * (1 / 5) : config.duration,
				ease: "back.inOut",
				repeat: 1,
				yoyo: true,
				yoyoEase: true
			},
			{
				type: XGSAP.Type.TO,
				timeStamp: ">",
				autoAlpha: 1,
				duration: typeof config.duration === "number" ? config.duration * (1 / 5) : config.duration,
				ease: config.ease
			}
		];
	}
};

export default XAnimVars;
