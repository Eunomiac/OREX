// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
	C, U, DB,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
	XItem, XTerm,
	XTermType,
	XDie,
	XMod,
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Enums]▮▮▮▮▮▮▮
	Dir,
	// #endregion ▮▮▮▮[Enums]▮▮▮▮
	FACTORIES
} from "../helpers/bundler.js";
import type {XItemOptions, XDieValue} from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮
/*DEVCODE*/
// #region ▮▮▮▮▮▮▮ [SCHEMA] Breakdown of Classes & Subclasses ▮▮▮▮▮▮▮ ~
/* SCHEMA SORTA:
							🟥 - Squares indicate classes that implement the XTerm interface

		💠XTerm = an interface describing necessary elements for an XItem to serve as an XTerm in an XPool

		🟢XItem = an object linking a renderable Application to an XElem, passing most XElem setters & animation methods through
				🔺<Tweenable>XElem = linked to an XItem, governs DOM element directly
			🔵XGroup = any XItem intended to contain other XItems.
				🟣XPool = an XGroup containing top-level drag&droppable XTerms, arranged into orbits and animated
						🔺XGroup.XOrbit = a single orbital containing XItems and parented to an XPool
							🔺XGroup.XArm = an element holding and rotating a single XItem
					🟡XRoll = an XPool that can be rolled, its XTerms evaluated and reanimated as a roll result
					🟡XSource = an XPool containing XTerms meant to be taken and dragged onto other XRolls
					🟡XSink = an XPool meant to drop evaluated XTerms to spend them for some benefit
					🟨XSet = a collection of grouped XTerms that itself serves as a single XTerm component of an XRoll (e.g. a set)
									- XSets have to be given priority when it comes to rendering, since one die could belong to, say, a run and a set
			🟦XDie = a single die, either rolled or unrolled
			🟦XMod = a term representing some effect on any XGroup it is contained in
				🟨XGhost = a modifier represented by a bonus XItem rendered in its XGroup
				🟨XMutator = a modifier that attaches to an existing XItem to change/negate it
				🟨XInfo = a strictly informational XTerm to be rendered and animated
			🔵XPad = a hover-over time trigger that applies some effect to a held (dragged-over) XItem
*/
// #endregion ▮▮▮▮[SCHEMA]▮▮▮▮
/*!DEVCODE*/
// #region 🟩🟩🟩 XGroup: Any XItem That Can Contain Child XItems 🟩🟩🟩 ~
export interface XGroupOptions extends XItemOptions { }
export default class XGroup extends XItem {
	/*
	static override async Make(xParent: XG, xOptions: Partial<XGOptions>, onRenderOptions: Partial<gsap.CSSProperties>): Promise<XG> {
		return await super.Make(xParent, xOptions, onRenderOptions) as XG;
	}
	static override REGISTRY: Map<string, XG> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, { classes: ["x-g"] }) }
	override get xParent(): XG { return super.xParent as XG }
	*/
	// static override async Make(xParent: XGroup, xOptions: Partial<XGroupOptions>, onRenderOptions: Partial<gsap.CSSProperties>): Promise<XGroup> {
	// 	return await XItem.Make(xParent, xOptions, onRenderOptions) as XGroup;
	// }
	static override REGISTRY: Map<string, XItem> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-group"]}) }

