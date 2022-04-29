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
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Group> {

		const defaultXOptions: Required<XOptions.Group> = {
			id: U.getUID("XGROUP"),
			classes: ["x-group"],
			template: U.getTemplatePath("xitem"),
			isFreezingRotate: false,
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XGroup> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Group>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XParent, xOptions: XOptions.Group) {
		super (xParent, xOptions);
	}
}
// #endregion ▄▄▄▄▄ XGroup ▄▄▄▄▄


// #region 🟪🟪🟪 XArm: Helper XItem Used to Position Rotating XItems in XOrbits 🟪🟪🟪 ~

const TWEEN_DURATION_AT_1000 = 6;
const TWEEN_DURATION_AT_360 = 6;
const MINWIDTHTOTWEEN = 10;
const MINANGLETOTWEEN = 5;
const ARMFADEINDURATION = 3;
export class XArm extends XGroup {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Arm> {

		const defaultXOptions: Required<XOptions.Arm> = {
			id: U.getUID("XARM"),
			classes: ["x-arm"],
			template: U.getTemplatePath("xarm"),
			isFreezingRotate: false,
			vars: {
				xPercent: 0,
				yPercent: 0,
				transformOrigin: "100% 50%",
				height: 0,
				rotation: 0
			}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}

	static override REGISTRY: Map<string, XArm> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Arm>;
	declare xParent: XOrbit;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XOrbit, heldItem: XItem, xOptions: XOptions.Group) {
		xOptions.vars ??= {};
		xOptions.vars.width = xParent.orbitRadius;
		super(xParent, xOptions);
		this.#heldItem = heldItem;
		this.adopt(this.heldItem);
	}

	#currentAnimation: Anim | null = null;

