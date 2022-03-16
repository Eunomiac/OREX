// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[Constants & Utility]▮▮▮▮▮▮▮
	C, U, DB,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
	XItem, XDie, XTerm,
	XAnimVars
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
import type {XItemOptions} from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
/*DEVCODE*/
// #region ▮▮▮▮▮▮▮[SCHEMA] Breakdown of Classes & Subclasses ▮▮▮▮▮▮▮ ~
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
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-group"]}) }

	public override get xParent() { return <XItem>super.xParent }
	public override set xParent(xItem: XItem) { super.xParent = xItem }

	public get xItems() { return Array.from(this.xKids) }

	constructor(xParent: XItem, xOptions: XGroupOptions) {
		super(xParent, xOptions);
	}
}
// #endregion ▄▄▄▄▄ XGroup ▄▄▄▄▄

// #region 🟪🟪🟪 XArm: Helper XItem Used to Position Rotating XItems in XOrbits 🟪🟪🟪 ~
class XArm extends XItem {
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
	public xItem: XTerm;

	constructor(xItem: XItem, parentOrbit: XOrbit) {
		super(parentOrbit, {
			id: `${parentOrbit.id}-arm-${parentOrbit.xKids.size}`,
			keepID: true
		});
		this.xItem = xItem as XTerm;
		this.adopt(xItem, false);
	}

	override async initialize(): Promise<boolean> {
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
// #endregion ░░░░[XArm]░░░░

// #region 🟥🟥🟥 XOrbit: A Single Orbital Containing XItems & Parented to an XPool 🟥🟥🟥 ~
export type XOrbitSpecs = {
	radiusRatio: number,
	rotationRate: number
}
export enum XOrbitType {
	Main = "Main",
	Core = "Core",
	Outer = "Outer"
}
export class XOrbit extends XGroup {
	static override get defaultOptions() {
		return U.objMerge(super.defaultOptions, {
			classes: ["x-orbit"]
		});
	}
	protected _weight: number;
	protected _rotationTween?: gsap.core.Animation;

	protected get arms(): XArm[] { return Array.from(this.xKids) as XArm[] }
	public override get xItems(): XTerm[] { return this.arms.map((xArm) => xArm.xItem) }

	public get orbitRadius() { return this.weight * 0.5 * this.xParent.width }
	public get weight() { return this._weight }
	public set weight(weight) {
		this._weight = weight;
		if (this.isRendered) {
			this.updateArms();
		}
	}
	protected rotationAngle: "+=360" | "-=360";
	protected rotationScaling: number;
	protected get rotationDuration() { return 10 * this._weight * this.rotationScaling }
	protected rotationTween?: gsap.core.Tween;

	constructor(id: string, weight: number, parentGroup: XGroup, rotationScaling = 1) {
		super(parentGroup, {
			id,
			onRender: {
				set: {
					height: parentGroup.height,
					width: parentGroup.width,
					left: 0.5 * parentGroup.width,
					top: 0.5 * parentGroup.height
				},
				funcs: [
					(self) => (self as XOrbit).startRotating()
				]
			}
		});
		this.rotationAngle = weight > 0 ? "+=360" : "-=360";
		console.log(this.rotationAngle);
		this.rotationScaling = rotationScaling;
		this._weight = Math.abs(weight);
	}

	protected startRotating() {
		const [{type, ...animVars}] = XAnimVars.rotateXPool({
			xGroup: this,
			rotation: this.rotationAngle,
			duration: this.rotationDuration
		});
		this.to(animVars);
	}

	protected updateArms(duration = 0.5) {
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

	public async addXItem(xItem: XItem): Promise<boolean> {
		const xArm = new XArm(xItem, this);
		if (await xArm.initialize()) {
			this.updateArms();
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	public async addXItems(xItems: XItem[]): Promise<boolean> {
		const allPromises = xItems.map((xItem) => {
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
// #endregion ▄▄▄▄▄ XOrbit ▄▄▄▄▄

// #region 🟥🟥🟥 XPool: An XGroup Containing Drag-&-Droppable XTerms Contained in XOrbits 🟥🟥🟥 ~
export interface XPoolOptions extends XGroupOptions {
	orbitals?: Partial<Record<XOrbitType, XOrbitSpecs>>;
}
export class XPool extends XGroup {
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
	protected _core: XItem[] = [];
	protected _orbitals: Map<XOrbitType, XOrbit> = new Map();
	protected _orbitalWeights: Map<XOrbitType, number> = new Map();
	protected _orbitalSpeeds: Map<XOrbitType, number> = new Map();

	public get orbitals() { return this._orbitals }
	public get xOrbits(): XOrbit[] { return Array.from(this.orbitals.values()) }
	public override get xItems(): XItem[] {
		return this.xOrbits.map((xOrbit) => xOrbit.xItems).flat();
	}

	constructor(xParent: XItem, {orbitals = U.objClone(C.xGroupOrbitalDefaults), ...xOptions}: XPoolOptions) {
		super(xParent, xOptions);
		for (const [orbitName, {radiusRatio, rotationRate}] of Object.entries(orbitals)) {
			this._orbitalWeights.set(orbitName as XOrbitType, radiusRatio);
			this._orbitalSpeeds.set(orbitName as XOrbitType, rotationRate);
			this._orbitals.set(orbitName as XOrbitType, new XOrbit(orbitName, radiusRatio, this, rotationRate));
		}
	}

	public async addXItem(xItem: XItem, orbit: XOrbitType) {
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

	public async addXItems(xItemsByOrbit: Partial<Record<XOrbitType, XItem[]>>) {
		const self = this;
		return Promise.allSettled(Object.entries(xItemsByOrbit).map(([orbitName, xItems]) =>
			xItems.map((xItem) => self.addXItem(xItem, orbitName as XOrbitType))));
	}
}
// #endregion ▄▄▄▄▄ XPool ▄▄▄▄▄

// #region 🟥🟥🟥 XRoll: An XPool That Can Be Rolled, Its Child XTerms Evaluated Into a Roll Result 🟥🟥🟥 ~
export interface XRollOptions extends XPoolOptions { }
export class XRoll extends XPool {
	protected _hasRolled = false;
	public get hasRolled() { return this._hasRolled }
	public get diceRolls(): number[] {
		if (this.hasRolled) {
			return this.getXKids(XDie, true).map((xDie) => (xDie).value || 0);
		}
		return [];
	}

	constructor(xParent: XItem, xOptions: XRollOptions) {
		super(xParent, xOptions);
	}

	// Rolls all XDie in the XRoll.
	public rollDice(isForcingReroll = false) {
		if (isForcingReroll || !this._hasRolled) {
			this._hasRolled = true;
			const xDice = this.getXKids(XDie, true);
			gsap.timeline()
				.fadeDieText(`#${this.id} .x-die`)
				.call(() => xDice.map((xDie) => xDie.roll()))
				.pulseRolledDie(`#${this.id} .x-die`);
		}
	}

}
// #endregion ▄▄▄▄▄ XRoll ▄▄▄▄▄