	#xKids: Set<XItem> = new Set();
	get xKids(): Set<XItem> { return this.#xKids }
	get hasKids() { return this.xKids.size > 0 }
	registerXKid(xKid: XItem) { this.xKids.add(xKid) }
	unregisterXKid(xKid: XItem) { this.xKids.delete(xKid) }
	getXKids<X extends XItem>(classRef: ConstructorOf<X>, isGettingAll = false): X[] {
		const xKids: X[] = Array.from(this.xKids.values())
			.flat()
			.filter(U.FILTERS.IsInstance(classRef)) as X[];
		if (isGettingAll) {
			xKids.push(...xKids
				.map((xKid) => (xKid instanceof XGroup ? xKid.getXKids(classRef, true) : []))
				.flat());
		}
		return xKids;
	}
	override async initialize(renderOptions: Partial<gsap.CSSProperties> = {}): Promise<typeof this> {
		await super.initialize(renderOptions);
		return Promise.allSettled(this.getXKids(XItem).map((xItem) => xItem.initialize({})))
			.then(
				() => Promise.resolve(this),
				() => Promise.reject()
			);
	}
	async addXItem<T extends XItem>(xItem: T): Promise<T> {
		this.adopt(xItem);
		return xItem;
	}
	async addXItems<T extends XItem>(xItems: T[]): Promise<T[]> {
		return Promise.allSettled(xItems.map((xItem) => this.addXItem(xItem)))
			.then(
				() => Promise.resolve(xItems),
				() => Promise.reject()
			);
	}

	constructor(xParent: XGroup | null, xOptions: XGroupOptions, renderOptions: Partial<gsap.CSSProperties> = {}) {
		super(xParent, xOptions, renderOptions);
	}
}
// #endregion ▄▄▄▄▄ XGroup ▄▄▄▄▄

// #region 🟩🟩🟩 XROOT: Base Container for All XItems - Only XItem that Doesn't Need an XParent 🟩🟩🟩 ~
export class XROOT extends XGroup {
	static async Make(): Promise<XROOT> {
		XROOT.XROOT?.kill();
		XROOT.#XROOT = new XROOT();
		await XROOT.#XROOT.render();
		await XROOT.#XROOT.initialize();
		return XROOT.#XROOT;
	}
	static override REGISTRY: Map<string, XROOT> = new Map();
	static override get defaultOptions(): ApplicationOptions & XGroupOptions {
		return {
			...XItem.defaultOptions,
			classes: ["XROOT"]
		};
	}

	static #XROOT: XROOT;
	static get XROOT() { return XROOT.#XROOT }
	static async InitializeXROOT(): Promise<XROOT> { return XROOT.Make() }
	declare xParent: null;
	constructor() {
		super(null, {id: "XROOT"}, {xPercent: 0, yPercent: 0});
	}
}
// #endregion 🟩🟩🟩 XROOT 🟩🟩🟩

// #region 🟪🟪🟪 XArm: Helper XItem Used to Position Rotating XItems in XOrbits 🟪🟪🟪 ~
export class XArm extends XGroup {
	static override REGISTRY: Map<string, XArm> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-arm"]}) }
	declare xParent: XOrbit;

	xItem!: XItem;

	grabItem(isTweening = false): XItem {
		this.snapToXItem();
		this.adopt(this.xItem);
		this.xItem.set({x: 0, y: 0, rotation: -1 * this.global.rotation});
		if (this.isInitialized() && isTweening) {
			this.to({
				width: this.targetWidth,
				rotation: this.targetRotation,
				duration: 10,
				ease: "power3.inOut"
			});
		}
		return this.xItem;
	}

	async grabItemTest(xItem: XItem) {
		gsap.globalTimeline.timeScale(0.02);
		this.set({outline: "2px dotted black", opacity: 0.8});
		await this.snapToXItem(xItem);
		this.adopt(xItem);
		xItem.set({x: 0, y: 0, rotation: -1 * this.global.rotation});
		this.to({
			width: this.targetWidth,
			rotation: this.targetRotation,
			duration: 10,
			ease: "power3.inOut"
		});
	}

	constructor(xParent: XOrbit, xOptions: Partial<XItemOptions> = {}, renderOptions: Partial<gsap.CSSProperties> = {}) {
		renderOptions.transformOrigin = "right";
		renderOptions.right = xParent.width / 2;
		renderOptions.top = xParent.height / 2;
		delete renderOptions.left;
		xOptions.id ??= "arm";
		super(xParent, xOptions as XItemOptions, renderOptions);
	}

