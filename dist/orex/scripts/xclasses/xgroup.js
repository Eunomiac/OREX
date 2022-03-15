
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮
C, 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, DB, XItem, XDie } from "../helpers/bundler.js";
export var XOrbitType;
(function (XOrbitType) {
    XOrbitType["Main"] = "Main";
    XOrbitType["Core"] = "Core";
    XOrbitType["Outer"] = "Outer";
})(XOrbitType || (XOrbitType = {}));
export default class XGroup extends XItem {
    static get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-group"] }); }
    get xParent() { return super.xParent; }
    set xParent(xItem) { super.xParent = xItem; }
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
    }
}
class XArm extends XItem {
    constructor(xItem, parentOrbit) {
        super(parentOrbit, {
            id: `${parentOrbit.id}-arm-${parentOrbit.xKids.size}`,
            keepID: true
        });
        this.xItem = xItem;
        this.adopt(xItem, false);
    }
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
export class XOrbit extends XGroup {
    // constructor(id: string, weight: number, parentGroup: XGroup, rotationRate: number) {
    // 	super(parentGroup, {
    // 		id,
    // 		onRender: {
    // 			set: {
    // 				height: parentGroup.height,
    // 				width: parentGroup.width,
    // 				left: 0.5 * parentGroup.width,
    // 				top: 0.5 * parentGroup.height
    // 			},
    // 			to: {
    // 				rotation: `${rotationRate > 0 ? "+" : "-"}=360`,
    // 				duration: rotationRate,
    // 				ease: "none",
    // 				repeat: -1
    // 			}
    // 		}
    // 	});
    constructor(id, weight, parentGroup, rotationScaling = 1) {
        super(parentGroup, {
            id,
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
        this.rotationAngle = weight > 0 ? "+=360" : "-=360";
        console.log(this.rotationAngle);
        this.rotationScaling = rotationScaling;
        this._weight = Math.abs(weight);
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-orbit"]
        });
    }
    get arms() { return Array.from(this.xKids); }
    get xItems() { return this.arms.map((arm) => arm.xItem); }
    get orbitRadius() { return this.weight * 0.5 * this.xParent.width; }
    get weight() { return this._weight; }
    set weight(weight) {
        this._weight = weight;
        if (this.isRendered) {
            this.updateArms();
        }
    }
    get rotationDuration() { return 10 * this._weight * this.rotationScaling; }
    async startRotating() {
        if (this.isRendered) {
            const rotationTween = this.to({
                rotation: this.rotationAngle,
                repeat: -1,
                duration: this.rotationDuration,
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
            if (rotationTween) {
                this.rotationTween = rotationTween;
            }
        }
    }
    updateArms() {
        DB.log(`[${this.id}] Updating Arms`, this.arms);
        const angleStep = 360 / this.arms.length;
        this.arms.forEach((arm, i) => {
            arm.to({ width: this.orbitRadius, rotation: angleStep * i, delay: 0.2 * i, ease: "power2.inOut", duration: 1 });
        });
    }
    async addXItem(xItem) {
        DB.log(`[${this.id}] Adding XItem: ${xItem.id}`);
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
    constructor(xParent, { orbitals = U.objClone(C.xGroupOrbitalDefaults), ...xOptions }) {
        super(xParent, xOptions);
        this._core = [];
        this._orbitals = new Map();
        this._orbitalWeights = new Map();
        this._orbitalSpeeds = new Map();
        for (const [orbitName, { radiusRatio, rotationRate }] of Object.entries(orbitals)) {
            this._orbitalWeights.set(orbitName, radiusRatio);
            this._orbitalSpeeds.set(orbitName, rotationRate);
            this._orbitals.set(orbitName, new XOrbit(orbitName, radiusRatio, this, rotationRate));
        }
    }
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
    get orbitals() { return this._orbitals; }
    get xOrbits() { return Array.from(Object.values(this.orbitals)); }
    get xItems() {
        return this.xOrbits.map((xOrbit) => xOrbit.xItems).flat();
    }
    async addXItem(xItem, orbit) {
        // DB.group(`${xItem.constructor.name}.addXItem(${xItem.id}, ${orbit})`);
        const orbital = this.orbitals.get(orbit);
        // DB.log("orbital", orbital);
        // DB.log("is XOrbit?", orbital instanceof XOrbit);
        if (orbital instanceof XOrbit && await orbital.initialize()) {
            // DB.log("Orbital Initialized, Adding Item...");
            return orbital.addXItem(xItem);
            // return orbital.addXItem(xItem);
        }
        // DB.error(`FAILED adding ${xItem.id} to '${orbit}' of ${xItem.id}`);
        return Promise.resolve(false);
    }
    async addXItems(xItemsByOrbit) {
        const self = this;
        return Promise.allSettled(Object.entries(xItemsByOrbit).map(([orbitName, xItems]) => xItems.map((xItem) => self.addXItem(xItem, orbitName))));
    }
}
export class XRoll extends XPool {
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
        this._hasRolled = false;
    }
    get hasRolled() { return this._hasRolled; }
    get diceRolls() {
        if (this.hasRolled) {
            return this.getXKids(XDie, true).map((xDie) => (xDie).value || 0);
        }
        return [];
    }
    // Rolls all XDie in the XRoll.
    rollDice(isForcingReroll = false) {
        if (isForcingReroll || !this._hasRolled) {
            this._hasRolled = true;
            const xDice = this.getXKids(XDie, true);
            gsap.timeline()
                .fadeDieText(`#${this.id} .x-die`)
                .call(() => xDice.map((xDie) => xDie.roll()))
                .pulseRolledDie(`#${this.id} .x-die`);
        }
    }
}