
// ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮
import { 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
C, U, DB, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XBaseContainer, XOrbitType, XROOT, XDie, XMod
 } from "../helpers/bundler.js";
// 🟩🟩🟩 XGroup: Any XItem That Can Contain Child XItems 🟩🟩🟩
export default class XGroup extends XBaseContainer {
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XGROUP"),
            classes: ["x-group"],
            template: U.getTemplatePath("xitem"),
            xParent: XROOT.XROOT,
            isFreezingRotate: false,
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
}
// 🟪🟪🟪 XArm: Helper XItem Used to Position Rotating XItems in XOrbits 🟪🟪🟪
const MAXWIDTHTWEENDURATION = 3;
const MAXANGLETWEENDURATION = 6;
const MINWIDTHTOTWEEN = 10;
const MINANGLETOTWEEN = 5;
const ARMFADEINDURATION = 3;
export class XArm extends XGroup {
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XARM"),
            classes: ["x-arm"],
            xParent: XROOT.XROOT,
            template: U.getTemplatePath("xarm"),
            isFreezingRotate: false,
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    // get armNum() { return this.xParent.getArmNumber(this) }
    #isFadingIn = false;
    tweenFadeIn(delay = 0) {
        if (this.#isFadingIn) {
            return;
        }
        this.#isFadingIn = true;
        const self = this;
        gsap.timeline({ delay })
            .fromTo(this.elem, {
            width: this.homeWidth * 10,
            rotation: this.homeAngle - 50
        }, {
            width: this.homeWidth,
            rotation: this.homeAngle,
            duration: ARMFADEINDURATION,
            ease: "bounce",
            onComplete() {
                self.#isFadingIn = false;
                self.tweenToHomeWidth();
                self.tweenToHomeAngle();
            }
        }, 0)
            .fromTo(this.heldItem.elem, {
            opacity: 0,
            scale: 5,
            rotation: -1 * this.global.rotation
        }, {
            opacity: 1,
            scale: 1,
            duration: ARMFADEINDURATION / 1.5,
            ease: "power2"
        }, 0);
    }
    #toHomeWidthTween;
    get toHomeWidthTween() {
        const self = this;
        return (this.#toHomeWidthTween = this.#toHomeWidthTween
            ?? gsap.timeline({ paused: true })
                .to(this.elem, {
                width() { return this.homeWidth; },
                duration: MAXWIDTHTWEENDURATION,
                ease: "power2",
                onComplete() { self.tweenToHomeWidth(); }
            }));
    }
    tweenToHomeWidth() {
        if (this.#isFadingIn) {
            return;
        }
        this.toHomeWidthTween.invalidate();
        this.toHomeWidthTween.restart();
        this.toHomeWidthTween.pause();
        const deltaWidth = Math.abs(this.homeWidth - this.width);
        if (deltaWidth <= MINWIDTHTOTWEEN) {
            this.set({ width: this.homeWidth });
        }
        const timeScale = 1 / gsap.utils.clamp(0.25, 1, deltaWidth / this.homeWidth);
        this.toHomeWidthTween.timeScale(timeScale);
        this.toHomeWidthTween.play();
    }
    #toHomeAngleTween;
    get toHomeAngleTween() {
        const self = this;
        return (this.#toHomeAngleTween = this.#toHomeAngleTween
            ?? gsap.timeline({ paused: true })
                .to(this.elem, {
                rotation() { return this.homeAngle; },
                duration: MAXANGLETWEENDURATION,
                ease: "sine.inOut",
                onComplete() { self.tweenToHomeAngle(); }
            }));
    }
    tweenToHomeAngle() {
        if (this.#isFadingIn) {
            return;
        }
        this.toHomeAngleTween.invalidate();
        this.toHomeAngleTween.restart();
        this.toHomeAngleTween.pause();
        const deltaAngle = Math.abs(this.homeAngle - this.rotation);
        if (deltaAngle <= MINANGLETOTWEEN) {
            this.set({ rotation: this.homeAngle });
        }
        const timeScale = 1 / gsap.utils.clamp(0.05, 1, deltaAngle / 360);
        this.toHomeAngleTween.timeScale(timeScale);
        this.toHomeAngleTween.play();
    }
    async render() {
        if (this._renderPromise) {
            return this._renderPromise;
        }
        this.options.vars.right = this.xParent.width / 2;
        this.options.vars.top = this.xParent.height / 2;
        const superPromise = super.render();
        this._renderPromise = superPromise
            .then(() => {
            if (this.heldItem.isVisible) {
                this.snapToHeldItem();
                this.tweenToHomeWidth();
                this.tweenToHomeAngle();
            }
            else {
                this.tweenFadeIn();
            }
            return this;
        });
        return this._renderPromise;
    }
    #heldItem;
    get heldItem() { return this.#heldItem; }
    get heldItemSize() {
        return this.heldItem.size;
    }
    constructor(xParent, xOptions) {
        xOptions.xParent = xParent;
        xOptions.vars ??= {};
        xOptions.vars.transformOrigin = "right";
        xOptions.vars.height = 0;
        xOptions.vars.width = xOptions.xParent.orbitRadius;
        xOptions.vars.rotation = 0;
        delete xOptions.vars.left;
        super(xOptions);
        this.#heldItem = xOptions.heldItem;
        this.adopt(this.heldItem);
    }
    get homeWidth() { return this.xParent.orbitRadius; }
    get homeAngle() { return this.xParent.getArmAngle(this) ?? gsap.utils.random(-180, 180); }
    get positionOfHeldItem() {
        return MotionPathPlugin.getRelativePosition(this.xParent.elem, this.heldItem.elem, [0.5, 0.5], [0.5, 0.5]);
    }
    get distanceToHeldItem() {
        return U.getDistance({ x: 0, y: 0 }, this.positionOfHeldItem);
    }
    get angleToHeldItem() {
        return U.getAngleDelta(U.cycleAngle(this.global.rotation - 180, [-180, 180]), U.getAngle({ x: 0, y: 0 }, this.positionOfHeldItem, undefined, [-180, 180]), [-180, 180]);
    }
    snapToHeldItem() {
        const heldItemSetParams = { x: 0, y: 0 };
        if (this.heldItem.isFreezingRotate) {
            heldItemSetParams.rotation = -1 * this.global.rotation;
        }
        this.heldItem.set(heldItemSetParams);
        this.set({
            width: this.distanceToHeldItem,
            rotation: this.rotation + this.angleToHeldItem
        });
    }
}
// 🟥🟥🟥 XOrbit: A Single Orbital Containing XItems & Parented to an XPool 🟥🟥🟥
export class XOrbit extends XGroup {
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XORBIT"),
            name: XOrbitType.Main,
            classes: ["x-orbit"],
            template: U.getTemplatePath("xitem"),
            xParent: XROOT.XROOT,
            isFreezingRotate: false,
            radiusRatio: 1,
            rotationScaling: 1,
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    #radiusRatio;
    get radiusRatio() { return this.#radiusRatio; }
    set radiusRatio(radiusRatio) {
        this.#radiusRatio = radiusRatio;
        if (this.rendered) {
            this.updateArms();
        }
    }
    #rotationScaling = C.xGroupOrbitalDefaults[XOrbitType.Main].rotationScaling;
    #rotationAngle = "+=360";
    #rotationDuration = 10 * C.xGroupOrbitalDefaults[XOrbitType.Main].radiusRatio * C.xGroupOrbitalDefaults[XOrbitType.Main].rotationScaling;
    #orbitType;
    get orbitType() { return this.#orbitType; }
    get arms$() { return $(`#${this.id} > .x-arm`); }
    get arms() { return this.xKids; }
    get xItems() { return this.arms.map((xArm) => xArm.heldItem); }
    get xTerms() { return this.xItems.filter((xItem) => xItem instanceof XDie || xItem instanceof XMod); }
    get orbitRadius() { return this.radiusRatio * 0.5 * (this.xParent?.width ?? 0); }
    #armAngles;
    get armAngles() {
        if (!this.arms?.length) {
            return new Map();
        }
        return this.#armAngles ?? this.updateArmAngles();
    }
    updateArmAngles() {
        const totalArmWeight = this.arms.map((arm) => arm.heldItemSize).reduce((tot, val) => tot + val, 0);
        const anglePerWeight = 360 / totalArmWeight;
        this.#armAngles = new Map();
        let usedWeight = 0;
        this.arms.forEach((arm) => {
            usedWeight += arm.heldItemSize;
            this.#armAngles.set(arm, (usedWeight - (0.5 * arm.heldItemSize)) * anglePerWeight);
        });
        return this.#armAngles;
    }
    constructor(xParent, xOptions) {
        xOptions.name ??= XOrbitType.Main;
        xOptions.id ??= xOptions.name;
        xOptions.xParent = xParent;
        xOptions.radiusRatio ??= C.xGroupOrbitalDefaults[xOptions.name].radiusRatio;
        xOptions.rotationScaling ??= C.xGroupOrbitalDefaults[xOptions.name].rotationScaling;
        xOptions.vars = {
            height: xOptions.xParent.height,
            width: xOptions.xParent.width,
            left: 0.5 * xOptions.xParent.width,
            top: 0.5 * xOptions.xParent.height,
            ...xOptions.vars
        };
        super(xOptions);
        this.#orbitType = xOptions.name;
        this.#radiusRatio = xOptions.radiusRatio;
        this.#rotationScaling = Math.abs(xOptions.rotationScaling);
        this.#rotationAngle = xOptions.rotationScaling > 0 ? "+=360" : "-=360";
        this.#rotationDuration = 10 * this.#radiusRatio * this.#rotationScaling;
    }
    startRotating(duration = 10) {
        DB.title("STARTING ROTATING");
        const self = this;
        this.tweens.rotationTween = this.to({
            id: "rotationTween",
            rotation: this.#rotationAngle,
            duration,
            repeat: -1,
            ease: "none",
            onUpdate() {
                self.xTerms.forEach((xItem) => {
                    if (xItem.options.isFreezingRotate && xItem.xParent instanceof XArm) {
                        xItem.set({ rotation: -1 * xItem.xParent.global.rotation });
                    }
                });
            }
        });
    }
    updateArmsThrottle;
    pauseRotating() {
        this.tweens.rotationTween?.pause();
    }
    playRotating() {
        this.tweens.rotationTween?.play();
    }
    getArmAngle(xArm) {
        if (!this.armAngles.has(xArm)) {
            this.updateArmAngles();
        }
        return this.armAngles.get(xArm);
    }
    fadeInArms() {
        this.updateArmAngles();
        let armNum = 0;
        for (const xArm of this.armAngles.keys()) {
            xArm.tweenFadeIn(armNum * 0.5);
            armNum++;
        }
    }
    updateArms() {
        this.updateArmAngles();
        if (this.rendered) {
            this.arms.forEach((xArm) => {
                xArm.tweenToHomeWidth();
                xArm.tweenToHomeAngle();
            });
        }
    }
    async render() {
        if (this._renderPromise) {
            return this._renderPromise;
        }
        const superPromise = super.render();
        this._renderPromise = superPromise
            .then(async () => {
            this.startRotating();
            this.updateArms();
            return this;
        });
        return this._renderPromise;
    }
    async adopt(xItem) {
        const promises = [xItem].flat()
            .map((heldItem) => {
            const xArm = new XArm(this, { heldItem });
            return super.adopt(xArm).then(() => heldItem);
        });
        return (promises.length === 1 ? promises[0] : Promise.all(promises))
            .then((result) => {
            this.updateArms();
            return result;
        });
    }
}
// 🟥🟥🟥 XPool: An XGroup Containing Drag-&-Droppable XTerms Contained in XOrbits 🟥🟥🟥
export class XPool extends XGroup {
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XPOOL"),
            classes: ["x-pool"],
            template: U.getTemplatePath("xitem"),
            xParent: XROOT.XROOT,
            isFreezingRotate: false,
            size: 200,
            orbitals: {
                [XOrbitType.Main]: C.xGroupOrbitalDefaults[XOrbitType.Main]
            },
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    #orbitals = new Map();
    #orbitalSpecs = new Map();
    get orbitals() { return this.#orbitals; }
    get xOrbits() { return Array.from(this.orbitals.values()); }
    constructor(xOptions) {
        super(xOptions);
        for (const [orbitName, orbitSpecs] of Object.entries(this.options.orbitals)) {
            this.#orbitalSpecs.set(orbitName, orbitSpecs);
        }
    }
    async adopt(xItem, xOrbitType) {
        const promises = [xItem].flat()
            .map(async (child) => {
            if (child instanceof XOrbit) {
                return super.adopt(child);
            }
            else if (xOrbitType) {
                let thisOrbit = this.#orbitals.get(xOrbitType);
                if (!thisOrbit) {
                    const orbitalSpecs = this.#orbitalSpecs.get(xOrbitType);
                    if (orbitalSpecs) {
                        thisOrbit = new XOrbit(this, orbitalSpecs);
                        this.#orbitals.set(xOrbitType, thisOrbit);
                        await this.adopt(thisOrbit);
                    }
                }
                if (thisOrbit) {
                    return thisOrbit.adopt(child);
                }
            }
            throw new Error(`Bad Orbit Type: ${xOrbitType}`);
        });
        return (promises.length === 1 ? promises[0] : Promise.all(promises));
    }
    pauseRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.pauseRotating()); }
    playRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.playRotating()); }
}
// 🟥🟥🟥 XRoll: An XPool That Can Be Rolled, Its Child XTerms Evaluated Into a Roll Result 🟥🟥🟥
export class XRoll extends XPool {
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XROLL"),
            classes: ["x-roll"],
            template: U.getTemplatePath("xitem"),
            xParent: XROOT.XROOT,
            isFreezingRotate: false,
            ...C.xRollStyles.defaults,
            orbitals: {
                [XOrbitType.Main]: C.xGroupOrbitalDefaults[XOrbitType.Main]
            },
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    #hasRolled = false;
    get hasRolled() { return this.#hasRolled; }
    get diceRolls() {
        if (this.hasRolled) {
            return this.getXKids(XDie, true).map((xDie) => (xDie).value);
        }
        return [];
    }
    get dice$() { return $(`#${this.id} .x-die`); }
    get diceVals$() { return $(`#${this.id} .x-die .die-val`); }
    constructor(xOptions) {
        super(xOptions);
        this.options.vars = {
            ...this.options.vars,
            ...{
                "height": this.options.size,
                "width": this.options.size,
                "--bg-color": this.options.color,
                ...this.options.position
            }
        };
    }
    // Rolls all XDie in the XRoll.
    rollDice(isForcingReroll = false, isAnimating = true) {
        if (isForcingReroll || !this.#hasRolled) {
            this.#hasRolled = true;
            const xDice = this.getXKids(XDie, true);
            if (isAnimating) {
                gsap.timeline(({ stagger: 0.1 }))
                    .to(this.diceVals$, {
                    color: "transparent",
                    autoAlpha: 0,
                    duration: 0.15,
                    ease: "power2.out"
                })
                    .call(() => xDice.forEach((xDie) => xDie.roll()))
                    .to(this.diceVals$, {
                    color: "black",
                    autoAlpha: 1
                });
            }
            else {
                xDice.forEach((xDie) => xDie.roll());
            }
        }
    }
    // ████████ Roll Results: Parsing & Analyzing Roll Results ████████
    getValsInOrbit(orbital) {
        return this.orbitals.get(orbital)?.xTerms.map((xTerm) => xTerm.value ?? 0) ?? [];
    }
    get mainVals() { return this.getValsInOrbit(XOrbitType.Main); }
    get sets() {
        const dieVals = this.mainVals.sort();
        const setDice = dieVals.filter((val) => dieVals.filter((v) => v === val).length > 1);
        const setGroups = [];
        while (setDice.length) {
            const dieVal = setDice.pop();
            const groupIndex = setGroups.findIndex(([groupVal]) => groupVal === dieVal);
            if (groupIndex >= 0) {
                setGroups[groupIndex].push(dieVal);
            }
            else {
                setGroups.push([dieVal]);
            }
        }
        return setGroups;
    }
}
// 🟥🟥🟥 XSource: An XPool containing XItems that players can grab and use 🟥🟥🟥
export class XSource extends XPool {
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XROLL"),
            classes: ["x-roll"],
            isFreezingRotate: false,
            template: U.getTemplatePath("xitem"),
            xParent: XROOT.XROOT,
            ...C.xRollStyles.defaults,
            orbitals: {
                [XOrbitType.Main]: C.xGroupOrbitalDefaults[XOrbitType.Main]
            },
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    constructor(xOptions) {
        super(xOptions);
    }
}