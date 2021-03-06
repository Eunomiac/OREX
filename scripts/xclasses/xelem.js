// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #region ====== GreenSock Animation ====== ~
gsap, MotionPathPlugin, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮ XItems ▮▮▮▮▮▮▮
XItem, XROOT } from "../helpers/bundler.js";
// #endregion ___ Options ___
// #region ░░░░░░░[Interfaces]░░░░ Class Interfaces ░░░░░░░ ~
class Renderable {
    _isRendered = false;
}
class Tweenable {
    _isTweening = false;
}
class TestItem extends Renderable, Tweenable {
    _is;
}
// #endregion ░░░░[Interfaces]░░░░
// #region 🟩🟩🟩 XElem: Contains & Controls a DOM Element Linked to an XItem 🟩🟩🟩
export default class XElem {
    // #region ████████ CONSTRUCTOR & Essential Fields ████████ ~
    renderApp;
    get id() { return this.renderApp.id; }
    get elem() { return this.renderApp.element[0]; }
    get elem$() { return $(this.elem); }
    constructor(renderApp) {
        this.renderApp = renderApp;
    }
    // #endregion ▄▄▄▄▄ CONSTRUCTOR ▄▄▄▄▄
    adoptXItem(child) {
        this.elem$.append(child.elem);
    }
    // #region ████████ Parenting: Adopting & Managing Child XItems ████████ ~
    tweenTimeScale(tweenID, timeScale = 1, duration = 1) {
        const tween = this.tweens[tweenID];
        return gsap.to(tween, {
            timeScale,
            duration,
            ease: "sine.inOut"
        });
    }
    // #endregion ▄▄▄▄▄ Parenting ▄▄▄▄▄
    // #region ████████ Positioning: Positioning DOM Element in Local and Global (XROOT) Space ████████ ~
    // #region ░░░░░░░ Local Space ░░░░░░░ ~
    get x() { return U.pInt(U.get(this.elem, "x", "px")); }
    get y() { return U.pInt(U.get(this.elem, "y", "px")); }
    get pos() { return { x: this.x, y: this.y }; }
    get rotation() { return U.cycleAngle(U.pFloat(U.get(this.elem, "rotation"), 2), [-180, 180]); }
    get scale() { return U.pFloat(U.get(this.elem, "scale"), 2) || 1; }
    get origin() {
        return {
            x: -1 * (gsap.getProperty(this.elem, "xPercent") / 100) * this.width,
            y: -1 * (gsap.getProperty(this.elem, "yPercent") / 100) * this.height
        };
    }
    // #endregion ░░░░[Local Space]░░░░
    // #region ░░░░░░░ Global (XROOT) Space ░░░░░░░ ~
    get global() {
        const self = this;
        return {
            get pos() {
                return MotionPathPlugin.convertCoordinates(self.elem, XROOT.XROOT.elem, self.origin);
            },
            get x() { return this.pos.x; },
            get y() { return this.pos.y; },
            get height() { return self.height; },
            get width() { return self.width; },
            get rotation() {
                let totalRotation = self.rotation, { xParent } = self;
                while (xParent?.isRendered) {
                    totalRotation += xParent.rotation;
                    ({ xParent } = xParent);
                }
                return U.cycleAngle(totalRotation, [-180, 180]);
            },
            get scale() {
                let totalScale = self.scale, { xParent } = self;
                while (xParent?.isRendered) {
                    totalScale *= xParent.scale;
                    ({ xParent } = xParent);
                }
                return totalScale;
            }
        };
    }
    get height() { return U.pInt(U.get(this.elem, "height", "px")); }
    get width() { return U.pInt(U.get(this.elem, "width", "px")); }
    get size() { return (this.height + this.width) / 2; }
    // #endregion ░░░░[Global (XROOT) Space]░░░░
    // #region ░░░░░░░ Converting from Global Space to Element's Local Space ░░░░░░░ ~
    getLocalPosData(ofItem, globalPoint) {
        return {
            ...MotionPathPlugin.convertCoordinates(XROOT.XROOT.elem, this.elem, globalPoint ?? ofItem.global.pos),
            rotation: U.cycleAngle(ofItem.global.rotation - this.global.rotation, [-180, 180]),
            scale: ofItem.global.scale / this.global.scale,
            height: ofItem.height,
            width: ofItem.width
        };
    }
    // #endregion ░░░░[Global to Local]░░░░
    // #region ░░░░░░░ Relative Positions ░░░░░░░ ~
    getDistanceTo(posRef, globalPoint) {
        const { x: tGlobalX, y: tGlobalY } = posRef instanceof XItem ? posRef.global : posRef;
        return U.getDistance({ x: tGlobalX, y: tGlobalY }, globalPoint ?? this.global);
    }
    getGlobalAngleTo(posRef, globalPoint) {
        const { x: tGlobalX, y: tGlobalY } = posRef instanceof XItem ? posRef.global : posRef;
        return U.getAngle({ x: tGlobalX, y: tGlobalY }, globalPoint ?? this.global);
    }
    // #endregion ░░░░[Relative Positions]░░░░
    // #endregion ▄▄▄▄▄ Positioning ▄▄▄▄▄
    // #region ████████ GSAP: GSAP Animation Method Wrappers ████████ ~
    tweens = {};
    get isFreezingRotate() { return this.renderApp.isFreezingRotate; }
    /*~ Figure out a way to have to / from / fromTo methods on all XItems that:
            - will adjust animation timescale based on a maximum time to maximum distance ratio(and minspeed ratio ?)
            - if timescale is small enough, just uses.set() ~*/
    scaleTween(tween, { durScaling: scalingDuration, ...vars }, fromVal) {
        const duration = tween.duration();
        const { scaleTarget, maxDelta, minDur = 0 } = scalingDuration ?? {};
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
    set(vars) {
        if (!this.renderApp.isRendered) {
            this.renderApp.onRenderOptions = {
                ...this.renderApp.onRenderOptions,
                ...vars
            };
            return true;
        }
        return gsap.set(this.elem, vars);
    }
    to({ durScaling: scalingDuration, ...vars }) {
        const tween = gsap.to(this.elem, vars);
        if (vars.id) {
            this.tweens[vars.id] = tween;
        }
        if (scalingDuration) {
            this.scaleTween(tween, { durScaling: scalingDuration, ...vars });
        }
        return tween;
    }
    from({ durScaling: scalingDuration, ...vars }) {
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
    fromTo(fromVars, { durScaling: scalingDuration, ...toVars }) {
        const tween = gsap.fromTo(this.elem, fromVars, toVars);
        if (toVars.id) {
            this.tweens[toVars.id] = tween;
        }
        if (scalingDuration && scalingDuration.scaleTarget) {
            const fromVal = fromVars[scalingDuration.scaleTarget] ?? U.get(this.elem, scalingDuration.scaleTarget);
            this.scaleTween(tween, { durScaling: scalingDuration, ...toVars }, typeof fromVal === "number" ? fromVal : U.pInt(U.get(this.elem, scalingDuration.scaleTarget)));
        }
        return tween;
    }
}
// #endregion 🟩🟩🟩 XElem 🟩🟩🟩