// #region ████████ IMPORTS ████████ ~
import { 
<<<<<<< Updated upstream
// #region ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮ ~
C, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, DB, XItem, XDie
=======
// #region ▮▮▮▮▮▮▮[Constants & Utility]▮▮▮▮▮▮▮
C, U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XItem, XDie, XAnimVars
>>>>>>> Stashed changes
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "../helpers/bundler.js";
export default class XGroup extends XItem {
    static get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-group"] }); }
    get xParent() { return super.xParent; }
    set xParent(xItem) { super.xParent = xItem; }
    get xItems() { return Array.from(this.xKids); }
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
    }
}
// #endregion ▄▄▄▄▄ XGroup ▄▄▄▄▄
// #region 🟪🟪🟪 XArm: Helper XItem Used to Position Rotating XItems in XOrbits 🟪🟪🟪 ~
class XArm extends XItem {
    constructor(xItem, parentOrbit) {
        super(parentOrbit, {
            id: `${parentOrbit.id}-arm-${parentOrbit.xKids.size}`,
            keepID: true
        });
        this.xItem = xItem;
        this.adopt(xItem, false);
        if (xItem instanceof XGroup) {
            this.xItem.set({
            // x: 0,
            // y: 0,
            // top: 0,
            // left: 0,
            // xPercent: 0,
            // yPercent: 0,
            // right: 0,
            // bottom: 0
            });
        }
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
            this.xItem.set({ right: -1 * this.xItem.width });
            this.adopt(this.xItem, false);
            return this.xItem.confirmRender();
        }
        return Promise.resolve(false);
    }
}
export var XOrbitType;
(function (XOrbitType) {
    XOrbitType["Main"] = "Main";
    XOrbitType["Core"] = "Core";
    XOrbitType["Outer"] = "Outer";
})(XOrbitType || (XOrbitType = {}));
export class XOrbit extends XGroup {
<<<<<<< Updated upstream
    constructor(id, weight, parentGroup) {
=======
    constructor(id, weight, parentGroup, rotationScaling = 1) {
>>>>>>> Stashed changes
        super(parentGroup, {
            id,
            onRender: {
                set: {
                    height: parentGroup.height,
                    width: parentGroup.width,
                    left: 0.5 * parentGroup.width,
                    top: 0.5 * parentGroup.height
                }
            }
        });
<<<<<<< Updated upstream
        const self = this;
        const rotationTween = this.to({
            rotation: "+=360",
            repeat: -1,
            duration: 10 * weight,
            ease: "none",
            onUpdate() {
                self.xItems.forEach((xItem) => {
                    if (xItem.xParent?.isInitialized) {
                        xItem.set({ rotation: -1 * xItem.xParent.global.rotation });
                    }
                });
            }
        });
        this._weight = weight;
=======
        this.rotationAngle = weight > 0 ? "+=360" : "-=360";
        this.rotationScaling = rotationScaling;
        this._weight = Math.abs(weight);
>>>>>>> Stashed changes
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-orbit"]
        });
    }
    get arms() { return Array.from(this.xKids); }
    get xItems() { return this.arms.map((xArm) => xArm.xItem); }
    get orbitRadius() { return this.weight * 0.5 * this.xParent.width; }
    get weight() { return this._weight; }
    set weight(weight) {
        this._weight = weight;
        if (this.isRendered) {
            this.updateArms();
        }
    }
<<<<<<< Updated upstream
    updateArms() {
        DB.log(`[${this.id}] Updating Arms`, this.arms);
=======
    get rotationDuration() { return 10 * this._weight * this.rotationScaling; }
    startRotating() {
        const [{ type, ...animVars }] = XAnimVars.rotateXPool({
            xGroup: this,
            rotation: this.rotationAngle,
            duration: this.rotationDuration
        });
        this.to(animVars);
    }
    updateArms(duration = 0.5) {
>>>>>>> Stashed changes
        const angleStep = 360 / this.arms.length;
        const staggerStep = duration / this.arms.length;
        this.arms.forEach((arm, i) => {
            arm.set({
                width: 0,
                rotation: (angleStep * i) - 90
            })
                .to({
                width: this.orbitRadius,
                delay: staggerStep * i,
                ease: "back.out(8)",
                duration
            })
                .to({
                rotation: angleStep * i,
                ease: "power2.out",
                duration
            });
        });
    }
<<<<<<< Updated upstream
    async addXItem(xItem, angle = 0) {
        DB.log(`[${this.id}] Adding XItem: ${xItem.id}`);
=======
    async addXItem(xItem) {
>>>>>>> Stashed changes
        const xArm = new XArm(xItem, this);
        if (await xArm.initialize()) {
            this.updateArms();
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
    async addXItems(xItems) {
        const allPromises = xItems.map((xItem, i) => {
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
    constructor(xParent, { orbitals, ...xOptions }) {
        super(xParent, xOptions);
        this._core = [];
        this._orbitals = new Map();
        orbitals = orbitals ?? { ...C.xGroupOrbitalDefaults };
        this._orbitalWeights = new Map(Object.entries(orbitals));
        this._orbitalWeights.forEach((weight, name) => {
            this._orbitals.set(name, new XOrbit(name, weight, this));
        });
    }
    static get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-pool"] }); }
    get orbitals() { return this._orbitals; }
    get xOrbits() { return Array.from(this.orbitals.values()); }
    get xItems() {
        return this.xOrbits.map((xOrbit) => xOrbit.getXKids(XItem)).flat();
    }
    async addXItem(xItem, orbit) {
        const orbital = this.orbitals.get(orbit);
        if (orbital instanceof XOrbit && await orbital.initialize()) {
            return orbital.addXItem(xItem);
        }
        return Promise.resolve(false);
    }
}
export class XRoll extends XPool {
    constructor() {
        super(...arguments);
        this._hasRolled = false;
    }
    get hasRolled() { return this._hasRolled; }
    get diceRolls() {
        if (this.hasRolled) {
            return this.getXKids(XDie, true).map((xDie) => xDie.value || 0);
        }
        return [];
    }
    // Rolls all XDie in the XRoll.
    rollDice() {
        this.getXKids(XDie, true).map((xDie) => xDie.roll());
        this._hasRolled = true;
    }
}
// #endregion ▄▄▄▄▄ XRoll ▄▄▄▄▄