	fadeIn(): void {
		if (this.#currentAnimation) { return }
		const delay: number = (this.homeRotation / 360) * ARMFADEINDURATION / 3;
		DB.display(`[${this.id}.fadeIn(${delay})], homeAngle: `, `${this.homeRotation}`);
		const self = this;
		this.#currentAnimation = gsap.timeline({
			id: `${self.id}.TWEENFADEIN(${self.homeRotation})`,
			delay,
			onComplete() {
				self.#currentAnimation = null;
				self.tweenHome();
			}
		})
			.fromTo(
				self.elem,
				{
					width: self.homeWidth * 0.1,
					rotation: self.homeRotation - 50
				},
				{
					id: `${self.id}.tweenFadeIn(Arm)`,
					width: self.homeWidth,
					rotation: self.homeRotation,
					duration: ARMFADEINDURATION,
					ease: "back"
				},
				0
			)
			.fromTo(
				self.heldItem.elem,
				{
					// opacity: 0,
					scale: 0,
					rotation: -1 * self.global.rotation
				},
				{
					id: `${self.id}.tweenFadeIn(HeldItem = ${self.heldItem.id})`,
					opacity: 1,
					scale: 1,
					duration: ARMFADEINDURATION / 1.5,
					ease: "power2"
				},
				0
			);
	}

	getHomeTweenDur(): number | null {
		const deltaWidth = Math.abs(this.width - this.homeWidth);
		const deltaRotation = Math.abs(this.rotation - this.homeRotation);
		if (deltaWidth <= MINWIDTHTOTWEEN && deltaRotation <= MINANGLETOTWEEN) {
			return null;
		}
		return Math.max(
			(deltaWidth / 1000) * TWEEN_DURATION_AT_1000,
			(deltaRotation / 360) * TWEEN_DURATION_AT_360
		);
	}

	generateHomeTween() {
		const tweenDur = this.getHomeTweenDur();
		if (tweenDur === null) { return null }
		const self = this;
		return gsap.to(this.elem, {
			id: `${this.id}-tweenHome`,
			width: this.homeWidth,
			rotation: this.homeRotation,
			duration: tweenDur,
			ease: "power4.inOut",
			paused: true,
			onComplete() {
				self.#currentAnimation = null;
				self.tweenHome();
			}
		});
	}

	#tweenHomeStaging: gsap.core.Tween | null = null;
	tweenHome(): void {
		if (this.#currentAnimation) {
			this.#tweenHomeStaging?.kill();
			this.#tweenHomeStaging = this.generateHomeTween();
		} else if (this.#tweenHomeStaging) {
			this.#currentAnimation = this.#tweenHomeStaging;
			this.#tweenHomeStaging = null;
			this.#currentAnimation.play();
		} else {
			this.#currentAnimation = this.generateHomeTween();
			this.#currentAnimation?.play();
		}
	}

	override async render(): Promise<this> {
		if (this._renderPromise) { return this._renderPromise }
		this.options.vars.right = this.xParent.width / 2;
		this.options.vars.top = this.xParent.height / 2;
		if (this.heldItem.isVisible) {
			this.options.vars.width = this.distanceToHeldItem;
			this.options.vars.rotation = this.rotationToHeldItem;
		}
		const superPromise = super.render();
		this._renderPromise = superPromise
			.then(() => {
				console.log({
					heldItem: this.heldItem,
					isItVisible: this.heldItem.isVisible,
					angleTo: this.angleToHeldItem,
					distanceTo: this.distanceToHeldItem,
					width: this.options.vars.width,
					rotation: this.options.vars.rotation,
					curRotation: this.rotation,
					globalRotation: this.global.rotation
				});
				if (this.heldItem.isVisible) {
					this.heldItem.set({x: 0, y: 0, rotation: this.heldItem.rotation - this.global.rotation, immediateRender: true});
					this.xParent.updateArms();
					this.tweenHome();
				} else {
					this.fadeIn();
				}
				return this;
			});
		return this._renderPromise;
	}

	#heldItem: XItem;
	get heldItem() { return this.#heldItem }
	get heldItemSize() {
		return this.heldItem.size ?? 40;
	}
	get homeWidth() { return this.xParent.orbitRadius }
	get homeRotation() { return U.pInt(this.xParent.getArmAngle(this) ?? gsap.utils.random(-180, 180, 1)) }
	// get homeWidth() { return this.xParent.orbitRadius + gsap.utils.random(-0.1 * this.xParent.orbitRadius, 0.1 * this.xParent.orbitRadius) }
	// get homeAngle() { return U.pInt((this.xParent.getArmAngle(this) ?? gsap.utils.random(-180, 180, 1)) + gsap.utils.random(-10, 10, 1)) }

	get positionOfHeldItem(): Point {
		return MotionPathPlugin.getRelativePosition(this.xParent.elem, this.heldItem.elem, [0.5, 0.5], [0.5, 0.5]);
	}
	get distanceToHeldItem() {
		return U.getDistance({x: 0, y: 0}, this.positionOfHeldItem);
	}
	get angleToHeldItem() {
		return U.getAngleDelta(
			U.cycleAngle(this.global.rotation, [-180, 180]),
			U.getAngle({x: 0, y: 0}, this.positionOfHeldItem, undefined, [-180, 180]),
			[-180, 180]
		);
	}
	get rotationToHeldItem() {
		return this.rotation + this.angleToHeldItem - 180;
	}

	snapToHeldItem() {
		const heldItemSetParams: XStyleVars = {x: 0, y: 0};
		if (this.heldItem.isFreezingRotate) {
			heldItemSetParams.rotation = -1 * this.global.rotation;
		}
		this.set({
			width: this.distanceToHeldItem,
			rotation: this.rotation + this.angleToHeldItem - 180
		});
		this.heldItem.set(heldItemSetParams);
	}
}
// #endregion ░░░░[XArm]░░░░

