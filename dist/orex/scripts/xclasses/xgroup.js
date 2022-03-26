
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
class XArm extends XItem {
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
    constructor(xItem, parentOrbit) {
        super(parentOrbit, {
            id: "arm"
        });
        this.xItem = xItem;
        this.adopt(xItem, false);
    }
    async initialize() {
        if (await super.initialize()) {
            this.xItem.set({
                left: "unset",
                top: "unset",
                right: -1 * this.xItem.width
            });
            this.adopt(this.xItem, false);
            return this.xItem.confirmRender();
        }
        return Promise.resolve(false);
    }
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
    get arms$() { return $(`#${this.id} .x-arm`); }
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
        if (this.isRendered) {
            this.to({
                id: "rotationTween",
                rotation: `${dir === Dir.L ? "+" : "-"}=360`,
                duration,
                repeat: -1,
                ease: "none",
                callbackScope: this,
                onUpdate() {
                    this.xItems.forEach((xItem) => {
                        if (xItem.xParent?.isInitialized) {
                            xItem.set({ rotation: -1 * xItem.xParent.global.rotation });
                        }
                    });
                }
            });
        }
    }
    updateArmsThrottle;
    updateArms(duration = 3, widthOverride) {
        if (this.updateArmsThrottle) {
            clearTimeout(this.updateArmsThrottle);
        }
        this.updateArmsThrottle = setTimeout(() => {
            DB.log("Update Arms RUNNING!");
            const angleStep = 360 / this.arms.length;
            gsap.timeline()
                .to(this.arms$, {
                width: widthOverride ?? this.orbitRadius,
                ease: "back.out(4)",
                duration,
                stagger: {
                    amount: 1,
                    from: "end"
                }
            }, "<")
                .to(this.arms$, {
                rotation(i) { return angleStep * i; },
                ease: "power2.out",
                duration
            }, "<");
        }, 10);
    }
    async addXItem(xItem) {
        const xArm = new XArm(xItem, this);
        if (await xArm.initialize()) {
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
            return xArm.initialize();
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
    constructor(xParent, { orbitals = U.objClone(C.xGroupOrbitalDefaults), ...xOptions }) {
        super(xParent, xOptions);
        for (const [orbitName, { radiusRatio, rotationScaling }] of Object.entries(orbitals)) {
            this.#orbitalWeights.set(orbitName, radiusRatio);
            this.#orbitalSpeeds.set(orbitName, rotationScaling);
            this.#orbitals.set(orbitName, new XOrbit(orbitName, this, radiusRatio, rotationScaling));
        }
    }
    async addXItem(xItem, orbit) {
        const orbital = this.orbitals.get(orbit);
        if (orbital instanceof XOrbit && await orbital.initialize()) {
            return orbital.addXItem(xItem);
        }
        return Promise.resolve(false);
    }
    async addXItems(xItemsByOrbit) {
        const self = this;
        return Promise.allSettled(Object.entries(xItemsByOrbit).map(([orbitName, xItems]) => xItems.map((xItem) => self.addXItem(xItem, orbitName))));
    }
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