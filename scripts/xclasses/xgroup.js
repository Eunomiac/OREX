// #region ████████ IMPORTS ████████ ~
import { 
// #region ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮ ~
C, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, XItem
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "../helpers/bundler.js";
class XArm extends XItem {
    constructor(xItem, parentOrbit) {
        super({
            id: `${parentOrbit.id}-arm-${parentOrbit.xChildren.size}`,
            parent: parentOrbit,
            onRender: {
                set: {
                    height: 2,
                    rotation: 0,
                    width: 0,
                    transformOrigin: "0% 50%",
                    top: "50%",
                    left: "50%"
                }
            }
        });
        this.xItem = xItem;
        this.xItem.parent = this;
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: U.unique([...super.defaultOptions.classes, "x-arm"])
        });
    }
    async initialize() {
        if (await super.initialize()) {
            this.xItem.set({ right: -1 * this.xItem.width });
            this.xItem.parent = this;
            return this.xItem.confirmRender();
        }
        return Promise.resolve(false);
    }
}
export default class XGroup extends XItem {
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: U.unique([...super.defaultOptions.classes, "x-group"])
        });
    }
    get parent() { return super.parent; }
}
/* Subclass XGroup into XPool and XOrbit
                XOrbit = Wraps XChildren in XArms, rotates circles, etc
                    - XOrbits handle tossing between XOrbits and pretty much everything else animated
                XPool = XChildren are centered on pool -- meant to contain XOrbits and centrally-located modifiers

            Figure out a way to have to/from/fromTo methods on all XItems that:
                - will adjust animation timescale based on a maximum time to maximum distance ratio (and minspeed ratio?)
                - if timescale is small enough, just uses .set()
        */
export class XPool extends XGroup {
    constructor({ orbitals, ...xOptions }) {
        super(xOptions);
        this._core = [];
        this._orbitals = new Map();
        orbitals = orbitals ?? { ...C.xGroupOrbitalDefaults };
        this._orbitalWeights = new Map(Object.entries(orbitals));
        this._orbitalWeights.forEach((weight, name) => {
            this._orbitals.set(name, new XOrbit(name, weight, this));
        });
    }
    get orbitals() { return this._orbitals; }
    get xOrbits() { return Array.from(Object.values(this.orbitals)); }
    get xItems() {
        return this.xOrbits.map((xOrbit) => xOrbit.getXChildren()).flat();
    }
    async addXItem(xItem, orbit) {
        if (this._orbitals.has(orbit)) {
            return this.orbitals.get(orbit)?.addXItem(xItem) ?? Promise.resolve(false);
        }
        return Promise.resolve(false);
    }
}
export class XOrbit extends XGroup {
    constructor(id, weight, parentGroup) {
        super({ id, parent: parentGroup, onRender: {
                set: {
                    width: weight * parentGroup.width
                }
            } });
        this._arms = [];
        this._weight = weight;
    }
    get arms() { return this._arms; }
    get xItems() { return this.arms.map((arm) => arm.xItem); }
    get orbitRadius() { return this.weight * 0.5 * this.parent.width; }
    get weight() { return this._weight; }
    set weight(weight) {
        this._weight = weight;
        if (this.isRendered) {
            this.updateArms();
        }
    }
    updateArms() {
        const angleStep = 360 / this.arms.length;
        this.arms.forEach((arm, i) => {
            arm.to({ width: this.orbitRadius, rotation: angleStep * i, delay: 0.2 * i, ease: "power2.inOut", duration: 1 });
        });
    }
    async addXItem(xItem, angle = 0) {
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
            return xArm.initialize();
        });
        if (await Promise.allSettled(allPromises)) {
            this.updateArms();
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
}