// #region 🟥🟥🟥 XOrbit: A Single Orbital Containing XItems & Parented to an XPool 🟥🟥🟥 ~
export class XOrbit extends XGroup {

	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Orbit> {

		const defaultXOptions: Required<XOptions.Orbit> = {
			id: U.getUID("XORBIT"),
			name: XOrbitType.Main,
			classes: ["x-orbit"],
			template: U.getTemplatePath("xitem"),
			isFreezingRotate: false,
			radiusRatio: 1,
			rotationScaling: 1,
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}

	static override REGISTRY: Map<string, XOrbit> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Orbit>;
	declare xParent: XPool;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XPool, xOptions: XOptions.Orbit) {
		xOptions.name ??= XOrbitType.Main;
		xOptions.id ??= xOptions.name;
		xOptions.radiusRatio ??= C.xGroupOrbitalDefaults[xOptions.name as XOrbitType].radiusRatio;
		xOptions.rotationScaling ??= C.xGroupOrbitalDefaults[xOptions.name as XOrbitType].rotationScaling;
		super(xParent, xOptions);
		this.#orbitType = xOptions.name as XOrbitType;
		this.#radiusRatio = xOptions.radiusRatio;
		this.#rotationScaling = Math.abs(xOptions.rotationScaling);
		this.#rotationAngle = xOptions.rotationScaling > 0 ? "+=360" : "-=360";
	}

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
	get rotationDuration(): number {
		return 10 * this.#radiusRatio / this.#rotationScaling;
	}

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
	updateArmAngles(fixedXArm?: XArm): Map<XArm,number> {
		const totalArmWeight = this.arms.map((arm) => arm.heldItemSize).reduce((tot, val) => tot + val, 0);
		const anglePerWeight = 360 / totalArmWeight;
		const armAngles: number[] = [];

		this.#armAngles = new Map();
		let usedWeight = 0;
		this.arms.forEach((arm) => {
			usedWeight += arm.heldItemSize;
			this.#armAngles!.set(arm, (usedWeight - (0.5 * arm.heldItemSize)) * anglePerWeight);
		});
		DB.display("updateArmAngles():", this.#armAngles.values());
		return this.#armAngles;
	}

	protected startRotating() {
		DB.title("STARTING ROTATING");
		const self = this;
		this.tweens.rotationTween = this.to({
			id: "rotationTween",
			rotation: this.#rotationAngle,
			duration: this.rotationDuration,
			repeat: -1,
			ease: "none",
			onUpdate() {
				self.xTerms.forEach((xItem) => {
					if (xItem.isFreezingRotate) {
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

	public getArmAngle(xArm: XArm) {
		if (!this.armAngles.has(xArm)) {
			this.updateArmAngles();
		}
		return this.armAngles.get(xArm);
	}

	protected fadeInArms() {
		this.updateArmAngles();
		this.armAngles.forEach((_, xArm) => xArm.fadeIn());
	}

	updateArms() {
		this.updateArmAngles();
		if (this.rendered) {
			this.arms.forEach((xArm) => {
				xArm.tweenHome();
			});
		}
	}

	override async render(): Promise<this> {
		if (this._renderPromise) { return this._renderPromise }
		this.options.vars = {
			height: this.xParent.height,
			width: this.xParent.width,
			left: 0.5 * this.xParent.width,
			top: 0.5 * this.xParent.height,
			...this.options.vars
		};
		const superPromise = super.render();
		this._renderPromise = superPromise
			.then(async () => {
				this.startRotating();
				this.fadeInArms();
				return this;
			});
		return this._renderPromise;
	}

	override async adopt<T extends XItem>(xItem: T): Promise<T & XKid>
	override async adopt<T extends XItem>(xItem: T[]): Promise<Array<T & XKid>>
	override async adopt<T extends XItem>(xItem: T | T[]): Promise<T & XKid | Array<T & XKid>> {
		const promises = ([xItem].flat() as T[])
			.map((heldItem) => {
				let xArm: XParent | XItem = heldItem;
				if (!(heldItem instanceof XArm)) {
					if (this.xItems.includes(heldItem)) {
						xArm = heldItem.xParent;
					} else {
						xArm = new XArm(this, heldItem, {});
					}
				}
				return super.adopt(xArm as XArm).then(() => (xArm as XArm).heldItem as T);
			});
		return (promises.length === 1 ? promises[0] : Promise.all(promises))
			.then((result) => {
				this.updateArms();
				return result;
			});
	}
}
// #endregion ▄▄▄▄▄ XOrbit ▄▄▄▄▄

// #region 🟥🟥🟥 XPool: An XGroup Containing Drag-&-Droppable XTerms Contained in XOrbits 🟥🟥🟥 ~
export class XPool extends XGroup {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Pool> {

		const defaultXOptions: Required<XOptions.Pool> = {
			id: U.getUID("XPOOL"),
			classes: ["x-pool"],
			template: U.getTemplatePath("xitem"),
			isFreezingRotate: false,
			size: 200,
			orbitals: {
				[XOrbitType.Main]: C.xGroupOrbitalDefaults[XOrbitType.Main]
			},
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XPool> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Pool>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XParent, xOptions: XOptions.Pool) {
		super(xParent, xOptions);
		for (const [orbitName, defaultOrbitSpecs] of Object.entries(C.xGroupOrbitalDefaults) as Array<[XOrbitType, XOrbitSpecs]>) {
			this.#orbitalSpecs.set(orbitName, this.options.orbitals[orbitName] ?? defaultOrbitSpecs);
		}
	}

	#orbitals: Map<XOrbitType, XOrbit> = new Map();
	#orbitalSpecs: Map<XOrbitType, XOrbitSpecs> = new Map();

	get orbitals() { return this.#orbitals }
	get xOrbits(): XOrbit[] { return Array.from(this.orbitals.values()) }

	override async adopt<T extends XOrbit>(xItem: T): Promise<T & XKid>
	override async adopt<T extends XOrbit>(xItem: T[]): Promise<T & XKid>
	override async adopt<T extends XItem>(xItem: T, xOrbitType: XOrbitType): Promise<T & XKid>
	override async adopt<T extends XItem>(xItem: T[], xOrbitType: XOrbitType): Promise<Array<T & XKid>>
	override async adopt<T extends XItem>(xItem: T | T[], xOrbitType?: XOrbitType): Promise<T & XKid | Array<T & XKid>> {
		const self = this;
		const promises = ([xItem].flat() as T[])
			.map(async (child) => {
				if (child instanceof XOrbit) {
					return super.adopt(child);
				} else if (xOrbitType) {
					let thisOrbit = self.#orbitals.get(xOrbitType);
					if (!thisOrbit) {
						const orbitalSpecs = self.#orbitalSpecs.get(xOrbitType);
						if (orbitalSpecs) {
							thisOrbit = new XOrbit(self, orbitalSpecs);
							self.#orbitals.set(xOrbitType, thisOrbit);
							await self.adopt(thisOrbit);
						}
					}
					if (thisOrbit) {
						return thisOrbit.adopt(child);
					}
				}
				throw new Error(`Bad Orbit Type: ${xOrbitType}`);
			});
		return (promises.length === 1 ? promises[0] : Promise.all(promises));
	}

	public pauseRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.pauseRotating()) }
	public playRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.playRotating()) }
}
// #endregion ▄▄▄▄▄ XPool ▄▄▄▄▄

// #region 🟥🟥🟥 XRoll: An XPool That Can Be Rolled, Its Child XTerms Evaluated Into a Roll Result 🟥🟥🟥 ~
export class XRoll extends XPool {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Roll> {

		const defaultXOptions: Required<XOptions.Roll> = {
			id: U.getUID("XROLL"),
			classes: ["x-roll"],
			template: U.getTemplatePath("xitem"),
			isFreezingRotate: false,
			...C.xRollStyles.defaults,
			orbitals: {
				[XOrbitType.Main]: C.xGroupOrbitalDefaults[XOrbitType.Main]
			},
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XRoll> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Roll>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XParent, xOptions: XOptions.Roll) {
		super(xParent, xOptions);
		this.options.vars = {
			...this.options.vars,
			...{
				...this.options.position,
				"height": this.options.size,
				"width": this.options.size,
				"--bg-color": this.options.color
			}
		};
	}

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
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Source> {

		const defaultXOptions: Required<XOptions.Source> = {
			id: U.getUID("XROLL"),
			classes: ["x-roll"],
			isFreezingRotate: false,
			template: U.getTemplatePath("xitem"),
			...C.xRollStyles.defaults,
			orbitals: {
				[XOrbitType.Main]: C.xGroupOrbitalDefaults[XOrbitType.Main]
			},
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XSource> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Source>;
	declare xParent: XGroup;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XGroup, xOptions: XOptions.Source) {
		super(xParent, xOptions);
	}
}
// #endregion ▄▄▄▄▄ XRoll ▄▄▄▄▄
