// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
	C, U, DB,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
	XBaseContainer,
	XItem, XTerm,
	XTermType,
	XDie,
	XMod,
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Enums]▮▮▮▮▮▮▮
	Dir
	// #endregion ▮▮▮▮[Enums]▮▮▮▮
} from "../helpers/bundler.js";
import type {XDieValue} from "../helpers/bundler.js";
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
export default class XGroup extends XBaseContainer {
	static override get defaultOptions() {
		return U.objMerge(
			super.defaultOptions,
			{
				classes: ["x-group"],
				isFreezingRotate: false
			}
		) as XOptions.Group;
	}

	static override REGISTRY: Map<string, XGroup> = new Map();
	declare xParent: XParent;
	declare options: XOptions.Group;
}
// #endregion ▄▄▄▄▄ XGroup ▄▄▄▄▄


// #region 🟪🟪🟪 XArm: Helper XItem Used to Position Rotating XItems in XOrbits 🟪🟪🟪 ~

export class XArm extends XGroup {
	static override get defaultOptions() {
		return U.objMerge(
			super.defaultOptions,
			{
				classes: ["x-arm"],
				heldItemSize: 0
			}
		) as XOptions.Arm;
	}

	static override REGISTRY: Map<string, XArm> = new Map();
	declare xParent: XOrbit;
	declare options: XOptions.Arm;

	xItem!: XItem;

