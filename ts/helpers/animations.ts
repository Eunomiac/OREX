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
import type {EffectsMap} from "./bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export interface GSAPEffect extends EffectsMap {
	name: string,
	effect: (targets: gsap.TweenTarget, config?: Partial<gsap.AnimationVars>) => gsap.core.Tween | gsap.core.Timeline,
	defaults?: Partial<gsap.AnimationVars>,
	extendTimeline?: boolean
}

const XEffects: Record<string,GSAPEffect> = {
	fadeDieText: {
		name: "fadeDieText",
		effect: (targets: gsap.TweenTarget, config?: Partial<gsap.AnimationVars>) => {
			return gsap.to(
				targets,
				{
					color: "transparent",
					outlineWidth: 0,
					outlineOffset: 0,
					autoAlpha: 0.5,
					duration: config!.duration,
					ease: config!.ease
				}
			);
		},
		defaults: {
			duration: 0.15,
			ease: "power2.out"
		},
		extendTimeline: true
	},
	pulseRolledDie: {
		name: "pulseRolledDie",
		effect: (targets: gsap.TweenTarget, config?: Partial<gsap.AnimationVars>) => {
			return gsap.timeline({stagger: 0.15})
				.to(
					targets,
					{
						color: "black",
						outlineWidth: 0,
						outlineOffset: 0,
						autoAlpha: 0.5,
						duration: config!.duration * (1/5),
						ease: "power2.out"
					}
				)
				.to(
					targets,
					{
						scale: 1.5,
						duration: config!.duration * (1/5),
						ease: "back.inOut",
						repeat: 1,
						yoyo: true,
						yoyoEase: true
					}
				)
				.to(
					targets,
					{
						autoAlpha: 1,
						duration: config!.duration * (2 / 5),
						ease: config!.ease
					}
				);
		},
		defaults: {
			duration: 2,
			ease: "back.out"
		},
		extendTimeline: true
	}
};

export default () => {
	Object.entries(XEffects).forEach(([,effect]) => gsap.registerEffect(effect));
};
// export default XEffects;
