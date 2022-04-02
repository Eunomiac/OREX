
// ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮
import { 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
C, U, DB, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XItem, XDie, XMod, 
// ▮▮▮▮▮▮▮[Enums]▮▮▮▮▮▮▮
Dir
 } from "../helpers/bundler.js";
export default class XGroup extends XItem {
    static REGISTRY = new Map();
    static get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-group"] }); }
    get xParent() { return super.xParent; }
    set xParent(xItem) { super.xParent = xItem; }
    get xItems() { return Array.from(this.xKids); }
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
    }
}
// 🟪🟪🟪 XArm: Helper XItem Used to Position Rotating XItems in XOrbits 🟪🟪🟪
export class XArm extends XItem {
    static REGISTRY = new Map();
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-arm"],
            onRender: {
                set: {
                    height: 0,
                    width: 0,
                    transformOrigin: "0% 50%",
                    top: "50%",
                    left: "50%",
                    xPercent: 0,
                    yPercent: 0
                }
            }
        });
    }
    xItem;
    get xParent() { return super.xParent; }
    constructor(xItem, parentOrbit) {
        super(parentOrbit, {
            id: "arm"
        });
        this.xItem = xItem;
    }
    async grabItem() {
        this.set({ width: this.distanceToHeldItem, rotation: this.rotation + this.angleToHeldItem });
        this.adopt(this.xItem, false);
        this.xItem.set({ x: 0, y: 0 });
        return Promise.resolve(true);
    }
    async initialize() {
        await super.initialize();
        this.set({
            "--held-item-width": `${this.xItem.width}px`
        });
        this.xParent.adopt(this, false);
        return this.grabItem();
    }
    get positionOfHeldItem() {
        if (!this.xItem.isInitialized) {
            return this.xItem.pos;
        }
        return MotionPathPlugin.getRelativePosition(this.xParent.elem, this.xItem.elem, [0.5, 0.5], [0.5, 0.5]);
    }
    get distanceToHeldItem() {
        if (!this.xItem.isInitialized) {
            return this.xParent.orbitRadius;
        }
        return U.getDistance({ x: 0, y: 0 }, this.positionOfHeldItem);
    }
    get angleToHeldItem() {
        return U.getAngleDelta(this.global.rotation, U.getAngle({ x: 0, y: 0 }, this.positionOfHeldItem));
    }
    async stretchToXItem() {
        if (this.xParent && this.xItem.isInitialized) {
            // Relative x/y distance from Arm origin to xItem
            const { x: xDist, y: yDist } = MotionPathPlugin.getRelativePosition(this.xParent.elem, this.xItem.elem, [0.5, 0.5], [0.5, 0.5]);
            // Total Distance
            const distToFloat = U.getDistance({ x: 0, y: 0 }, { x: xDist, y: yDist });
            // Angle from Arm origin to target die
            const angleToFloat = U.getAngle({ x: 0, y: 0 }, { x: xDist, y: yDist });
            // Get global Arm rotation
            const curAngle = this.global.rotation;
            // Get rotation delta
            const angleDelta = U.getAngleDelta(curAngle, angleToFloat);
            // Adjust local arm rotation angle and width to match
            return this.set({ width: distToFloat, rotation: this.rotation + angleDelta });
        }
        return Promise.reject();
    }
    get orbitWeight() { return this.xItem.size; }
}
export var XOrbitType;
(function (XOrbitType) {
    XOrbitType["Main"] = "Main";
    XOrbitType["Inner"] = "Inner";
    XOrbitType["Outer"] = "Outer";
})(XOrbitType || (XOrbitType = {}));
export class XOrbit extends XGroup {
    static REGISTRY = new Map();
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-orbit"]
        });
    }
    #rotationScaling;
    #rotationAngle;
    #rotationDuration;
    get arms$() { return $(`#${this.id} > .x-arm`); }
    get arms() { return Array.from(this.xKids); }
    // override get xItems(): XItem[] { return this.arms.map((xArm) => xArm.xItem) }
    get xTerms() { return this.xItems.filter((xItem) => xItem instanceof XDie || xItem instanceof XMod); }
    #radiusRatio;
    get radiusRatio() { return this.#radiusRatio; }
    set radiusRatio(radiusRatio) {
        this.#radiusRatio = radiusRatio;
        if (this.isRendered) {
            this.updateArms();
        }
    }
    get orbitRadius() { return this.radiusRatio * 0.5 * this.xParent.width; }
    get totalArmWeight() { return this.arms.map((arm) => arm.orbitWeight).reduce((tot, val) => tot + val, 0); }
    get armAngles() {
        const anglePerWeight = 360 / this.totalArmWeight;
        const armAngles = [];
        let usedWeight = 0;
        this.arms.forEach((arm) => {
            usedWeight += arm.orbitWeight;
            armAngles.push((usedWeight - (0.5 * arm.orbitWeight)) * anglePerWeight);
        });
        return armAngles;
    }
    constructor(name, parentGroup, radiusRatio, rotationScaling) {
        radiusRatio ??= C.xGroupOrbitalDefaults[name].radiusRatio;
        rotationScaling ??= C.xGroupOrbitalDefaults[name].rotationScaling;
        super(parentGroup, {
            id: name,
            onRender: {
                set: {
                    height: parentGroup.height,
                    width: parentGroup.width,
                    left: 0.5 * parentGroup.width,
                    top: 0.5 * parentGroup.height
                },
                funcs: [
                    (self) => self.startRotating()
                ]
            }
        });
        this.#radiusRatio = radiusRatio;
        this.#rotationScaling = Math.abs(rotationScaling);
        this.#rotationAngle = rotationScaling > 0 ? "+=360" : "-=360";
        this.#rotationDuration = 10 * this.#radiusRatio * this.#rotationScaling;
    }
    startRotating(dir = Dir.L, duration = 10) {
        this.to({
            id: "rotationTween",
            rotation: `${dir === Dir.L ? "+" : "-"}=360`,
            duration,
            repeat: -1,
            ease: "none",
            callbackScope: this,
            onUpdate() {
                this.xTerms.forEach((xItem) => {
                    if (xItem.isFreezingRotate && xItem.isInitialized && xItem.xParent?.isInitialized) {
                        xItem.set({ rotation: -1 * xItem.xParent.global.rotation });
                    }
                });
            }
        });
    }
    updateArmsThrottle;
    pauseRotating() {
        this.xElem.tweens.rotationTween?.pause();
    }
    playRotating() {
        this.xElem.tweens.rotationTween?.play();
    }
    async initialize() {
        await super.initialize();
        await Promise.all(this.arms.map((xArm) => xArm.initialize()));
        return Promise.resolve(true);
    }
    #isArmed = false;
    updateArms(duration = 3, widthOverride) {
        if (this.updateArmsThrottle) {
            clearTimeout(this.updateArmsThrottle);
        }
        this.updateArmsThrottle = setTimeout(() => {
            DB.log("Update Arms RUNNING!");
            const self = this;
            gsap.timeline()
                .fromTo(this.arms$, this.#isArmed
                ? {}
                : {
                    width: (widthOverride ?? this.orbitRadius) * 1.5,
                    rotation(i) { return self.armAngles[i]; },
                    opacity: 0,
                    scale: 2
                }, {
                width: widthOverride ?? this.orbitRadius,
                ease: "back.out(4)",
                duration,
                stagger: {
                    amount: 1,
                    from: "end"
                }
            }, "<")
                .to(this.arms$, {
                scale: 1,
                opacity: 1,
                duration: duration / 3,
                ease: "power2.out"
            }, "<")
                .to(this.arms$, {
                rotation(i) { return self.armAngles[i]; },
                ease: "power2.out",
                duration
            }, "<");
            if (!this.#isArmed) {
                gsap.from(this.xElem.tweens.rotationTween, {
                    timeScale: 3,
                    duration: duration / 2,
                    ease: "sine.out"
                });
            }
            this.#isArmed = true;
        }, 10);
    }
    async addXItem(xItem, isUpdatingArms = true) {
        const xArm = new XArm(xItem, this);
        this.adopt(xArm);
        if (this.isInitialized) {
            await xArm.initialize();
            if (isUpdatingArms) {
                this.updateArms();
            }
        }
        return Promise.resolve(true);
    }
    async addXItems(xItems) {
        await Promise.allSettled(xItems.map((xItem) => this.addXItem(xItem, false)));
        this.updateArms();
        return Promise.resolve(true);
    }
}
export class XPool extends XGroup {
    static REGISTRY = new Map();
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-pool"]
        });
    }
    #core = [];
    #orbitals = new Map();
    #orbitalWeights = new Map();
    #orbitalSpeeds = new Map();
    get orbitals() { return this.#orbitals; }
    get xOrbits() { return Array.from(this.orbitals.values()); }
    // override get xItems(): XItem[] {
    // 	return this.xOrbits.map((xOrbit) => (xOrbit.isInitialized ? xOrbit.xItems : xOrbit)).flat();
    // }
    constructor(xParent, { orbitals = U.objClone(C.xGroupOrbitalDefaults), ...xOptions }) {
        super(xParent, xOptions);
        for (const [orbitName, { radiusRatio, rotationScaling }] of Object.entries(orbitals)) {
            this.#orbitalWeights.set(orbitName, radiusRatio);
            this.#orbitalSpeeds.set(orbitName, rotationScaling);
            this.#orbitals.set(orbitName, new XOrbit(orbitName, this, radiusRatio, rotationScaling));
        }
    }
    async initialize() {
        await super.initialize();
        await Promise.all(this.xOrbits.map((xOrbit) => xOrbit.initialize()));
        return Promise.resolve(true);
    }
    async addXItem(xItem, orbit) {
        const orbital = this.orbitals.get(orbit);
        return orbital?.addXItem(xItem);
    }
    async addXItems(xItemsByOrbit) {
        return Promise.allSettled(Object.entries(xItemsByOrbit)
            .map(async ([orbitName, xItems]) => await this.orbitals.get(orbitName)?.addXItems(xItems)));
    }
    pauseRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.pauseRotating()); }
    playRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.playRotating()); }
}
export class XRoll extends XPool {
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
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
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
export class XSource extends XPool {
    // protected static override REGISTRY: Map<string, this> = new Map();
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
    }
}