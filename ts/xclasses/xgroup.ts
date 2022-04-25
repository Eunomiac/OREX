// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
	C, U, DB,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
	XBaseContainer,
	XOrbitType,
	XROOT,
	XItem,
	XDie,
	XMod
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
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
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions() {
		const defaultXOptions: XOptions.Group = {
			id: "??-XGroup-??",
			classes: ["x-group"],
			xParent: XROOT.XROOT,
			isFreezingRotate: false,
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions as Required<XOptions.Group>,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XGroup> = new Map();
	declare options: Required<XOptions.Group>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮
}
// #endregion ▄▄▄▄▄ XGroup ▄▄▄▄▄


// #region 🟪🟪🟪 XArm: Helper XItem Used to Position Rotating XItems in XOrbits 🟪🟪🟪 ~

const MAXWIDTHTWEENDURATION = 3;
const MAXANGLETWEENDURATION = 6;
const MINWIDTHTOTWEEN = 10;
const MINANGLETOTWEEN = 5;
const ARMFADEINDURATION = 3;
export class XArm extends XGroup {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions() {
		const defaultXOptions: Omit<XOptions.Arm, "xParent"|"heldItem"> = {
			id: "XArm",
			classes: ["x-arm"],
			template: U.getTemplatePath("xarm"),
			isFreezingRotate: false,
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions as Required<XOptions.Arm>,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XArm> = new Map();
	declare options: Required<XOptions.Arm>;
	declare xParent: XOrbit;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	// get armNum() { return this.xParent.getArmNumber(this) }

	#isFadingIn = false;
	tweenFadeIn(delay = 0): void {
		if (this.#isFadingIn) { return }
		this.#isFadingIn = true;
		const self = this;
		gsap.timeline({delay})
			.fromTo(
				this.elem,
				{
					width: this.homeWidth * 10,
					rotation: this.homeAngle - 50
				},
				{
					width: this.homeWidth,
					rotation: this.homeAngle,
					duration: ARMFADEINDURATION,
					ease: "bounce",
					onComplete() {
						self.#isFadingIn = false;
						self.tweenToHomeWidth();
						self.tweenToHomeAngle();
					}
				},
				0
			)
			.fromTo(
				this.heldItem.elem,
				{
					opacity: 0,
					scale: 5,
					rotation: -1 * this.global.rotation
				},
				{
					opacity: 1,
					scale: 1,
					duration: ARMFADEINDURATION / 1.5,
					ease: "power2"
				},
				0
			);
	}
	#toHomeWidthTween?: gsap.core.Timeline;
	get toHomeWidthTween(): gsap.core.Timeline {
		const self = this;
		return (this.#toHomeWidthTween = this.#toHomeWidthTween
			?? gsap.timeline({paused: true})
				.to(
					this.elem,
					{
						width() { return this.homeWidth },
						duration: MAXWIDTHTWEENDURATION,
						ease: "power2",
						onComplete() { self.tweenToHomeWidth() }
					}
				));
	}
	tweenToHomeWidth() {
		if (this.#isFadingIn) { return }
		this.toHomeWidthTween.invalidate();
		this.toHomeWidthTween.restart();
		this.toHomeWidthTween.pause();
		const deltaWidth = Math.abs(this.homeWidth - this.width);
		if (deltaWidth <= MINWIDTHTOTWEEN) {
			this.set({width: this.homeWidth});
		}
		const timeScale = 1 / gsap.utils.clamp(0.25, 1, deltaWidth / this.homeWidth);
		this.toHomeWidthTween.timeScale(timeScale);
		this.toHomeWidthTween.play();
	}

	#toHomeAngleTween?: gsap.core.Timeline;
	get toHomeAngleTween(): gsap.core.Timeline {
		const self = this;
		return (this.#toHomeAngleTween = this.#toHomeAngleTween
			?? gsap.timeline({paused: true})
				.to(
					this.elem,
					{
						rotation() { return this.homeAngle },
						duration: MAXANGLETWEENDURATION,
						ease: "sine.inOut",
						onComplete() { self.tweenToHomeAngle() }
					}
				)
		);
	}
	tweenToHomeAngle() {
		if (this.#isFadingIn) { return }
		this.toHomeAngleTween.invalidate();
		this.toHomeAngleTween.restart();
		this.toHomeAngleTween.pause();
		const deltaAngle = Math.abs(this.homeAngle - this.rotation);
		if (deltaAngle <= MINANGLETOTWEEN) {
			this.set({rotation: this.homeAngle});
		}
		const timeScale = 1 / gsap.utils.clamp(0.05, 1, deltaAngle / 360);
		this.toHomeAngleTween.timeScale(timeScale);
		this.toHomeAngleTween.play();
	}

	override async render(): Promise<typeof this> {
		await super.render();
		this.adopt(this.heldItem);
		if (this.heldItem.isVisible) {
			this.snapToHeldItem();
			this.tweenToHomeWidth();
			this.tweenToHomeAngle();
		} else {
			this.tweenFadeIn();
		}
		// this.set({height: 0, width: this.homeWidth, rotation: 0});
		return this;
	}

	#heldItem: XItem;
	get heldItem() { return this.#heldItem }
	get heldItemSize() {
		return this.heldItem.size;
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
		super(xOptions);
		this.#heldItem = xOptions.heldItem;
	}

	get homeWidth() { return this.xParent.orbitRadius }
	get homeAngle() { return this.xParent.getArmAngle(this) ?? gsap.utils.random(-180, 180) }

	get positionOfHeldItem(): Point {
		return MotionPathPlugin.getRelativePosition(this.xParent.elem, this.heldItem.elem, [0.5, 0.5], [0.5, 0.5]);
	}
	get distanceToHeldItem() {
		return U.getDistance({x: 0, y: 0}, this.positionOfHeldItem);
	}
	get angleToHeldItem() {
		return U.getAngleDelta(
			U.cycleAngle(this.global.rotation - 180, [-180, 180]),
			U.getAngle({x: 0, y: 0}, this.positionOfHeldItem, undefined, [-180, 180]),
			[-180, 180]
		);
	}

	snapToHeldItem() {
		const heldItemSetParams: XStyleVars = {x: 0, y: 0};
		if (this.heldItem.isFreezingRotate) {
			heldItemSetParams.rotation = -1 * this.global.rotation;
		}
		this.heldItem.set(heldItemSetParams);
		this.set({
			width: this.distanceToHeldItem,
			rotation: this.rotation + this.angleToHeldItem
		});
	}
}
// #endregion ░░░░[XArm]░░░░

// #region 🟥🟥🟥 XOrbit: A Single Orbital Containing XItems & Parented to an XPool 🟥🟥🟥 ~
export class XOrbit extends XGroup {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions() {
		const defaultXOptions: Omit<XOptions.Orbit, "xParent"> = {
			id: "??-XGroup-??",
			name: XOrbitType.Main,
			classes: ["x-orbit"],
			isFreezingRotate: false,
			radiusRatio: 1,
			rotationScaling: 1,
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions as Required<XOptions.Orbit>,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XOrbit> = new Map();
	declare options: Required<XOptions.Orbit>;
	declare xParent: XPool;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

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

	#orbitType: XOrbitType;
	get orbitType() { return this.#orbitType }
	get arms$() { return $(`#${this.id} > .x-arm`) }
	get arms() { return this.xKids as XArm[] }
	get xItems(): XItem[] { return this.arms.map((xArm) => xArm.heldItem) }
	get xTerms(): Array<XItem & XTerm> { return this.xItems.filter((xItem) => xItem instanceof XDie || xItem instanceof XMod) as Array<XItem & XTerm> }

	get orbitRadius() { return this.radiusRatio * 0.5 * (this.xParent?.width ?? 0) }

	#armAngles?: Map<XArm,number>;
	get armAngles(): Map<XArm, number> {
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

	constructor(xOptions: Partial<XOptions.Orbit>) {
		xOptions.name ??= XOrbitType.Main;
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

	// public getArmNumber(xArm: XArm) {
	// 	return this.arms.findIndex((arm) => arm.id === xArm.id);
	// }
	public getArmAngle(xArm: XArm) {
		if (!this.armAngles.has(xArm)) {
			this.updateArmAngles();
		}
		return this.armAngles.get(xArm);
	}

	protected fadeInArms() {
		this.updateArmAngles();
		let armNum = 0;
		for (const xArm of this.armAngles.keys()) {
			xArm.tweenFadeIn(armNum * 0.5);
			armNum++;
		}
	}

	protected updateArms() {
		this.updateArmAngles();
		this.arms.forEach((xArm) => {
			xArm.tweenToHomeWidth();
			xArm.tweenToHomeAngle();
		});
	}
	// if (this.updateArmsThrottle) {
	// 	clearTimeout(this.updateArmsThrottle);
	// }
	// this.updateArmsThrottle = setTimeout(() => {
	// 	DB.log("Update Arms RUNNING!", {targets: this.arms$, isArmed: this.#isArmed});
	// 	const self = this;
	// 	const updateTimeline = gsap.timeline({
	// 		stagger: {
	// 			amount: 0.5,
	// 			from: "start"
	// 		}});
	// 	if (!this.#isArmed) {
	// 		updateTimeline
	// 			.set(
	// 				this.arms$,
	// 				{
	// 					width: (widthOverride ?? this.orbitRadius) * 10,
	// 					rotation(i) { return Array.from(self.armAngles.values())[i] - 50 }
	// 				},
	// 				0
	// 			)
	// 			.to(
	// 				this.xItems$,
	// 				{
	// 					scale: 5,
	// 					duration: 0,
	// 					ease: "none",
	// 					immediateRender: true
	// 				},
	// 				0
	// 			)
	// 			.to(
	// 				this.xItems$,
	// 				{
	// 					id: "XItems_fadeDownAndIn",
	// 					opacity: 1,
	// 					scale: 1,
	// 					duration: duration / 1.5,
	// 					ease: "power2",
	// 					callbackScope: this,
	// 					onUpdate() {
	// 						this.xTerms.forEach((xItem: XItem & XTerm) => {
	// 							if (xItem.options.isFreezingRotate) {
	// 								xItem.set({rotation: -1 * xItem.xParent.global.rotation});
	// 							}
	// 						});
	// 					}
	// 				},
	// 				0
	// 			)
	// 			.from(
	// 				this.tweens.rotationTween,
	// 				{
	// 					id: "XOrbitTween_fromRotationTimeScale",
	// 					timeScale: 15,
	// 					duration,
	// 					ease: "power2"
	// 				},
	// 				0
	// 			);
	// 		this.#isArmed = true;
	// 	}
	// 	updateTimeline
	// 		.to(
	// 			this.arms$,
	// 			{
	// 				id: "XArms_toOrbitRadius",
	// 				width: widthOverride ?? this.orbitRadius,
	// 				ease: "back.out(0.9)",
	// 				duration
	// 			},
	// 			"<"
	// 		)
	// 		.to(this.arms$, {
	// 			id: "XArms_toArmAngles",
	// 			rotation(i) { return Array.from(self.armAngles.values())[i] },
	// 			ease: "power2.out",
	// 			duration
	// 		}, "<");
	// 	// GSDevTools.create({
	// 	// 	animation: updateTimeline,
	// 	// 	css: {
	// 	// 		width: "80%",
	// 	// 		bottom: "100px",
	// 	// 		left: "10px"
	// 	// 	},
	// 	// 	// globalSync: true
	// 	// 	// timeScale: 0.1,
	// 	// 	// paused: true
	// 	// });
	// }, 100);
	// }

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
export class XPool extends XGroup {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions() {
		const defaultXOptions: Omit<XOptions.Pool, "xParent"> = {
			id: "??-XPool-??",
			classes: ["x-pool"],
			isFreezingRotate: false,
			orbitals: {
				[XOrbitType.Main]: C.xGroupOrbitalDefaults[XOrbitType.Main]
			},
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions as Required<XOptions.Pool>,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XPool> = new Map();
	declare options: Required<XOptions.Pool>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	#orbitals: Map<XOrbitType, XOrbit> = new Map();
	#orbitalSpecs: Map<XOrbitType, XOrbitSpecs> = new Map();

	get orbitals() { return this.#orbitals }
	get xOrbits(): XOrbit[] { return Array.from(this.orbitals.values()) }

	constructor(xOptions: Partial<XOptions.Pool>) {
		super(xOptions);
		for (const [orbitName, orbitSpecs] of Object.entries(this.options.orbitals)) {
			this.#orbitalSpecs.set(orbitName as XOrbitType, orbitSpecs as XOrbitSpecs);
		}
	}

	// override async adopt;

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
		const xOrbit = new XOrbit({id: name, ...this.#orbitalSpecs.get(name)});
		this.adopt(xOrbit);
		this.#orbitals.set(name, xOrbit);
		await xOrbit.render();
		return xOrbit;
	}
	public pauseRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.pauseRotating()) }
	public playRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.playRotating()) }
}
// #endregion ▄▄▄▄▄ XPool ▄▄▄▄▄

// #region 🟥🟥🟥 XRoll: An XPool That Can Be Rolled, Its Child XTerms Evaluated Into a Roll Result 🟥🟥🟥 ~
export class XRoll extends XPool {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions() {
		const defaultXOptions: Omit<XOptions.Roll, "xParent"> = {
			id: "??-XRoll-??",
			classes: ["x-roll"],
			isFreezingRotate: false,
			orbitals: {
				[XOrbitType.Main]: C.xGroupOrbitalDefaults[XOrbitType.Main]
			},
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions as Required<XOptions.Roll>,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XRoll> = new Map();
	declare options: Required<XOptions.Roll>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

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

	constructor(xOptions: Partial<XOptions.Roll>) {
		super(xOptions);
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
export class XSource extends XPool {
	static override REGISTRY: Map<string, XSource> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-source"]}) }
	declare xParent: XGroup;

	constructor(xOptions: Partial<XOptions.Source>) {
		super(xOptions);
	}
}
// #endregion ▄▄▄▄▄ XRoll ▄▄▄▄▄
