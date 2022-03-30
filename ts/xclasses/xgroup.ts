// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
	C, U, DB,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
	XROOT, XItem, XTerm,
	XTermType,
	XDie,
	XMod,
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Enums]▮▮▮▮▮▮▮
	Dir
	// #endregion ▮▮▮▮[Enums]▮▮▮▮
} from "../helpers/bundler.js";
import type {XItemOptions, XDieValue, XParent} from "../helpers/bundler.js";
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
// #region 🟩🟩🟩 XGroup: Any XItem That Can Contain Child XItems 🟩🟩🟩
export interface XGroupOptions extends XItemOptions { }
export default class XGroup extends XItem implements XParent {
	protected static override REGISTRY: Map<string, XGroup> = new Map();
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-group"]}) }

	// override get xParent() { return super.xParent as XItem }
	// override set xParent(xItem: XItem) { super.xParent = xItem }

	#xKids: Set<XItem> = new Set();
	get xItems() { return Array.from(this.xKids) }

	constructor(xOptions: XGroupOptions, xParent: XItem | XROOT = XItem.XROOT) {
		super(xOptions, xParent);
	}
}
// #endregion ▄▄▄▄▄ XGroup ▄▄▄▄▄

// #region 🟪🟪🟪 XArm: Connective Tissue Between XROOT, XGroups, XOrbits and XTerms 🟪🟪🟪 ~
export class XArm extends XItem implements XParent {
	protected static override REGISTRY: Map<string, XArm> = new Map();
	static override get defaultOptions() {
		return U.objMerge(
			super.defaultOptions,
			{
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
			}
		);
	}
	// public static Connect(xParent: XGroup, xKids: XItem[]): Promise<XArm[]> {
	// 	/* PARTITION xKids into those that are initialized and those that aren't.

	// 	UNINITIALIZED XKIDS:
	// 		-> Immediately set xKid: {
	// 				opacity: 0,

	// 		} Set xKid's scale to 0.1 * its current scale
	// 		// -> Set xKid's opacity to zero, but record its current opacity
	// 		// -> Set xArm's width to zero
	// 		// ->


	// 	// Does xKid have a current xParent?
	// 		// -> Call disown() method on xParent (this will also kill the XArm per an override below)
	// 		// -> Disown reparents xItem to global space, maintaining current position, scale and rotation
	// 	// IF xKid is Initialized:
	// 		// -> Get xKid's current position
	// 		// -> UniteWithXItem() method, with animations
	// 	// OTHERWISE

	// 	*/

	// }
	xItem: XItem;

	constructor(xItem: XItem, parentOrbit: XOrbit) {
		super({id: "arm"}, parentOrbit);
		this.xItem = xItem;
	}

	async uniteWithHeldItem(): Promise<boolean> {
		if (await this.xItem.xInitialize()) {
			await this.stretchToXItem();
			this.adopt(this.xItem, false);
			this.xItem.set({x: 0, y: 0});
			return Promise.resolve(true);
		}
		return Promise.reject(false);
	}

	override async xInitialize(): Promise<boolean> {
		if (await super.xInitialize() && await this.xItem.xInitialize()) {
			this.set({
				"--held-item-width": `${this.xItem.width}px`
			});
			this.xParent?.adopt(this, false);
			return this.uniteWithHeldItem();
		}
		return Promise.reject();
	}

	async stretchToXItem() {
		if (this.xParent && await this.xItem.xInitialize()) {
			// Relative x/y distance from Arm origin to xItem
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
			return this.set({width: distToFloat, rotation: this.rotation + angleDelta});
		}
		return Promise.reject();
	}

	get orbitWeight() { return this.xItem.size }
}
// #endregion ░░░░[XArm]░░░░

// #region 🟥🟥🟥 XOrbit: A Single Orbital Containing XItems & Parented to an XPool 🟥🟥🟥 ~
export type XOrbitSpecs = {
	radiusRatio: number,
	rotationScaling: number
}
export enum XOrbitType {
	Main = "Main",
	Inner = "Inner",
	Outer = "Outer"
}
export class XOrbit extends XGroup {
	protected static override REGISTRY: Map<string, XOrbit> = new Map();
	static override get defaultOptions() {
		return U.objMerge(super.defaultOptions, {
			classes: ["x-orbit"]
		});
	}
	#rotationScaling: number;
	#rotationAngle: "+=360" | "-=360";
	#rotationDuration: number;

