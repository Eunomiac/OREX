
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _XOrbit_rotationScaling, _XOrbit_rotationAngle, _XOrbit_rotationDuration, _XOrbit_radiusRatio, _XPool_core, _XPool_orbitals, _XPool_orbitalWeights, _XPool_orbitalSpeeds, _XRoll_hasRolled;
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[Constants & Utility]▮▮▮▮▮▮▮
C, U, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XItem, XDie, XAnimVars
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
// 🟪🟪🟪 XArm: Helper XItem Used to Position Rotating XItems in XOrbits 🟪🟪🟪
class XArm extends XItem {
    constructor(xItem, parentOrbit) {
        super(parentOrbit, {
            id: "arm"
            // keepID: true
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
export var XOrbitType;
(function (XOrbitType) {
    XOrbitType["Main"] = "Main";
    XOrbitType["Inner"] = "Inner";
    XOrbitType["Outer"] = "Outer";
})(XOrbitType || (XOrbitType = {}));
export class XOrbit extends XGroup {
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
        _XOrbit_rotationScaling.set(this, void 0);
        _XOrbit_rotationAngle.set(this, void 0);
        _XOrbit_rotationDuration.set(this, void 0);
        _XOrbit_radiusRatio.set(this, void 0);
        __classPrivateFieldSet(this, _XOrbit_radiusRatio, radiusRatio, "f");
        __classPrivateFieldSet(this, _XOrbit_rotationScaling, Math.abs(rotationScaling), "f");
        __classPrivateFieldSet(this, _XOrbit_rotationAngle, rotationScaling > 0 ? "+=360" : "-=360", "f");
        __classPrivateFieldSet(this, _XOrbit_rotationDuration, 10 * __classPrivateFieldGet(this, _XOrbit_radiusRatio, "f") * __classPrivateFieldGet(this, _XOrbit_rotationScaling, "f"), "f");
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-orbit"]
        });
    }
    get arms() { return Array.from(this.xKids); }
    get xItems() { return this.arms.map((xArm) => xArm.xItem); }
    get radiusRatio() { return __classPrivateFieldGet(this, _XOrbit_radiusRatio, "f"); }
    set radiusRatio(radiusRatio) {
        __classPrivateFieldSet(this, _XOrbit_radiusRatio, radiusRatio, "f");
        if (this.isRendered) {
            this.updateArms();
        }
    }
    get orbitRadius() { return this.radiusRatio * 0.5 * this.xParent.width; }
    startRotating() {
        const [{ type, ...animVars }] = XAnimVars.rotateXPool({
            xGroup: this,
            rotation: __classPrivateFieldGet(this, _XOrbit_rotationAngle, "f"),
            duration: __classPrivateFieldGet(this, _XOrbit_rotationDuration, "f")
        });
        this.to(animVars);
    }
    updateArms(duration = 0.5) {
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
_XOrbit_rotationScaling = new WeakMap(), _XOrbit_rotationAngle = new WeakMap(), _XOrbit_rotationDuration = new WeakMap(), _XOrbit_radiusRatio = new WeakMap();
export class XPool extends XGroup {
    constructor(xParent, { orbitals = U.objClone(C.xGroupOrbitalDefaults), ...xOptions }) {
        super(xParent, xOptions);
        _XPool_core.set(this, []);
        _XPool_orbitals.set(this, new Map());
        _XPool_orbitalWeights.set(this, new Map());
        _XPool_orbitalSpeeds.set(this, new Map());
        for (const [orbitName, { radiusRatio, rotationScaling }] of Object.entries(orbitals)) {
            __classPrivateFieldGet(this, _XPool_orbitalWeights, "f").set(orbitName, radiusRatio);
            __classPrivateFieldGet(this, _XPool_orbitalSpeeds, "f").set(orbitName, rotationScaling);
            __classPrivateFieldGet(this, _XPool_orbitals, "f").set(orbitName, new XOrbit(orbitName, this, radiusRatio, rotationScaling));
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
    get orbitals() { return __classPrivateFieldGet(this, _XPool_orbitals, "f"); }
    get xOrbits() { return Array.from(this.orbitals.values()); }
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
_XPool_core = new WeakMap(), _XPool_orbitals = new WeakMap(), _XPool_orbitalWeights = new WeakMap(), _XPool_orbitalSpeeds = new WeakMap();
XPool.REGISTRY = new Map();
export class XRoll extends XPool {
    constructor(xParent, xOptions) {
        super(xParent, xOptions);
        _XRoll_hasRolled.set(this, false);
    }
    get hasRolled() { return __classPrivateFieldGet(this, _XRoll_hasRolled, "f"); }
    get diceRolls() {
        if (this.hasRolled) {
            return this.getXKids(XDie, true).map((xDie) => (xDie).value || 0);
        }
        return [];
    }
    // Rolls all XDie in the XRoll.
    rollDice(isForcingReroll = false) {
        if (isForcingReroll || !__classPrivateFieldGet(this, _XRoll_hasRolled, "f")) {
            __classPrivateFieldSet(this, _XRoll_hasRolled, true, "f");
            const xDice = this.getXKids(XDie, true).forEach(async (xKid) => {
                const vars = {};
                ["fadeDieText", "pulseRolledDie"].forEach((animName) => {
                    vars[animName] = XAnimVars[animName]({ xItem: xKid });
                    delete vars[animName].type;
                    delete vars[animName].timestamp;
                });
                xKid.to(vars.fadeDieText)
                    .roll();
                xKid.to();
                this.runGSAPSequence([""]);
                gsap.timeline()
                    .fadeDieText(`#${this.id} .x-die`)
                    .call(() => xDice.map((xDie) => xDie.roll()))
                    .pulseRolledDie(`#${this.id} .x-die`);
            });
        }
    }
}
_XRoll_hasRolled = new WeakMap();
XRoll.REGISTRY = new Map();