	override async initialize(): Promise<this> {
		await super.initialize();
		this.set({
			"--held-item-width": `${this.xItem.width}px`
		});
		return this;
	}

	get targetWidth() { return this.xParent.orbitRadius }
	get targetRotation() { return this.xParent.armAngles.get(this.id) }

	get positionOfHeldItem(): Point {
		// if (!this.xItem.isInitialized()) { return this.xItem.pos }
		return MotionPathPlugin.getRelativePosition(this.xParent.elem, this.xItem.elem, [0.5, 0.5], [0.5, 0.5]);
	}
	get distanceToHeldItem() {
		// if (!this.xItem.isInitialized()) { return this.xParent.orbitRadius }
		return U.getDistance({x: 0, y: 0}, this.positionOfHeldItem);
	}
	get angleToHeldItem() {
		return U.getAngleDelta(this.global.rotation, U.getAngle({x: 0, y: 0}, this.positionOfHeldItem));
	}

	get rotWidthToGrab() {
		return this.getRotWidthToItem(this.xItem);
	}

	getRotWidthToItem(xItem: XItem) {
		const {x: xDist, y: yDist} = MotionPathPlugin.getRelativePosition(this.xParent.elem, xItem.elem, [0.5, 0.5], [0.5, 0.5]);
		// Total Distance
		const distToFloat = U.getDistance({x: 0, y: 0}, {x: xDist, y: yDist});
		// Angle from Arm origin to target die
		const angleToFloat = U.getAngle({x: 0, y: 0}, {x: xDist, y: yDist}, undefined, [-180, 180]);
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

	async snapToXItem(xItem: XItem = this.xItem) {
		this.set(this.getRotWidthToItem(xItem));
	}

	get orbitWeight() { return this.xItem.size }
}
// #endregion ░░░░[XArm]░░░░

// #region 🟥🟥🟥 XOrbit: A Single Orbital Containing XItems & Parented to an XPool 🟥🟥🟥 ~
export type XOrbitSpecs = {
	name: XOrbitType,
	radiusRatio: number,
	rotationScaling: number
}
export enum XOrbitType {
	Main = "Main",
	Inner = "Inner",
	Outer = "Outer"
}
export interface XOrbitOptions extends XGroupOptions, XOrbitSpecs { }
export class XOrbit extends XGroup {

	static override REGISTRY: Map<string, XOrbit> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-orbit"]}) }
	declare xParent: XPool;

