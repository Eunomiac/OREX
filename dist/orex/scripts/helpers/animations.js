
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
gsap } from "./bundler.js";
const XEffects = {
    fadeDieText: {
        name: "fadeDieText",
        effect: (targets, config) => {
            return gsap.to(targets, {
                color: "transparent",
                outlineWidth: 0,
                outlineOffset: 0,
                autoAlpha: 0.5,
                duration: config.duration,
                ease: config.ease
            });
        },
        defaults: {
            duration: 0.15,
            ease: "power2.out"
        },
        extendTimeline: true
    },
    pulseRolledDie: {
        name: "pulseRolledDie",
        effect: (targets, config) => {
            return gsap.timeline({ stagger: 0.15 })
                .to(targets, {
                color: "black",
                outlineWidth: 0,
                outlineOffset: 0,
                autoAlpha: 0.5,
                duration: config.duration * (1 / 5),
                ease: "power2.out"
            })
                .to(targets, {
                scale: 1.5,
                duration: config.duration * (1 / 5),
                ease: "back.inOut",
                repeat: 1,
                yoyo: true,
                yoyoEase: true
            })
                .to(targets, {
                autoAlpha: 1,
                duration: config.duration * (2 / 5),
                ease: config.ease
            });
        },
        defaults: {
            duration: 2,
            ease: "back.out"
        },
        extendTimeline: true
    }
};
export default () => {
    Object.entries(XEffects).forEach(([, effect]) => gsap.registerEffect(effect));
};
// export default XEffects;