	grabItem(xItem: XItem, isInitializing = false): XItem {
		if (xItem instanceof XItem) {
			this.xItem = xItem;
			this.#heldItemSize = xItem.size ?? xItem.width;
			this.set({
				"--held-item-width": `${this.#heldItemSize}px`,
				...this.getRotWidthToItem(xItem)
			});
			this.adopt(xItem);
			this.xItem.set({x: 0, y: 0, rotation: -1 * this.global.rotation});
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

	toHomeTween?: gsap.core.Tween;
	tweenToHome(armNum: number, duration: number, isFadingIn = false): Anim {
		if (isFadingIn) {
			return gsap.timeline({delay: armNum * 0.5})
				.fromTo(
					this.elem,
					{
						width: this.homeWidth * 10,
						rotation: this.homeAngle - 50
					},
					{
						width: this.homeWidth,
						rotation: this.homeAngle,
						duration,
						ease: "bounce"
					},
					0
				)
				.fromTo(
					this.xItem.elem,
					{
						opacity: 0,
						scale: 5,
						rotation: -1 * this.global.rotation
					},
					{
						opacity: 1,
						scale: 1,
						duration: duration / 1.5,
						ease: "power2",
						callbackScope: this,
						onUpdate() {
							if (this.xItem.isFreezingRotate) {
								this.xItem.set({rotation: -1 * this.global.rotation});
							}
						}
					},
					0
				);
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
		} else {
			this.toHomeTween = this.to({
				rotation: this.homeAngle,
				duration,
				ease: "sine.inOut"
			});
		}
		return this.toHomeTween;
	}

	override async render(): Promise<typeof this> {
		await super.render();
		this.set({height: 0, width: this.homeWidth, rotation: 0});
		return this;
	}

	#heldItemSize: number;
	get heldItemSize() {
		return this.xItem?.size ?? this.#heldItemSize;
	}

	constructor(xOptions: Partial<XOptions.Arm>) {
		xOptions.vars ??= {};
		xOptions.vars.transformOrigin = "right";
		xOptions.vars.right = xOptions.xParent.width / 2;
		xOptions.vars.top = xOptions.xParent.height / 2;
		xOptions.vars.height = 0;
		xOptions.vars.width = xOptions.xParent.orbitRadius;
		xOptions.vars.rotation = 0;
		delete xOptions.vars.left;
		xOptions.id ??= "arm";
		super(xOptions);
		this.#heldItemSize = xOptions.heldItemSize ?? 0;
	}

	get homeWidth() { return this.xParent.orbitRadius }
	get homeAngle() { return this.xParent.armAngles.get(this) }

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
}
// #endregion ░░░░[XArm]░░░░

// #region 🟥🟥🟥 XOrbit: A Single Orbital Containing XItems & Parented to an XPool 🟥🟥🟥 ~
export interface XOrbitOptions extends XOptions.Group, XOrbitSpecs { }
export class XOrbit extends XGroup {

	static override REGISTRY: Map<string, XOrbit> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-orbit"]}) }
	declare xParent: XPool;
	declare options: XOptions.Orbit;

	#radiusRatio: number;
	get radiusRatio() { return this.#radiusRatio }
	set radiusRatio(radiusRatio) {
		this.#radiusRatio = radiusRatio;
		if (this.rendered) {
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

	#armAngles?: Map<XArm,number>;
	get armAngles() {
		if (!this.arms?.length) { return new Map() }
		return this.#armAngles ?? this.updateArmAngles();
	}
	updateArmAngles(): Map<XArm,number> {
		const totalArmWeight = this.arms.map((arm) => arm.heldItemSize).reduce((tot, val) => tot + val, 0);
		const anglePerWeight = 360 / totalArmWeight;
		this.#armAngles = new Map();
		let usedWeight = 0;
		this.arms.forEach((arm) => {
			usedWeight += arm.heldItemSize;
			this.#armAngles!.set(arm, (usedWeight - (0.5 * arm.heldItemSize)) * anglePerWeight);
		});
		return this.#armAngles;
	}

	constructor(xOptions: XOptions.Orbit) {
		xOptions.radiusRatio ??= C.xGroupOrbitalDefaults[xOptions.name as XOrbitType].radiusRatio;
		xOptions.rotationScaling ??= C.xGroupOrbitalDefaults[xOptions.name as XOrbitType].rotationScaling;
		xOptions.vars = {
			height: xOptions.xParent.height,
			width: xOptions.xParent.width,
			left: 0.5 * xOptions.xParent.width,
			top: 0.5 * xOptions.xParent.height,
			...xOptions.vars
		};
		super(xOptions);
		this.#orbitType = xOptions.name as XOrbitType;
		this.#radiusRatio = xOptions.radiusRatio;
		this.#rotationScaling = Math.abs(xOptions.rotationScaling);
		this.#rotationAngle = xOptions.rotationScaling > 0 ? "+=360" : "-=360";
		this.#rotationDuration = 10 * this.#radiusRatio * this.#rotationScaling;
	}


	protected startRotating(duration = 10) {
		DB.title("STARTING ROTATING");
		const self = this;
		this.tweens.rotationTween = this.to({
			id: "rotationTween",
			rotation: this.#rotationAngle,
			duration,
			repeat: -1,
			ease: "none",
			callbackScope: this,
			onUpdate() {
				self.xTerms.forEach((xItem: XItem & XTerm) => {
					if (xItem.options.isFreezingRotate && xItem.xParent instanceof XArm) {
						xItem.set({rotation: -1 * xItem.xParent.global.rotation});
					}
				});
			}
		});
	}
	protected updateArmsThrottle?: NodeJS.Timeout;
	public pauseRotating() {
		this.tweens.rotationTween?.pause();
	}
	public playRotating() {
		this.tweens.rotationTween?.play();
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
									if (xItem.options.isFreezingRotate) {
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

	override async adopt<T extends XItem>(xItem: T): Promise<T & XKid>
	override async adopt<T extends XItem>(xItem: T[]): Promise<Array<T & XKid>> {
		const [heldItem] = [xItem].flat();
		const xArm = new XArm({xParent: this, heldItem});
		super.adopt(xArm);
		this.updateArmAngles();
		xArm.adopt(heldItem);
		return xItem;
	}
	// override async addXItem<T extends XItem>(xItem: T, isUpdatingArms = true): Promise<T> {
	// 	const xArm = await FACTORIES.XArm.Make(this);
	// 	await xArm.grabItem(xItem);
	// 	// await xArm.initialize();
	// 	this.updateArmAngles();
	// 	if (isUpdatingArms) {
	// 		this.updateArms();
	// 	}
	// 	return Promise.resolve(xItem);
	// }

	// override async addXItems<T extends XItem>(xItems: T[]): Promise<T[]> {
	// 	await Promise.allSettled(xItems.map((xItem) => this.addXItem(xItem, false)))
	// 		.then(() => this.updateArms());
	// 	return Promise.resolve(xItems);
	// }
}
// #endregion ▄▄▄▄▄ XOrbit ▄▄▄▄▄

// #region 🟥🟥🟥 XPool: An XGroup Containing Drag-&-Droppable XTerms Contained in XOrbits 🟥🟥🟥 ~
export interface XPoolOptions extends XOptions.Group {
}
export class XPool extends XGroup {
	static override REGISTRY: Map<string, XPool> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-pool"]}) }
	declare xParent: XGroup;
	declare options: XOptions.Pool;

	#core: XItem[] = [];
	#orbitals: Map<XOrbitType, XOrbit> = new Map();
	#orbitalSpecs: Map<XOrbitType, XOrbitSpecs> = new Map();

	get orbitals() { return this.#orbitals }
	get xOrbits(): XOrbit[] { return Array.from(this.orbitals.values()) }

	constructor(xOptions: Partial<XOptions.Pool>) {
	// constructor(xParent: XGroup, {orbitals, ...xOptions}: XPoolOptions, onRenderOptions: Partial<gsap.CSSProperties>) {
		xOptions.orbitals ??= Object.fromEntries(Object.entries(U.objClone(C.xGroupOrbitalDefaults)).map(([name, data]) => ([name, {name, ...data}])));
		super(xOptions);
		for (const [orbitName, orbitSpecs] of Object.entries(xOptions.orbitals) as Array<[XOrbitType, XOrbitSpecs]>) {
			this.#orbitalSpecs.set(orbitName, orbitSpecs);
		}
	}

	override async adopt

	// override async addXItem<T extends XItem>(xItem: T, orbit: XOrbitType = XOrbitType.Main): Promise<T> {
	// 	if (xItem) {
	// 		let orbital = this.orbitals.get(orbit);
	// 		if (!orbital) {
	// 			orbital = await this.createOrbital(orbit);
	// 		}
	// 		xItem = await orbital.addXItem(xItem);
	// 	}
	// 	return xItem;
	// }
	// override async addXItems<T extends XItem>(xItemsByOrbit: Partial<Record<XOrbitType, T[]>> | T[]): Promise<T[]> {
	// 	if (Array.isArray(xItemsByOrbit)) {
	// 		xItemsByOrbit = {
	// 			[XOrbitType.Main]: [...xItemsByOrbit]
	// 		};
	// 	}
	// 	const returnItems: T[] = [];
	// 	return Promise.allSettled((Object.entries(xItemsByOrbit) as Array<[XOrbitType, T[]]>)
	// 		.map(async ([orbitName, xItems]) => {
	// 			let orbital = this.orbitals.get(orbitName);
	// 			if (!orbital) {
	// 				orbital = await this.createOrbital(orbitName);
	// 			}
	// 			returnItems.push(...xItems);
	// 			return this.orbitals.get(orbitName)!.addXItems(xItems);
	// 		}))
	// 		.then(
	// 			() => Promise.resolve(returnItems),
	// 			() => Promise.reject()
	// 		);
	// }

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
		// if (this.isInitialized()) {
		// 	await xOrbit.initialize();
		// }
		return xOrbit;
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