	#radiusRatio: number;
	get radiusRatio() { return this.#radiusRatio }
	set radiusRatio(radiusRatio) {
		this.#radiusRatio = radiusRatio;
		if (this.isRendered) {
			this.updateArms();
		}
	}
	#rotationScaling: number = C.xGroupOrbitalDefaults[XOrbitType.Main].rotationScaling;
	#rotationAngle: "+=360" | "-=360" = "+=360";
	#rotationDuration: number = 10 * C.xGroupOrbitalDefaults[XOrbitType.Main].radiusRatio * C.xGroupOrbitalDefaults[XOrbitType.Main].rotationScaling;

	initializeRadius({ratio, scale}: {ratio?: number, scale?: number} = {}) {
		ratio ??= C.xGroupOrbitalDefaults[this.orbitType].radiusRatio;
		scale ??= C.xGroupOrbitalDefaults[this.orbitType].rotationScaling;
		this.#radiusRatio = ratio;
		this.#rotationScaling = scale;
		this.#rotationAngle = scale > 0 ? "+=360" : "-=360";
		this.#rotationDuration = 10 * ratio * scale;
	}

	#orbitType: XOrbitType;
	get orbitType() { return this.#orbitType }
	get arms$() { return $(`#${this.id} > .x-arm`) }
	get arms() { return Array.from(this.xKids) as XArm[] }
	get xItems$() { return $(`#${this.id} > .x-arm > .x-item`)}
	get xItems(): XItem[] { return this.arms.map((xArm) => xArm.xItem) }
	get xTerms(): Array<XItem & XTerm> { return this.xItems.filter((xItem) => xItem instanceof XDie || xItem instanceof XMod) as Array<XItem & XTerm> }

	get orbitRadius() { return this.radiusRatio * 0.5 * (this.xParent?.width ?? 0) }

	#armAngles?: Map<string,number>;
	get armAngles() {
		if (!this.arms?.length) { return new Map() }
		return this.#armAngles ?? this.updateArmAngles();
	}
	updateArmAngles(): Map<string,number> {
		const totalArmWeight = this.arms.map((arm) => arm.orbitWeight).reduce((tot, val) => tot + val, 0);
		const anglePerWeight = 360 / totalArmWeight;
		this.#armAngles = new Map();
		let usedWeight = 0;
		this.arms.forEach((arm) => {
			usedWeight += arm.orbitWeight;
			this.#armAngles!.set(arm.id, (usedWeight - (0.5 * arm.orbitWeight)) * anglePerWeight);
		});
		return this.#armAngles;
	}

	constructor(xParent: XPool, {name, radiusRatio, rotationScaling, ...xOptions}: XOrbitOptions, onRenderOptions: Partial<gsap.CSSProperties>) {
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

	protected startRotating(duration = 10) {
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
				this.xTerms.forEach((xItem: XItem & XTerm) => {
					if (xItem.xOptions.isFreezingRotate && xItem.xParent instanceof XArm) {
						xItem.set({rotation: -1 * xItem.xParent.global.rotation});
					}
				});
			}
		});
	}
	protected updateArmsThrottle?: NodeJS.Timeout;
	public pauseRotating() {
		this.xElem.tweens.rotationTween?.pause();
	}
	public playRotating() {
		this.xElem.tweens.rotationTween?.play();
	}

	override async initialize(): Promise<this> {
		await super.initialize();
		this.startRotating();
		await Promise.all(this.arms.map((xArm) => xArm.initialize()));
		this.updateArms();
		return Promise.resolve(this);
	}

