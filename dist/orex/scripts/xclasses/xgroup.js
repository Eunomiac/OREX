
// ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮
import { 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
C, U, DB, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XItem, XDie, XMod, 
FACTORIES } from "../helpers/bundler.js";
export default class XGroup extends XItem {

    // static override async Make(xParent: XGroup, xOptions: Partial<XGroupOptions>, onRenderOptions: Partial<gsap.CSSProperties>): Promise<XGroup> {
    // 	return await XItem.Make(xParent, xOptions, onRenderOptions) as XGroup;
    // }
    static REGISTRY = new Map();
    static get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-group"] }); }
    #xKids = new Set();
    get xKids() { return this.#xKids; }
    get hasKids() { return this.xKids.size > 0; }
    registerXKid(xKid) { this.xKids.add(xKid); }
    unregisterXKid(xKid) { this.xKids.delete(xKid); }
    getXKids(classRef, isGettingAll = false) {
        const xKids = Array.from(this.xKids.values())
            .flat()
            .filter(U.FILTERS.IsInstance(classRef));
        if (isGettingAll) {
            xKids.push(...xKids
                .map((xKid) => (xKid instanceof XGroup ? xKid.getXKids(classRef, true) : []))
                .flat());
        }
        return xKids;
    }
    // override async initialize(renderOptions: Partial<gsap.CSSProperties> = {}): Promise<typeof this> {
    // 	await super.initialize(renderOptions);
    // 	return Promise.allSettled(this.getXKids(XItem).map((xItem) => xItem.initialize({})))
    // 		.then(
    // 			() => Promise.resolve(this),
    // 			() => Promise.reject()
    // 		);
    // }
    async addXItem(xItem) {
        this.adopt(xItem);
        return xItem;
    }
    async addXItems(xItems) {
        return Promise.allSettled(xItems.map((xItem) => this.addXItem(xItem)))
            .then(() => Promise.resolve(xItems), () => Promise.reject());
    }
    constructor(xParent, xOptions, renderOptions = {}) {
        super(xParent, xOptions, renderOptions);
    }
}
// 🟩🟩🟩 XROOT: Base Container for All XItems - Only XItem that Doesn't Need an XParent 🟩🟩🟩
export class XROOT extends XGroup {
    static async Make() {
        XROOT.XROOT?.kill();
        XROOT.#XROOT = new XROOT();
        await XROOT.#XROOT.render();
        await XROOT.#XROOT.initialize();
        return XROOT.#XROOT;
    }
    static REGISTRY = new Map();
    static get defaultOptions() {
        return {
            ...XItem.defaultOptions,
            classes: ["XROOT"]
        };
    }
    static #XROOT;
    static get XROOT() { return XROOT.#XROOT; }
    static async InitializeXROOT() { return XROOT.Make(); }
    constructor() {
        super(null, { id: "XROOT" }, { xPercent: 0, yPercent: 0 });
    }
}
export class XArm extends XGroup {
    static REGISTRY = new Map();
    static get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-arm"] }); }
    xItem;
    grabItem(xItem, isInitializing = false) {
        if (xItem instanceof XItem) {
            this.xItem = xItem;
            this.#heldItemSize = xItem.size ?? xItem.width;
            this.set({
                "--held-item-width": `${this.#heldItemSize}px`,
                ...this.getRotWidthToItem(xItem)
                // "outline": "2px dotted red"
            });
            this.adopt(xItem, false);
            this.xItem.set({ x: 0, y: 0, rotation: -1 * this.global.rotation });
            if (!isInitializing) {
                this.to({
                    width: this.homeWidth,
                    rotation: this.homeAngle,
                    duration: 10,
                    ease: "power3.inOut"
                });
            }
            return this.xItem;
        }
        return xItem;
    }
    toHomeTween;
    tweenToHome(armNum, duration, isFadingIn = false) {
        if (isFadingIn) {
            return gsap.timeline({ delay: armNum * 0.5 })
                .fromTo(this.elem, {
                width: this.homeWidth * 10,
                rotation: this.homeAngle - 50
            }, {
                width: this.homeWidth,
                rotation: this.homeAngle,
                duration,
                ease: "bounce"
            }, 0)
                .fromTo(this.xItem.elem, {
                opacity: 0,
                scale: 5,
                rotation: -1 * this.global.rotation
            }, {
                opacity: 1,
                scale: 1,
                duration: duration / 1.5,
                ease: "power2",
                callbackScope: this,
                onUpdate() {
                    if (this.xItem.isFreezingRotate) {
                        this.xItem.set({ rotation: -1 * this.global.rotation });
                    }
                }
            }, 0);
        }
        // First, if WIDTH is incorrect, assume you've just grabbed something and just return the toHomeTween unchanged.
        if (U.pInt(this.width) !== U.pInt(this.homeWidth)) {
            if (!this.toHomeTween?.isActive?.() || !this.toHomeTween?.vars?.width) {
                this.toHomeTween = this.to({
                    width: this.homeWidth,
                    rotation: this.homeAngle,
                    duration,
                    ease: "power2"
                });
            }
        }
        else {
            this.toHomeTween = this.to({
                rotation: this.homeAngle,
                duration,
                ease: "sine.inOut"
            });
        }
        return this.toHomeTween;
    }
    async render() {
        await super.render();
        this.set({ height: 0, width: this.homeWidth, rotation: 0 });
        return this;
    }
    #heldItemSize;
    get heldItemSize() {
        return this.xItem?.size ?? this.#heldItemSize;
    }
    constructor(xParent, { heldItemSize, ...xOptions }, renderOptions = {}) {
        renderOptions.transformOrigin = "right";
        renderOptions.right = xParent.width / 2;
        renderOptions.top = xParent.height / 2;
        renderOptions.height = 0;
        renderOptions.width = xParent.orbitRadius;
        renderOptions.rotation = 0;
        delete renderOptions.left;
        xOptions.id ??= "arm";
        super(xParent, xOptions, renderOptions);
        this.#heldItemSize = heldItemSize;
    }
    get homeWidth() { return this.xParent.orbitRadius; }
    get homeAngle() { return this.xParent.armAngles.get(this); }
    get positionOfHeldItem() {
        // if (!this.xItem.isInitialized()) { return this.xItem.pos }
        return MotionPathPlugin.getRelativePosition(this.xParent.elem, this.xItem.elem, [0.5, 0.5], [0.5, 0.5]);
    }
    get distanceToHeldItem() {
        // if (!this.xItem.isInitialized()) { return this.xParent.orbitRadius }
        return U.getDistance({ x: 0, y: 0 }, this.positionOfHeldItem);
    }
    get angleToHeldItem() {
        return U.getAngleDelta(this.global.rotation, U.getAngle({ x: 0, y: 0 }, this.positionOfHeldItem));
    }
    get rotWidthToGrab() {
        return this.getRotWidthToItem(this.xItem);
    }
    getRotWidthToItem(xItem) {
        const { x: xDist, y: yDist } = MotionPathPlugin.getRelativePosition(this.xParent.elem, xItem.elem, [0.5, 0.5], [0.5, 0.5]);
        // Total Distance
        const distToFloat = U.getDistance({ x: 0, y: 0 }, { x: xDist, y: yDist });
        // Angle from Arm origin to target die
        const angleToFloat = U.getAngle({ x: 0, y: 0 }, { x: xDist, y: yDist }, undefined, [-180, 180]);
        // Get global Arm rotation
        const curAngle = U.cycleAngle(this.global.rotation - 180, [-180, 180]);
        // Get rotation delta
        const angleDelta = U.getAngleDelta(curAngle, angleToFloat, [-180, 180]);
        // Adjust local arm rotation angle and width to match
        return {
            width: distToFloat,
            rotation: this.rotation + angleDelta
        };
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
    static get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-orbit"] }); }
    #radiusRatio;
    get radiusRatio() { return this.#radiusRatio; }
    set radiusRatio(radiusRatio) {
        this.#radiusRatio = radiusRatio;
        if (this.isRendered) {
            this.updateArms();
        }
    }
    #rotationScaling = C.xGroupOrbitalDefaults[XOrbitType.Main].rotationScaling;
    #rotationAngle = "+=360";
    #rotationDuration = 10 * C.xGroupOrbitalDefaults[XOrbitType.Main].radiusRatio * C.xGroupOrbitalDefaults[XOrbitType.Main].rotationScaling;
    initializeRadius({ ratio, scale } = {}) {
        ratio ??= C.xGroupOrbitalDefaults[this.orbitType].radiusRatio;
        scale ??= C.xGroupOrbitalDefaults[this.orbitType].rotationScaling;
        this.#radiusRatio = ratio;
        this.#rotationScaling = scale;
        this.#rotationAngle = scale > 0 ? "+=360" : "-=360";
        this.#rotationDuration = 10 * ratio * scale;
    }
    #orbitType;
    get orbitType() { return this.#orbitType; }
    get arms$() { return $(`#${this.id} > .x-arm`); }
    get arms() { return Array.from(this.xKids); }
    get xItems$() { return $(`#${this.id} > .x-arm > .x-item`); }
    get xItems() { return this.arms.map((xArm) => xArm.xItem); }
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
    constructor(xParent, { name, radiusRatio, rotationScaling, ...xOptions }, onRenderOptions) {
        radiusRatio ??= C.xGroupOrbitalDefaults[name].radiusRatio;
        rotationScaling ??= C.xGroupOrbitalDefaults[name].rotationScaling;
        super(xParent, xOptions, {
            height: xParent.height,
            width: xParent.width,
            left: 0.5 * xParent.width,
            top: 0.5 * xParent.height,
            ...onRenderOptions
        });
        this.#orbitType = name;
        this.#radiusRatio = radiusRatio;
        this.#rotationScaling = Math.abs(rotationScaling);
        this.#rotationAngle = rotationScaling > 0 ? "+=360" : "-=360";
        this.#rotationDuration = 10 * this.#radiusRatio * this.#rotationScaling;
    }
    startRotating(duration = 10) {
        // return;
        DB.title("STARTING ROTATING");
        this.tweens.rotationTween = this.to({
            id: "rotationTween",
            rotation: this.#rotationAngle,
            duration,
            repeat: -1,
            ease: "none",
            callbackScope: this,
            onUpdate() {
                this.xTerms.forEach((xItem) => {
                    if (xItem.xOptions.isFreezingRotate && xItem.xParent instanceof XArm) {
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
        this.startRotating();
        // await Promise.all(this.arms.map((xArm) => xArm.initialize()));
        this.updateArms();
        return Promise.resolve(this);
    }
    #isArmed = false;
    updateArms(duration = 3, widthOverride) {
        if (this.updateArmsThrottle) {
            clearTimeout(this.updateArmsThrottle);
        }
        this.updateArmsThrottle = setTimeout(() => {
            DB.log("Update Arms RUNNING!", { targets: this.arms$, isArmed: this.#isArmed });
            const self = this;
            const updateTimeline = gsap.timeline({
                stagger: {
                    amount: 0.5,
                    from: "start"
                }
            });
            if (!this.#isArmed) {
                updateTimeline
                    .set(this.arms$, {
                    width: (widthOverride ?? this.orbitRadius) * 10,
                    rotation(i) { return Array.from(self.armAngles.values())[i] - 50; }
                }, 0)
                    .to(this.xItems$, {
                    scale: 5,
                    duration: 0,
                    ease: "none",
                    immediateRender: true
                }, 0)
                    .to(this.xItems$, {
                    id: "XItems_fadeDownAndIn",
                    opacity: 1,
                    scale: 1,
                    duration: duration / 1.5,
                    ease: "power2",
                    callbackScope: this,
                    onUpdate() {
                        this.xTerms.forEach((xItem) => {
                            if (xItem.xOptions.isFreezingRotate) {
                                xItem.set({ rotation: -1 * xItem.xParent.global.rotation });
                            }
                        });
                    }
                }, 0)
                    .from(this.tweens.rotationTween, {
                    id: "XOrbitTween_fromRotationTimeScale",
                    timeScale: 15,
                    duration,
                    ease: "power2"
                }, 0);
                this.#isArmed = true;
            }
            updateTimeline
                .to(this.arms$, {
                id: "XArms_toOrbitRadius",
                width: widthOverride ?? this.orbitRadius,
                ease: "back.out(0.9)",
                duration
            }, "<")
                .to(this.arms$, {
                id: "XArms_toArmAngles",
                rotation(i) { return Array.from(self.armAngles.values())[i]; },
                ease: "power2.out",
                duration
            }, "<");
            // GSDevTools.create({
            // 	animation: updateTimeline,
            // 	css: {
            // 		width: "80%",
            // 		bottom: "100px",
            // 		left: "10px"
            // 	},
            // 	// globalSync: true
            // 	// timeScale: 0.1,
            // 	// paused: true
            // });
        }, 100);
    }
    async adopt(xArm) {
        super.adopt(xArm, false);
        this.updateArmAngles();
    }
    async addXItem(xItem, isUpdatingArms = true) {
        const xArm = await FACTORIES.XArm.Make(this);
        await xArm.grabItem(xItem);
        // await xArm.initialize();
        this.updateArmAngles();
        if (isUpdatingArms) {
            this.updateArms();
        }
        return Promise.resolve(xItem);
    }
    async addXItems(xItems) {
        await Promise.allSettled(xItems.map((xItem) => this.addXItem(xItem, false)))
            .then(() => this.updateArms());
        return Promise.resolve(xItems);
    }
}
export class XPool extends XGroup {
    static REGISTRY = new Map();
    static get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-pool"] }); }
    #core = [];
    #orbitals = new Map();
    #orbitalSpecs = new Map();
    get orbitals() { return this.#orbitals; }
    get xOrbits() { return Array.from(this.orbitals.values()); }
    constructor(xParent, { orbitals, ...xOptions }, onRenderOptions) {
        orbitals ??= Object.fromEntries(Object.entries(U.objClone(C.xGroupOrbitalDefaults)).map(([name, data]) => ([name, { name, ...data }])));
        super(xParent, xOptions, onRenderOptions);
        for (const [orbitName, orbitSpecs] of Object.entries(orbitals)) {
            this.#orbitalSpecs.set(orbitName, orbitSpecs);
        }
    }
    async createOrbital(name) {
        if (this.#orbitals.has(name)) {
            return this.#orbitals.get(name);
        }
        const xOrbit = await FACTORIES.XOrbit.Make(this, { id: name, ...this.#orbitalSpecs.get(name) }, {
            height: this.height,
            width: this.width,
            left: 0.5 * this.width,
            top: 0.5 * this.height,
            xPercent: -50,
            yPercent: -50
        });
        this.#orbitals.set(name, xOrbit);
        const { radiusRatio, rotationScaling } = this.#orbitalSpecs.get(name) ?? {};
        if (typeof radiusRatio === "number" && typeof rotationScaling === "number") {
            xOrbit.initializeRadius({ ratio: radiusRatio, scale: rotationScaling });
        }
        // if (this.isInitialized()) {
        // 	await xOrbit.initialize();
        // }
        return xOrbit;
    }
    async addXItem(xItem, orbit = XOrbitType.Main) {
        if (xItem) {
            let orbital = this.orbitals.get(orbit);
            if (!orbital) {
                orbital = await this.createOrbital(orbit);
            }
            xItem = await orbital.addXItem(xItem);
        }
        return xItem;
    }
    async addXItems(xItemsByOrbit) {
        if (Array.isArray(xItemsByOrbit)) {
            xItemsByOrbit = {
                [XOrbitType.Main]: [...xItemsByOrbit]
            };
        }
        const returnItems = [];
        return Promise.allSettled(Object.entries(xItemsByOrbit)
            .map(async ([orbitName, xItems]) => {
            let orbital = this.orbitals.get(orbitName);
            if (!orbital) {
                orbital = await this.createOrbital(orbitName);
            }
            returnItems.push(...xItems);
            return this.orbitals.get(orbitName).addXItems(xItems);
        }))
            .then(() => Promise.resolve(returnItems), () => Promise.reject());
    }
    pauseRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.pauseRotating()); }
    playRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.playRotating()); }
}
export class XRoll extends XPool {
    static REGISTRY = new Map();
    static get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-roll"] }); }
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
    constructor(xParent, xOptions, onRenderOptions = {}) {
        super(xParent, xOptions, onRenderOptions);
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
    static REGISTRY = new Map();
    static get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-source"] }); }
    constructor(xParent, xOptions, onRenderOptions = {}) {
        super(xParent, xOptions, onRenderOptions);
    }
}