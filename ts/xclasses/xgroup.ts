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
	Dir
	// #endregion ▮▮▮▮[Enums]▮▮▮▮
} from "../helpers/bundler.js";
import type {XItemOptions, XDieValue} from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮
/*DEVCODE*/
// #region ▮▮▮▮▮▮▮ [SCHEMA] Breakdown of Classes & Subclasses ▮▮▮▮▮▮▮ ~
/* SCHEMA SORTA:
							🟥 - Squares indicate classes that implement the XTerm interface

		💠XTerm = an interface describing necessary elements for an XItem to serve as an XTerm in an XPool

		🟢XItem = an object linking a renderable Application to an XElem, passing most XElem setters & animation methods through
				🔺<DOMRenderer>XElem = linked to an XItem, governs DOM element directly
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
// #region 🟩🟩🟩 XGroup: Any XItem That Can Contain Child XItems 🟩🟩🟩
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
	static override async Make(xParent: XGroup, xOptions: Partial<XGroupOptions>, onRenderOptions: Partial<gsap.CSSProperties>): Promise<XGroup> {
		return await XItem.Make(xParent, xOptions, onRenderOptions) as XGroup;
	}
	static override REGISTRY: Map<string, XItem> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-group"]}) }
	override get xParent(): XGroup | null { return (super.xParent as XGroup) ?? null }
	get xItems() { return Array.from(this.xKids) }

	constructor(xParent: XItem | null, xOptions: Partial<XGroupOptions>, renderOptions: Partial<gsap.CSSProperties> = {}) {
		super(xParent, xOptions, renderOptions);
	}
}
// #endregion ▄▄▄▄▄ XGroup ▄▄▄▄▄

// #region 🟩🟩🟩 XROOT: Base Container for All XItems - Only XItem that Doesn't Need an XParent 🟩🟩🟩
export class XROOT extends XGroup {
	static override async Make(): Promise<XROOT> {
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
	override get xParent() { return null }
	constructor() {
		super(null, {id: "XROOT"}, {xPercent: -50, yPercent: -50});
	}
}
// #endregion 🟩🟩🟩 XROOT 🟩🟩🟩

// #region 🟪🟪🟪 XArm: Helper XItem Used to Position Rotating XItems in XOrbits 🟪🟪🟪 ~
export class XArm extends XItem {
	static override async Make(heldItem: XItem, xParent: XOrbit): Promise<XItem> {
		const xArm = await super.Make(xParent, {id: "-"}, {
			height: 0,
			width: 0,
			transformOrigin: "0% 50%",
			top: "50%",
			left: "50%",
			xPercent: 0,
			yPercent: 0
		}) as XArm;
		xArm.xItem = heldItem;
		return xArm.grabItem();
	}
	static override REGISTRY: Map<string, XArm> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-arm"]}) }
	override get xParent(): XOrbit { return super.xParent as XOrbit }

	xItem!: XItem;

	grabItem(): XItem {
		this.set({width: this.distanceToHeldItem, rotation: this.rotation + this.angleToHeldItem});
		this.adopt(this.xItem);
		this.xItem.set({x: 0, y: 0});
		return this.xItem;
	}

	override async initialize(): Promise<this> {
		await super.initialize();
		this.set({
			"--held-item-width": `${this.xItem.width}px`
		});
		return this;
	}

	get positionOfHeldItem(): Point {
		// if (!this.xItem.isInitialized) { return this.xItem.pos }
		return MotionPathPlugin.getRelativePosition(this.xParent.elem, this.xItem.elem, [0.5, 0.5], [0.5, 0.5]);
	}
	get distanceToHeldItem() {
		// if (!this.xItem.isInitialized) { return this.xParent.orbitRadius }
		return U.getDistance({x: 0, y: 0}, this.positionOfHeldItem);
	}
	get angleToHeldItem() {
		return U.getAngleDelta(this.global.rotation, U.getAngle({x: 0, y: 0}, this.positionOfHeldItem));
	}

	get rotWidthToGrab() {
		const {x: xDist, y: yDist} = MotionPathPlugin.getRelativePosition(this.xParent.elem, this.xItem.elem, [0.5, 0.5], [0.5, 0.5]);
		// Total Distance
		const distToFloat = U.getDistance({x: 0, y: 0}, {x: xDist, y: yDist});
		// Angle from Arm origin to target die
		const angleToFloat = U.getAngle({x: 0, y: 0}, {x: xDist, y: yDist});
		// Get global Arm rotation
		const curAngle = this.global.rotation;
		// Get rotation delta
		const angleDelta = U.getAngleDelta(curAngle, angleToFloat);
		// Adjust local arm rotation angle and width to match
		return {
			width: distToFloat,
			rotation: this.rotation + angleDelta
		};
	}

	async snapToXItem() {
		this.set(this.rotWidthToGrab);
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
export class XOrbit extends XGroup {

	static override async Make(
		parentGroup: XPool,
		{
			name,
			radiusRatio,
			rotationScaling
		}: Partial<XGroupOptions & XOrbitSpecs>,
		onRenderOptions: Partial<gsap.CSSProperties>
	) {
		name ??= XOrbitType.Main;
		radiusRatio ??= C.xGroupOrbitalDefaults[name].radiusRatio;
		rotationScaling ??= C.xGroupOrbitalDefaults[name].rotationScaling;
		const xOrbit = await super.Make(parentGroup, {
			id: name
		}, {
			height: parentGroup.height,
			width: parentGroup.width,
			left: 0.5 * parentGroup.width,
			top: 0.5 * parentGroup.height,
			...onRenderOptions
		}) as XOrbit;
		xOrbit.initializeRadius({ratio: radiusRatio, scale: rotationScaling});
		return xOrbit;
	}
	static override REGISTRY: Map<string, XOrbit> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-orbit"]}) }
	override get xParent(): XPool { return super.xParent as XPool }

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
	// override get xItems(): XItem[] { return this.arms.map((xArm) => xArm.xItem) }
	get xTerms(): Array<XItem & XTerm> { return this.xItems.filter((xItem) => xItem instanceof XDie || xItem instanceof XMod) as Array<XItem & XTerm> }

	get orbitRadius() { return this.radiusRatio * 0.5 * (this.xParent?.width ?? 0) }
	get totalArmWeight() { return this.arms.map((arm) => arm.orbitWeight).reduce((tot, val) => tot + val, 0) }
	get armAngles() {
		const anglePerWeight = 360 / this.totalArmWeight;
		const armAngles: number[] = [];
		let usedWeight = 0;
		this.arms.forEach((arm) => {
			usedWeight += arm.orbitWeight;
			armAngles.push((usedWeight - (0.5 * arm.orbitWeight)) * anglePerWeight);
		});
		return armAngles;
	}

	constructor(name: XOrbitType, parentGroup: XPool, radiusRatio?: number, rotationScaling?: number) {
		radiusRatio ??= C.xGroupOrbitalDefaults[name].radiusRatio;
		rotationScaling ??= C.xGroupOrbitalDefaults[name].rotationScaling;
		super(parentGroup, {id: name}, {
			height: parentGroup.height,
			width: parentGroup.width,
			left: 0.5 * parentGroup.width,
			top: 0.5 * parentGroup.height
		});
		this.#orbitType = name;
		this.#radiusRatio = radiusRatio;
		this.#rotationScaling = Math.abs(rotationScaling);
		this.#rotationAngle = rotationScaling > 0 ? "+=360" : "-=360";
		this.#rotationDuration = 10 * this.#radiusRatio * this.#rotationScaling;
	}

	protected startRotating(duration = 10) {
		this.to({
			id: "rotationTween",
			rotation: this.#rotationAngle,
			duration,
			repeat: -1,
			ease: "none",
			callbackScope: this,
			onUpdate() {
				this.xTerms.forEach((xItem: XItem & XTerm) => {
					if (xItem.xOptions.isFreezingRotate && xItem.xParent) {
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
		await Promise.all(this.arms.map((xArm) => xArm.initialize()));
		this.startRotating();
		return Promise.resolve(this);
	}

	#isArmed = false;
	protected updateArms(duration = 3, widthOverride?: number) {
		if (this.updateArmsThrottle) {
			clearTimeout(this.updateArmsThrottle);
		}
		this.updateArmsThrottle = setTimeout(() => {
			DB.log("Update Arms RUNNING!");
			const self = this;
			gsap.timeline()
				.fromTo(
					this.arms$,
					this.#isArmed
						? {}
						: {
								width: (widthOverride ?? this.orbitRadius) * 1.5,
								rotation(i) { return self.armAngles[i] },
								opacity: 0,
								scale: 2
							},
					{
						width: widthOverride ?? this.orbitRadius,
						ease: "back.out(4)",
						duration,
						stagger: {
							amount: 1,
							from: "end"
						}
					},
					"<"
				)
				.to(this.arms$, {
					scale: 1,
					opacity: 1,
					duration: duration / 3,
					ease: "power2.out"
				}, "<")
				.to(this.arms$, {
					rotation(i) { return self.armAngles[i] },
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

	async addXItem<T extends XItem>(xItem: T, isUpdatingArms = true): Promise<T> {
		const xArm = await XArm.Make(xItem, this);
		if (this.isInitialized) {
			await xArm.initialize();
			if (isUpdatingArms) {
				this.updateArms();
			}
		}
		return Promise.resolve(xItem);
	}

	async addXItems<T extends XItem>(xItems: T[]): Promise<T[]> {
		await Promise.allSettled(xItems.map((xItem) => this.addXItem(xItem, false)));
		this.updateArms();
		return Promise.resolve(xItems);
	}
}
// #endregion ▄▄▄▄▄ XOrbit ▄▄▄▄▄

// #region 🟥🟥🟥 XPool: An XGroup Containing Drag-&-Droppable XTerms Contained in XOrbits 🟥🟥🟥 ~
export interface XPoolOptions extends XGroupOptions {
	orbitals?: Partial<Record<XOrbitType, XOrbitSpecs>>;
}
export class XPool extends XGroup {
	static override async Make(xParent: XGroup, xOptions: Partial<XPoolOptions>, onRenderOptions: Partial<gsap.CSSProperties>): Promise<XPool> {
		return await super.Make(xParent, xOptions, onRenderOptions) as XPool;
	}
	static override REGISTRY: Map<string, XPool> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-pool"]}) }
	override get xParent(): XGroup { return super.xParent as XGroup }

	#core: XItem[] = [];
	#orbitals?: Map<XOrbitType, XOrbit>;
	#orbitalWeights: Map<XOrbitType, number> = new Map();
	#orbitalSpeeds: Map<XOrbitType, number> = new Map();

	get orbitals() { return this.#orbitals ?? new Map() }
	get xOrbits(): XOrbit[] { return Array.from(this.orbitals.values()) }

	constructor(xParent: XItem, {orbitals, ...xOptions}: Partial<XPoolOptions>, onRenderOptions: Partial<gsap.CSSProperties>) {
		orbitals ??= Object.fromEntries(Object.entries(U.objClone(C.xGroupOrbitalDefaults)).map(([name, data]) => ([name, {name, ...data}])));
		super(xParent, xOptions, onRenderOptions);
		for (const [orbitName, {radiusRatio, rotationScaling}] of Object.entries(orbitals)) {
			this.#orbitalWeights.set(orbitName as XOrbitType, radiusRatio);
			this.#orbitalSpeeds.set(orbitName as XOrbitType, rotationScaling);

		}
	}

	override async initialize(onRenderOptions: Partial<gsap.CSSProperties> = {}): Promise<this> {
		if (this.initializePromise) { return this.initializePromise }
		await super.initialize(onRenderOptions);
		this.#orbitals ??= new Map();
		await Promise.all(Array.from(this.#orbitalWeights).map(async ([orbitName, orbitWeight]: [XOrbitType, number]) => {
			const orbitSpeed = this.#orbitalSpeeds.get(orbitName)!;
			const xOrbit = await XOrbit.Make(this, {
				name: orbitName,
				radiusRatio: orbitWeight,
				rotationScaling: orbitSpeed
			}, {});
			return xOrbit.initialize();
		}));
		return Promise.resolve(this);
	}

	async addXItem(xItem: XItem, orbit: XOrbitType) {
		const orbital = this.orbitals.get(orbit);
		return orbital?.addXItem(xItem);
	}

	async addXItems(xItemsByOrbit: Partial<Record<XOrbitType, XItem[]>>) {
		return Promise.allSettled(Object.entries(xItemsByOrbit)
			.map(async ([orbitName, xItems]) => await this.orbitals.get(orbitName as XOrbitType)?.addXItems(xItems)));
	}

	public pauseRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.pauseRotating()) }
	public playRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.playRotating()) }
}
// #endregion ▄▄▄▄▄ XPool ▄▄▄▄▄

// #region 🟥🟥🟥 XRoll: An XPool That Can Be Rolled, Its Child XTerms Evaluated Into a Roll Result 🟥🟥🟥 ~
export interface XRollOptions extends XPoolOptions { }
export class XRoll extends XPool {
	static override async Make(xParent: XGroup, xOptions: Partial<XRollOptions>, onRenderOptions: Partial<gsap.CSSProperties>): Promise<XRoll> {
		return await super.Make(xParent, xOptions, onRenderOptions) as XRoll;
	}
	static override REGISTRY: Map<string, XRoll> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-roll"]}) }
	override get xParent(): XGroup { return super.xParent as XGroup }

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

	constructor(xParent: XGroup, xOptions: Partial<XRollOptions>, onRenderOptions: Partial<gsap.CSSProperties> = {}) {
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
	static override async Make(xParent: XGroup, xOptions: Partial<XSourceOptions>, onRenderOptions: Partial<gsap.CSSProperties>): Promise<XSource> {
		return await super.Make(xParent, xOptions, onRenderOptions) as XSource;
	}
	static override REGISTRY: Map<string, XSource> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-source"]}) }
	override get xParent(): XGroup { return super.xParent as XGroup }

	constructor(xParent: XItem, xOptions: XSourceOptions, onRenderOptions: Partial<gsap.CSSProperties> = {}) {
		super(xParent, xOptions, onRenderOptions);
	}
}
// #endregion ▄▄▄▄▄ XRoll ▄▄▄▄▄