	#isArmed = false;
	protected updateArms(duration = 3, widthOverride?: number) {
		if (this.updateArmsThrottle) {
			clearTimeout(this.updateArmsThrottle);
		}
		this.updateArmsThrottle = setTimeout(() => {
			DB.log("Update Arms RUNNING!", {targets: this.arms$, isArmed: this.#isArmed});
			const self = this;
			const updateTimeline = gsap.timeline({
				stagger: {
					amount: 0.5,
					from: "start"
				}});
			if (!this.#isArmed) {
				updateTimeline
					.set(
						this.arms$,
						{
							width: (widthOverride ?? this.orbitRadius) * 10,
							rotation(i) { return Array.from(self.armAngles.values())[i] - 50 }
						},
						0
					)
					.to(
						this.xItems$,
						{
							scale: 5,
							duration: 0,
							ease: "none",
							immediateRender: true
						},
						0
					)
					.to(
						this.xItems$,
						{
							id: "XItems_fadeDownAndIn",
							opacity: 1,
							scale: 1,
							duration: duration / 1.5,
							ease: "power2",
							callbackScope: this,
							onUpdate() {
								this.xTerms.forEach((xItem: XItem & XTerm) => {
									if (xItem.xOptions.isFreezingRotate) {
										xItem.set({rotation: -1 * xItem.xParent.global.rotation});
									}
								});
							}
						},
						0
					)
					.from(
						this.tweens.rotationTween,
						{
							id: "XOrbitTween_fromRotationTimeScale",
							timeScale: 15,
							duration,
							ease: "power2"
						},
						0
					);
				this.#isArmed = true;
			}
			updateTimeline
				.to(
					this.arms$,
					{
						id: "XArms_toOrbitRadius",
						width: widthOverride ?? this.orbitRadius,
						ease: "back.out(0.9)",
						duration
					},
					"<"
				)
				.to(this.arms$, {
					id: "XArms_toArmAngles",
					rotation(i) { return Array.from(self.armAngles.values())[i] },
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

	override async addXItem<T extends XItem>(xItem: T, isUpdatingArms = true): Promise<T> {
		const xArm = await FACTORIES.XArm.Make(this);
		xArm.xItem = xItem;
		xArm.grabItem();
		this.updateArmAngles();
		if (this.isInitialized()) {
			await xArm.initialize();
			if (isUpdatingArms) {
				this.updateArms();
			}
		}
		return Promise.resolve(xItem);
	}

	override async addXItems<T extends XItem>(xItems: T[]): Promise<T[]> {
		await Promise.allSettled(xItems.map((xItem) => this.addXItem(xItem, false)))
			.then(() => this.updateArms());
		return Promise.resolve(xItems);
	}
}
// #endregion ▄▄▄▄▄ XOrbit ▄▄▄▄▄

// #region 🟥🟥🟥 XPool: An XGroup Containing Drag-&-Droppable XTerms Contained in XOrbits 🟥🟥🟥 ~
export interface XPoolOptions extends XGroupOptions {
	orbitals?: Partial<Record<XOrbitType, XOrbitSpecs>>;
}
export class XPool extends XGroup {
	static override REGISTRY: Map<string, XPool> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-pool"]}) }
	declare xParent: XGroup;

	#core: XItem[] = [];
	#orbitals: Map<XOrbitType, XOrbit> = new Map();
	#orbitalSpecs: Map<XOrbitType, XOrbitSpecs> = new Map();

	get orbitals() { return this.#orbitals }
	get xOrbits(): XOrbit[] { return Array.from(this.orbitals.values()) }

	constructor(xParent: XGroup, {orbitals, ...xOptions}: XPoolOptions, onRenderOptions: Partial<gsap.CSSProperties>) {
		orbitals ??= Object.fromEntries(Object.entries(U.objClone(C.xGroupOrbitalDefaults)).map(([name, data]) => ([name, {name, ...data}])));
		super(xParent, xOptions, onRenderOptions);
		for (const [orbitName, orbitSpecs] of Object.entries(orbitals) as Array<[XOrbitType, XOrbitSpecs]>) {
			this.#orbitalSpecs.set(orbitName, orbitSpecs);
		}
	}

	async createOrbital(name: XOrbitType): Promise<XOrbit> {
		if (this.#orbitals.has(name)) { return this.#orbitals.get(name)! }
		const xOrbit = await FACTORIES.XOrbit.Make(this, {id: name, ...this.#orbitalSpecs.get(name)}, {
			height: this.height,
			width: this.width,
			left: 0.5 * this.width,
			top: 0.5 * this.height,
			xPercent: -50,
			yPercent: -50
		});
		this.#orbitals.set(name, xOrbit);
		const {radiusRatio, rotationScaling} = this.#orbitalSpecs.get(name) ?? {};
		if (typeof radiusRatio === "number" && typeof rotationScaling === "number") {
			xOrbit.initializeRadius({ratio: radiusRatio, scale: rotationScaling});
		}
		if (this.isInitialized()) {
			await xOrbit.initialize();
		}
		return xOrbit;
	}

	override async addXItem<T extends XItem>(xItem: T, orbit: XOrbitType = XOrbitType.Main): Promise<T> {
		let orbital = this.orbitals.get(orbit);
		if (!orbital) {
			orbital = await this.createOrbital(orbit);
		}
		const addedItem = await orbital.addXItem(xItem);
		return addedItem;
	}
	override async addXItems<T extends XItem>(xItemsByOrbit: Partial<Record<XOrbitType, T[]>> | T[]): Promise<T[]> {
		if (Array.isArray(xItemsByOrbit)) {
			xItemsByOrbit = {
				[XOrbitType.Main]: [...xItemsByOrbit]
			};
		}
		const returnItems: T[] = [];
		return Promise.allSettled((Object.entries(xItemsByOrbit) as Array<[XOrbitType, T[]]>)
			.map(async ([orbitName, xItems]) => {
				let orbital = this.orbitals.get(orbitName);
				if (!orbital) {
					orbital = await this.createOrbital(orbitName);
				}
				returnItems.push(...xItems);
				return this.orbitals.get(orbitName)!.addXItems(xItems);
			}))
			.then(
				() => Promise.resolve(returnItems),
				() => Promise.reject()
			);
	}
	public pauseRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.pauseRotating()) }
	public playRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.playRotating()) }
}
// #endregion ▄▄▄▄▄ XPool ▄▄▄▄▄

// #region 🟥🟥🟥 XRoll: An XPool That Can Be Rolled, Its Child XTerms Evaluated Into a Roll Result 🟥🟥🟥 ~
export interface XRollOptions extends XPoolOptions { }
export class XRoll extends XPool {
	static override REGISTRY: Map<string, XRoll> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-roll"]}) }
	declare xParent: XGroup;

	#hasRolled = false;
	get hasRolled() { return this.#hasRolled }
	get diceRolls(): XDieValue[] {
		if (this.hasRolled) {
			return this.getXKids(XDie, true).map((xDie) => (xDie).value);
		}
		return [];
	}

	get dice$() { return $(`#${this.id} .x-die`) }
	get diceVals$() { return $(`#${this.id} .x-die .die-val`) }

	constructor(xParent: XGroup, xOptions: XRollOptions, onRenderOptions: Partial<gsap.CSSProperties> = {}) {
		super(xParent, xOptions, onRenderOptions);
	}

	// Rolls all XDie in the XRoll.
	rollDice(isForcingReroll = false, isAnimating = true) {
		if (isForcingReroll || !this.#hasRolled) {
			this.#hasRolled = true;
			const xDice = this.getXKids(XDie, true);
			if (isAnimating) {
				gsap.timeline(({stagger: 0.1}))
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
			} else {
				xDice.forEach((xDie) => xDie.roll());
			}
		}
	}

	// #region ████████ Roll Results: Parsing & Analyzing Roll Results ████████ ~
	getValsInOrbit(orbital: XOrbitType): XDieValue[] {
		return this.orbitals.get(orbital)?.xTerms.map((xTerm: XItem & XTerm) => xTerm.value ?? 0) ?? [];
	}
	get mainVals(): XDieValue[] { return this.getValsInOrbit(XOrbitType.Main) }
	get sets() {
		const dieVals = this.mainVals.sort();
		const setDice = dieVals.filter((val) => dieVals.filter((v) => v === val).length > 1);
		const setGroups: XDieValue[][] = [];
		while (setDice.length) {
			const dieVal = setDice.pop() as XDieValue;
			const groupIndex = setGroups.findIndex(([groupVal]) => groupVal === dieVal);
			if (groupIndex >= 0) {
				setGroups[groupIndex].push(dieVal);
			} else {
				setGroups.push([dieVal]);
			}
		}
		return setGroups;
	}
	// #endregion ▄▄▄▄▄ Roll Results ▄▄▄▄▄

}
// #endregion ▄▄▄▄▄ XRoll ▄▄▄▄▄

// #region 🟥🟥🟥 XSource: An XPool containing XItems that players can grab and use 🟥🟥🟥 ~
export interface XSourceOptions extends XPoolOptions { }
export class XSource extends XPool {
	static override REGISTRY: Map<string, XSource> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-source"]}) }
	declare xParent: XGroup;

	constructor(xParent: XGroup, xOptions: XSourceOptions, onRenderOptions: Partial<gsap.CSSProperties> = {}) {
		super(xParent, xOptions, onRenderOptions);
	}
}
// #endregion ▄▄▄▄▄ XRoll ▄▄▄▄▄
