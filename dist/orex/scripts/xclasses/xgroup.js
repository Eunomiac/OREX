
// ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮
import { 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
C, U, DB, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XBaseContainer, XOrbitType, XDie, XMod
 } from "../helpers/bundler.js";
// 🟩🟩🟩 XGroup: Any XItem That Can Contain Child XItems 🟩🟩🟩
export default class XGroup extends XBaseContainer {
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XGROUP"),
            classes: ["x-group"],
            template: U.getTemplatePath("xitem"),
            isFreezingRotate: false,
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
    }
}
// 🟪🟪🟪 XArm: Helper XItem Used to Position Rotating XItems in XOrbits 🟪🟪🟪
const TWEEN_DURATION_AT_1000 = 6;
const TWEEN_DURATION_AT_360 = 6;
const MIN_TWEEN_DURATION = 0.5;
const MINWIDTHTOTWEEN = 10;
const MINANGLETOTWEEN = 1;
const ARMFADEINDURATION = 1.5;
export class XArm extends XGroup {
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XARM"),
            classes: ["x-arm"],
            template: U.getTemplatePath("xarm"),
            isFreezingRotate: false,
            vars: {
                xPercent: 0,
                yPercent: 0,
                transformOrigin: "100% 50%",
                height: 0,
                rotation: 0
            }
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    constructor(xParent, heldItem, xOptions) {
        xOptions.vars ??= {};
        xOptions.vars.width = xParent.orbitRadius;
        super(xParent, xOptions);
        this.#heldItem = heldItem;
        this.adopt(this.heldItem);
    }
    #currentAnimation = null;
    #rotationDestination = 0;
    fadeIn() {
        if (this.#currentAnimation) {
            return;
        }
        const delay = (this.homeRotation / 360) * ARMFADEINDURATION / 3;
        // DB.display(`[${this.id}.fadeIn(${delay})], homeAngle: `, `${this.homeRotation}`);
        const self = this;
        this.#currentAnimation = gsap.timeline({
            id: `${self.id}.TWEENFADEIN(${self.homeRotation})`,
            delay
            // onUpdate() {
            // if (self.heldItem instanceof XDie) {
            // self.heldItem.dbData = self.homeRotation;
            // }
            // }
        })
            .fromTo(self.elem, {
            width: self.homeWidth * 0.1,
            rotation: self.homeRotation - 50
        }, {
            id: `${self.id}.tweenFadeIn(Arm)`,
            width: self.homeWidth,
            rotation: self.homeRotation,
            duration: ARMFADEINDURATION,
            ease: "back.out(3)",
            delay: ARMFADEINDURATION * 0.1,
            onComplete() {
                self.#currentAnimation = null;
                self.tweenHome();
            }
        }, 0)
            .fromTo(self.heldItem.elem, {
            opacity: 0,
            scale: 0,
            rotation: -1 * self.global.rotation
        }, {
            id: `${self.id}.tweenFadeIn(HeldItem = ${self.heldItem.id})`,
            opacity: 1,
            scale: 1,
            duration: ARMFADEINDURATION / 1.5,
            ease: "power2"
        }, 0);
        // this.xParent.updateArms();
    }
    getHomeTweenDur() {
        const deltaWidth = Math.abs(this.width - this.homeWidth);
        const deltaRotation = Math.abs(U.getAngleDelta(this.rotation, this.homeRotation, [-180, 180]));
        if (deltaWidth <= MINWIDTHTOTWEEN && deltaRotation <= MINANGLETOTWEEN) {
            return null;
        }
        return Math.max(MIN_TWEEN_DURATION, (deltaWidth / 1000) * TWEEN_DURATION_AT_1000, (deltaRotation / 360) * TWEEN_DURATION_AT_360);
    }
    generateHomeTween() {
        if (!this.elem) {
            return null;
        }
        if (this.isHome) {
            return null;
        }
        const tweenDur = this.getHomeTweenDur();
        if (tweenDur === null) {
            return null;
        }
        const self = this;
        const newRotation = U.pInt(this.rotation + U.getAngleDelta(this.rotation, this.homeRotation, [-180, 180]));
        this.#rotationDestination = newRotation;
        // DB.display(`GENERATING [${self.id}-tweenHome] Cur: ${U.pInt(this.rotation)}, Home: ${U.pInt(this.homeRotation)}, New: ${U.pInt(newRotation)}`, self);
        return gsap.to(this.elem, {
            id: `${this.id}-tweenHome`,
            width: this.homeWidth,
            rotation: newRotation,
            duration: tweenDur,
            ease: "power4.inOut",
            paused: true,
            // onStart() {
            // DB.display(`START [${self.id}-tweenHome] From: ${U.pInt(self.rotation)}, To: ${U.pInt(newRotation)}, Dur: ${U.pFloat(tweenDur,2)}`, self);
            // self.#rotationDestination = newRotation;
            // },
            // onInterrupt() {
            // DB.display(`INTERRUPT [${self.id}-tweenHome] At: ${U.pInt(self.rotation)} (${this.progress()} to ${U.pInt(newRotation)})`);
            // },
            // onUpdate() {
            // if (self.heldItem instanceof XDie) {
            // self.heldItem.dbData = `${self.homeRotation}<br>${U.pInt(self.rotation)}`;
            // }
            // },
            onComplete() {
                self.#currentAnimation = null;
                self.#rotationDestination = U.cycleAngle(self.rotation, [-180, 180]);
                if (self.#rotationDestination === self.homeRotation) {
                    self.set({ rotation: self.#rotationDestination });
                }
                // if (self.isHome) {
                // DB.display(`END [${self.id}-tweenHome] At: ${U.pInt(self.rotation)} (To: ${U.pInt(newRotation)}) --> Correcting to ${U.pInt(self.#rotationDestination)}`, self);
                // } else {
                self.tweenHome();
                // }
            }
        });
    }
    get isHome() {
        return U.pInt(U.cycleAngle(this.rotation, [-180, 180])) === U.pInt(U.cycleAngle(this.homeRotation, [-180, 180]))
            && U.pInt(this.width) === U.pInt(this.homeWidth);
    }
    // #tweenHomeStaging: gsap.core.Tween | null = null;
    tweenHome() {
        if (this.isHome || this.#currentAnimation) {
            return;
        }
        // this.#tweenHomeStaging?.kill();
        // this.#tweenHomeStaging = this.generateHomeTween();
        // } else if (this.#tweenHomeStaging) {
        // this.#currentAnimation = this.#tweenHomeStaging;
        // this.#tweenHomeStaging = null;
        // this.#currentAnimation = this.generateHomeTween();
        this.generateHomeTween()?.play();
        // this.#currentAnimation?.play();
    }
    async render() {
        if (this._renderPromise) {
            return this._renderPromise;
        }
        this.options.vars.right = this.xParent.width / 2;
        this.options.vars.top = this.xParent.height / 2;
        if (this.heldItem.isVisible) {
            this.options.vars.width = this.distanceToHeldItem;
            this.options.vars.rotation = this.rotationToHeldItem;
        }
        const superPromise = super.render();
        this._renderPromise = superPromise
            .then(() => {
            console.log({
                heldItem: this.heldItem,
                isItVisible: this.heldItem.isVisible,
                angleTo: this.angleToHeldItem,
                distanceTo: this.distanceToHeldItem,
                width: this.options.vars.width,
                rotation: this.options.vars.rotation,
                curRotation: this.rotation,
                globalRotation: this.global.rotation
            });
            if (this.heldItem.isVisible) {
                this.heldItem.set({ x: 0, y: 0, rotation: this.heldItem.rotation - this.global.rotation, immediateRender: true });
                // this.xParent.updateArms();
                // this.tweenHome();
            }
            else {
                this.fadeIn();
            }
            return this;
        });
        return this._renderPromise;
    }
    #heldItem;
    get heldItem() { return this.#heldItem; }
    get heldItemSize() {
        return this.heldItem.size ?? 40;
    }
    get homeWidth() { return this.xParent.orbitRadius; }
    get homeRotation() { return U.pInt(this.xParent.getArmAngle(this) ?? gsap.utils.random(-180, 180, 1)); }
    // get homeWidth() { return this.xParent.orbitRadius + gsap.utils.random(-0.1 * this.xParent.orbitRadius, 0.1 * this.xParent.orbitRadius) }
    // get homeAngle() { return U.pInt((this.xParent.getArmAngle(this) ?? gsap.utils.random(-180, 180, 1)) + gsap.utils.random(-10, 10, 1)) }
    get positionOfHeldItem() {
        return MotionPathPlugin.getRelativePosition(this.xParent.elem, this.heldItem.elem, [0.5, 0.5], [0.5, 0.5]);
    }
    get distanceToHeldItem() {
        return U.getDistance({ x: 0, y: 0 }, this.positionOfHeldItem);
    }
    get angleToHeldItem() {
        return U.getAngleDelta(U.cycleAngle(this.global.rotation, [-180, 180]), U.getAngle({ x: 0, y: 0 }, this.positionOfHeldItem, undefined, [-180, 180]), [-180, 180]);
    }
    get rotationToHeldItem() {
        return this.rotation + this.angleToHeldItem - 180;
    }
    snapToHeldItem() {
        const heldItemSetParams = { x: 0, y: 0 };
        if (this.heldItem.isFreezingRotate) {
            heldItemSetParams.rotation = -1 * this.global.rotation;
        }
        this.set({
            width: this.distanceToHeldItem,
            rotation: this.rotation + this.angleToHeldItem - 180
        });
        this.heldItem.set(heldItemSetParams);
    }
}
// 🟪🟪🟪 XOrbit: A Single Orbital Containing XItems & Parented to an XPool 🟪🟪🟪
export class XOrbit extends XGroup {
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XORBIT"),
            name: XOrbitType.Main,
            classes: ["x-orbit"],
            template: U.getTemplatePath("xitem"),
            isFreezingRotate: false,
            radiusRatio: 1,
            rotationScaling: 1,
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    constructor(xParent, xOptions) {
        xOptions.name ??= XOrbitType.Main;
        xOptions.id ??= xOptions.name;
        xOptions.radiusRatio ??= C.xGroupOrbitalDefaults[xOptions.name].radiusRatio;
        xOptions.rotationScaling ??= C.xGroupOrbitalDefaults[xOptions.name].rotationScaling;
        super(xParent, xOptions);
        this.#orbitType = xOptions.name;
        this.#radiusRatio = xOptions.radiusRatio;
        this.#rotationScaling = Math.abs(xOptions.rotationScaling);
        this.#rotationAngle = xOptions.rotationScaling > 0 ? "+=360" : "-=360";
    }
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
    get rotationDuration() {
        return 10 * this.#radiusRatio / this.#rotationScaling;
    }
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
    updateArmAngles(fixedXArm) {
        const currentArmAngles = new Map(this.#armAngles);
        const totalArmWeight = this.arms.map((arm) => arm.heldItemSize).reduce((tot, val) => tot + val, 0);
        const anglePerWeight = 360 / totalArmWeight;
        const armAngles = [];
        this.#armAngles = new Map();
        let usedWeight = 0;
        this.arms.forEach((arm) => {
            usedWeight += arm.heldItemSize;
            this.#armAngles.set(arm, U.cycleAngle((usedWeight - (0.5 * arm.heldItemSize)) * anglePerWeight, [-180, 180]));
        });
        DB.display("updateArmAngles():", this.#armAngles.values());
        return this.#armAngles;
    }
    startRotating() {
        DB.title("STARTING ROTATING");
        const self = this;
        this.tweens.rotationTween = this.to({
            id: "rotationTween",
            rotation: this.#rotationAngle,
            duration: this.rotationDuration,
            repeat: -1,
            ease: "none",
            onUpdate() {
                self.xTerms.forEach((xItem) => {
                    if (xItem.isFreezingRotate) {
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
        this.armAngles.forEach((_, xArm) => xArm.fadeIn());
    }
    updateArms() {
        this.updateArmAngles();
        if (this.rendered) {
            this.arms.forEach((xArm) => {
                xArm.tweenHome();
            });
        }
    }
    async render() {
        if (this._renderPromise) {
            return this._renderPromise;
        }
        this.options.vars = {
            height: this.xParent.height,
            width: this.xParent.width,
            left: 0.5 * this.xParent.width,
            top: 0.5 * this.xParent.height,
            ...this.options.vars
        };
        const superPromise = super.render();
        this._renderPromise = superPromise
            .then(async () => {
            this.startRotating();
            this.fadeInArms();
            return this;
        });
        return this._renderPromise;
    }
    async adopt(xItem) {
        const promises = [xItem].flat()
            .map((heldItem) => {
            let xArm = heldItem;
            if (!(heldItem instanceof XArm)) {
                if (this.xItems.includes(heldItem)) {
                    xArm = heldItem.xParent;
                }
                else {
                    xArm = new XArm(this, heldItem, {});
                }
            }
            return super.adopt(xArm).then(() => xArm.heldItem);
        });
        return (promises.length === 1 ? promises[0] : Promise.all(promises))
            .then((result) => {
            this.updateArms();
            return result;
        });
    }
}
// 🟩🟩🟩 XPool: An XGroup Containing Drag-&-Droppable XTerms Contained in XOrbits 🟩🟩🟩
export class XPool extends XGroup {
    // ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮
    static get defaultOptions() {
        const defaultXOptions = {
            id: U.getUID("XPOOL"),
            classes: ["x-pool"],
            template: U.getTemplatePath("xitem"),
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
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
        for (const [orbitName, defaultOrbitSpecs] of Object.entries(C.xGroupOrbitalDefaults)) {
            this.#orbitalSpecs.set(orbitName, this.options.orbitals[orbitName] ?? defaultOrbitSpecs);
        }
    }
    #orbitals = new Map();
    #orbitalSpecs = new Map();
    get orbitals() { return this.#orbitals; }
    get xOrbits() { return Array.from(this.orbitals.values()); }
    async adopt(xItem, xOrbitType) {
        const self = this;
        const promises = [xItem].flat()
            .map(async (child) => {
            if (child instanceof XOrbit) {
                return super.adopt(child);
            }
            else if (xOrbitType) {
                let thisOrbit = self.#orbitals.get(xOrbitType);
                if (!thisOrbit) {
                    const orbitalSpecs = self.#orbitalSpecs.get(xOrbitType);
                    if (orbitalSpecs) {
                        thisOrbit = new XOrbit(self, orbitalSpecs);
                        self.#orbitals.set(xOrbitType, thisOrbit);
                        await self.adopt(thisOrbit);
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
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
        this.options.vars = {
            ...this.options.vars,
            ...{
                ...this.options.position,
                "height": this.options.size,
                "width": this.options.size,
                "--bg-color": this.options.color
            }
        };
    }
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
            ...C.xRollStyles.defaults,
            orbitals: {
                [XOrbitType.Main]: C.xGroupOrbitalDefaults[XOrbitType.Main]
            },
            vars: {}
        };
        return U.objMerge(super.defaultOptions, defaultXOptions);
    }
    static REGISTRY = new Map();
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
    }
}