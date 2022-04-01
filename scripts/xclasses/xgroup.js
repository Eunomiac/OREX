// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
C, U, DB, XItem, XDie, XMod, 
// #endregion ▮▮▮▮[XItems]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Enums]▮▮▮▮▮▮▮
Dir
// #endregion ▮▮▮▮[Enums]▮▮▮▮
 } from "../helpers/bundler.js";
export default class XGroup extends XItem {
    static REGISTRY = new Map();
    static get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-group"] }); }
    // override get xParent() { return super.xParent as XItem }
    // override set xParent(xItem: XItem) { super.xParent = xItem }
    #xKids = new Set();
    get xItems() { return Array.from(this.xKids); }
    constructor(xOptions, xParent = XItem.XROOT) {
        super(xOptions, xParent);
    }
}
// #endregion ▄▄▄▄▄ XGroup ▄▄▄▄▄
// #region 🟪🟪🟪 XArm: Connective Tissue Between XROOT, XGroups, XOrbits and XTerms 🟪🟪🟪 ~
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
    // public static Connect(xParent: XGroup, xKids: XItem[]): Promise<XArm[]> {
    // 	/* PARTITION xKids into those that are initialized and those that aren't.
    // 	UNINITIALIZED XKIDS:
    // 		-> Immediately set xKid: {
    // 				opacity: 0,
    // 		} Set xKid's scale to 0.1 * its current scale
    // 		// -> Set xKid's opacity to zero, but record its current opacity
    // 		// -> Set xArm's width to zero
    // 		// ->
    // 	// Does xKid have a current xParent?
    // 		// -> Call disown() method on xParent (this will also kill the XArm per an override below)
    // 		// -> Disown reparents xItem to global space, maintaining current position, scale and rotation
    // 	// IF xKid is Initialized:
    // 		// -> Get xKid's current position
    // 		// -> UniteWithXItem() method, with animations
    // 	// OTHERWISE
    // 	*/
    // }
    xItem;
    constructor(xItem, parentOrbit) {
        super({ id: "arm" }, parentOrbit);
        this.xItem = xItem;
    }
    async uniteWithHeldItem() {
        if (await this.xItem.xInitialize()) {
            await this.stretchToXItem();
            this.adopt(this.xItem, false);
            this.xItem.set({ x: 0, y: 0 });
            return Promise.resolve(this);
        }
        return Promise.reject();
    }
    async xInitialize() {
        if (await super.xInitialize() && await this.xItem.xInitialize()) {
            this.set({
                "--held-item-width": `${this.xItem.width}px`
            });
            this.xParent?.adopt(this, false);
            return this.uniteWithHeldItem();
        }
        return Promise.reject();
    }
    async stretchToXItem() {
        if (this.xParent && await this.xItem.xInitialize()) {
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
    get xItems() { return this.arms.map((xArm) => xArm.xItem); }
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
        super({
            id: name,
            onRender: {
                set: {
                    height: parentGroup.height,
                    width: parentGroup.width,
                    left: 0.5 * parentGroup.width,
                    top: 0.5 * parentGroup.height
                },
                funcs: [
                    (self) => {
                        self.startRotating();
                    }
                ]
            }
        }, parentGroup);
        this.#radiusRatio = radiusRatio;
        this.#rotationScaling = Math.abs(rotationScaling);
        this.#rotationAngle = rotationScaling > 0 ? "+=360" : "-=360";
        this.#rotationDuration = 10 * this.#radiusRatio * this.#rotationScaling;
    }
    startRotating(dir = Dir.L, duration = 10) {
        if (this.isRendered) {
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
    }
    updateArmsThrottle;
    pauseRotating() {
        if (this.isRendered) {
            this.xElem.xTweens.rotationTween?.pause();
        }
    }
    playRotating() {
        if (this.isRendered) {
            this.xElem.xTweens.rotationTween?.play();
        }
    }
    addXArm(xArm) {
        // If XArm's item is uninitialized, just add it like updateArms currently does
        // Otherwise, get global angle of XOrbit to XTerm -> local rotation of XArm
        // Insert XArm into
    }
    updateArms(duration = 3, widthOverride) {
        if (this.updateArmsThrottle) {
            clearTimeout(this.updateArmsThrottle);
        }
        this.updateArmsThrottle = setTimeout(() => {
            DB.log("Update Arms RUNNING!");
            const self = this;
            gsap.timeline()
                .to(this.arms$, {
                width: widthOverride ?? this.orbitRadius,
                ease: "back.out(4)",
                duration,
                stagger: {
                    amount: 1,
                    from: "end"
                } /* ,
                onUpdate() {
                    this.targets.forEach((target: HTMLElement) => {
                        gsap.set($(`#${target.id} > .x-item`), {x: gsap.getProperty(target, "width")});
                    });
                } */
            }, "<")
                .to(this.arms$, {
                rotation(i) { return self.armAngles[i]; },
                ease: "power2.out",
                duration
            }, "<");
        }, 10);
    }
    async addXItem(xItem) {
        const xArm = new XArm(xItem, this);
        if (await xArm.xInitialize()) {
            this.updateArms();
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
    async addXItems(xItems) {
        const allPromises = xItems.map((xItem) => {
            const xArm = new XArm(xItem, this);
            this.adopt(xArm);
            console.log(this.arms);
            return xArm.xInitialize();
        });
        if (await Promise.allSettled(allPromises)) {
            this.updateArms();
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
}
export class XPool extends XGroup {
    static REGISTRY = new Map();
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-pool"],
            onRender: {
                set: {
                    height: 200,
                    width: 200
                }
            }
        });
    }
    #core = [];
    #orbitals = new Map();
    #orbitalWeights = new Map();
    #orbitalSpeeds = new Map();
    get orbitals() { return this.#orbitals; }
    get xOrbits() { return Array.from(this.orbitals.values()); }
    get xItems() {
        return this.xOrbits.map((xOrbit) => xOrbit.xItems).flat();
    }
    constructor({ orbitals = U.objClone(C.xGroupOrbitalDefaults), ...xOptions }, xParent = XItem.XROOT) {
        super(xOptions, xParent);
        for (const [orbitName, { radiusRatio, rotationScaling }] of Object.entries(orbitals)) {
            this.#orbitalWeights.set(orbitName, radiusRatio);
            this.#orbitalSpeeds.set(orbitName, rotationScaling);
            this.#orbitals.set(orbitName, new XOrbit(orbitName, this, radiusRatio, rotationScaling));
        }
    }
    async addXItem(xItem, orbit) {
        // return XArm.Connect(this, this.orbitals.get(orbit));
        const orbital = this.orbitals.get(orbit);
        if (orbital instanceof XOrbit && await orbital.xInitialize()) {
            return orbital.addXItem(xItem);
        }
        return Promise.resolve(false);
    }
    async addXItems(xItemsByOrbit) {
        const self = this;
        return Promise.all(Object.entries(xItemsByOrbit)
            .map(async ([orbitName, xItems]) => Promise.all(xItems
            .map((xItem) => self.addXItem(xItem, orbitName)))));
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
    constructor(xOptions, xParent = XItem.XROOT) {
        super(xOptions, xParent);
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
    // #region ████████ Roll Results: Parsing & Analyzing Roll Results ████████ ~
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
    constructor(xOptions, xParent) {
        super(xOptions, xParent);
    }
}
// #endregion ▄▄▄▄▄ XRoll ▄▄▄▄▄