	protected get arms$() { return $(`#${this.id} > .x-arm`) }
	protected get arms() { return Array.from(this.xKids) as XArm[] }
	override get xItems(): XItem[] { return this.arms.map((xArm) => xArm.xItem) }
	get xTerms(): Array<XItem & XTerm> { return this.xItems.filter((xItem) => xItem instanceof XDie || xItem instanceof XMod) as Array<XItem & XTerm> }

	#radiusRatio: number;
	get radiusRatio() { return this.#radiusRatio }
	set radiusRatio(radiusRatio) {
		this.#radiusRatio = radiusRatio;
		if (this.isRendered) {
			this.updateArms();
		}
	}
	get orbitRadius() { return this.radiusRatio * 0.5 * this.xParent.width }
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

	constructor(name: XOrbitType, parentGroup: XGroup, radiusRatio?: number, rotationScaling?: number) {
		radiusRatio ??= C.xGroupOrbitalDefaults[name].radiusRatio;
		rotationScaling ??= C.xGroupOrbitalDefaults[name].rotationScaling;
		super({
			id: name,
			onRender: {
				set: {
					height: parentGroup.height,
					width: parentGroup.width,
					left: 0.5 * parentGroup.width,
					top: 0.5 * parentGroup.height
				},
				funcs: [
					(self) => {
						(self as this).startRotating();
					}
				]
			}
		}, parentGroup);
		this.#radiusRatio = radiusRatio;
		this.#rotationScaling = Math.abs(rotationScaling);
		this.#rotationAngle = rotationScaling > 0 ? "+=360" : "-=360";
		this.#rotationDuration = 10 * this.#radiusRatio * this.#rotationScaling;
	}

	protected startRotating(dir: Dir.L|Dir.R = Dir.L, duration = 10) {
		if (this.isRendered) {
			this.to({
				id: "rotationTween",
				rotation: `${dir === Dir.L ? "+" : "-"}=360`,
				duration,
				repeat: -1,
				ease: "none",
				callbackScope: this,
				onUpdate() {
					this.xTerms.forEach((xItem: XItem & XTerm) => {
						if (xItem.isFreezingRotate && xItem.isInitialized && xItem.xParent?.isInitialized) {
							xItem.set({rotation: -1 * xItem.xParent.global.rotation});
						}
					});
				}
			});
		}
	}
	protected updateArmsThrottle?: NodeJS.Timeout;
	public pauseRotating() {
		if (this.isRendered) {
			this.xElem.tweens.rotationTween?.pause();
		}
	}
	public playRotating() {
		if (this.isRendered) {
			this.xElem.tweens.rotationTween?.play();
		}
	}

	protected addXArm(xArm: XArm) {
		// If XArm's item is uninitialized, just add it like updateArms currently does

		// Otherwise, get global angle of XOrbit to XTerm -> local rotation of XArm
		// Insert XArm into


	}

	protected updateArms(duration = 3, widthOverride?: number) {
		if (this.updateArmsThrottle) {
			clearTimeout(this.updateArmsThrottle);
		}
		this.updateArmsThrottle = setTimeout(() => {
			DB.log("Update Arms RUNNING!");
			const self = this;
			gsap.timeline()
				.to(this.arms$, {
					width: widthOverride ?? this.orbitRadius,
					ease: "back.out(4)",
					duration,
					stagger: {
						amount: 1,
						from: "end"
					}/* ,
					onUpdate() {
						this.targets.forEach((target: HTMLElement) => {
							gsap.set($(`#${target.id} > .x-item`), {x: gsap.getProperty(target, "width")});
						});
					} */
				}, "<")
				.to(this.arms$, {
					rotation(i) { return self.armAngles[i] },
					ease: "power2.out",
					duration
				}, "<");
		}, 10);
	}

	async addXItem(xItem: XItem): Promise<boolean> {
		const xArm = new XArm(xItem, this);
		if (await xArm.xInitialize()) {
			this.updateArms();
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	async addXItems(xItems: XItem[]): Promise<boolean> {
		const allPromises = xItems.map((xItem) => {
			const xArm = new XArm(xItem, this);
			this.adopt(xArm);
			console.log(this.arms);
			return xArm.xInitialize();
		});
		if (await Promise.allSettled(allPromises)) {
			this.updateArms();
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}
}
// #endregion ▄▄▄▄▄ XOrbit ▄▄▄▄▄

// #region 🟥🟥🟥 XPool: An XGroup Containing Drag-&-Droppable XTerms Contained in XOrbits 🟥🟥🟥 ~
export interface XPoolOptions extends XGroupOptions {
	orbitals?: Partial<Record<XOrbitType, XOrbitSpecs>>;
}
export class XPool extends XGroup {
	protected static override REGISTRY: Map<string, XPool> = new Map();
	static override get defaultOptions() {
		return U.objMerge(
			super.defaultOptions,
			{
				classes: ["x-pool"],
				onRender: {
					set: {
						height: 200,
						width: 200
					}
				}
			}
		);
	}

	#core: XItem[] = [];
	#orbitals: Map<XOrbitType, XOrbit> = new Map();
	#orbitalWeights: Map<XOrbitType, number> = new Map();
	#orbitalSpeeds: Map<XOrbitType, number> = new Map();

	get orbitals() { return this.#orbitals }
	get xOrbits(): XOrbit[] { return Array.from(this.orbitals.values()) }
	override get xItems(): XItem[] {
		return this.xOrbits.map((xOrbit) => xOrbit.xItems).flat();
	}

	constructor({orbitals = U.objClone(C.xGroupOrbitalDefaults), ...xOptions}: XPoolOptions, xParent: XItem | XROOT = XItem.XROOT) {
		super(xOptions, xParent);
		for (const [orbitName, {radiusRatio, rotationScaling}] of Object.entries(orbitals)) {
			this.#orbitalWeights.set(orbitName as XOrbitType, radiusRatio);
			this.#orbitalSpeeds.set(orbitName as XOrbitType, rotationScaling);
			this.#orbitals.set(orbitName as XOrbitType, new XOrbit(orbitName as XOrbitType, this, radiusRatio, rotationScaling));
		}
	}

	async addXItem(xItem: XItem, orbit: XOrbitType) {
		// return XArm.Connect(this, this.orbitals.get(orbit));


		const orbital = this.orbitals.get(orbit);
		if (orbital instanceof XOrbit && await orbital.xInitialize()) {
			return orbital.addXItem(xItem);
		}
		return Promise.resolve(false);
	}

	async addXItems(xItemsByOrbit: Partial<Record<XOrbitType, XItem[]>>) {
		const self = this;
		return Promise.all(Object.entries(xItemsByOrbit)
			.map(async ([orbitName, xItems]) => Promise.all(xItems
				.map((xItem) => self.addXItem(xItem, orbitName as XOrbitType)))));
	}

	public pauseRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.pauseRotating()) }
	public playRotating() { this.xOrbits.forEach((xOrbit) => xOrbit.playRotating()) }
}
// #endregion ▄▄▄▄▄ XPool ▄▄▄▄▄

// #region 🟥🟥🟥 XRoll: An XPool That Can Be Rolled, Its Child XTerms Evaluated Into a Roll Result 🟥🟥🟥 ~
export interface XRollOptions extends XPoolOptions { }
export class XRoll extends XPool {
	protected static override REGISTRY: Map<string, XRoll> = new Map();
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

	constructor(xOptions: XRollOptions, xParent: XItem | XROOT = XItem.XROOT) {
		super(xOptions, xParent);
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
		return this.orbitals.get(orbital)?.xTerms.map((xTerm) => xTerm.value ?? 0) ?? [];
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
	// protected static override REGISTRY: Map<string, this> = new Map();

	constructor(xOptions: XSourceOptions, xParent: XItem) {
		super(xOptions, xParent);
	}
}
// #endregion ▄▄▄▄▄ XRoll ▄▄▄▄▄
