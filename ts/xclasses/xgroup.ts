// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮ ~
	C,
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U, DB,
	XItem, XDie, XTerm
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
import type {XItemOptions} from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

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

export type XGroupOptions = XItemOptions
export interface XPoolOptions extends XGroupOptions {
	orbitals?: Record<string,{
		size: number,
		rotationRate: number
	}>;
}

export default class XGroup extends XItem {
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-group"]}) }

	public override get xParent() { return <XItem>super.xParent }
	public override set xParent(xItem: XItem) { super.xParent = xItem }

	constructor(xParent: XItem, xOptions: XGroupOptions) {
		super(xParent, xOptions);
	}
}
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
	public xItem: XItem;

	constructor(xItem: XItem, parentOrbit: XOrbit) {
		super(parentOrbit, {
			id: `${parentOrbit.id}-arm-${parentOrbit.xKids.size}`,
			keepID: true
		});
		this.xItem = xItem;
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
export class XOrbit extends XGroup {
	static override get defaultOptions() {
		return U.objMerge(super.defaultOptions, {
			classes: ["x-orbit"]
		});
	}
	protected _weight: number;
	protected _rotationRate: number;

	protected get arms(): XArm[] { return Array.from(<Set<XArm>>this.xKids) }
	public get xItems() { return this.arms.map((arm) => arm.xItem) }

	public get orbitRadius() { return this.weight * 0.5 * this.xParent.width }
	public get weight() { return this._weight }
	public set weight(weight) {
		this._weight = weight;
		if (this.isRendered) {
			this.updateArms();
		}
	}
	public get rotationRate() { return this._rotationRate }

	constructor(id: string, weight: number, parentGroup: XGroup, rotationRate: number) {
		super(parentGroup, {
			id,
			onRender: {
				set: {
					height: parentGroup.height,
					width: parentGroup.width,
					left: 0.5 * parentGroup.width,
					top: 0.5 * parentGroup.height
				},
				to: {
					rotation: `${rotationRate > 0 ? "+" : "-"}=360`,
					duration: rotationRate,
					ease: "none",
					repeat: -1
				}
			}
		});
		this._rotationRate = rotationRate;
		this._weight = weight;
	}

	protected updateArms() {
		DB.log(`[${this.id}] Updating Arms`, this.arms);
		const angleStep = 360 / this.arms.length;
		this.arms.forEach((arm, i) => {
			arm.to({width: this.orbitRadius, rotation: angleStep * i, delay: 0.2 * i, ease: "power2.inOut", duration: 1});
		});
	}

	public async addXItem(xItem: XItem): Promise<boolean> {
		DB.log(`[${this.id}] Adding XItem: ${xItem.id}`);
		const xArm = new XArm(xItem, this);
		if (await xArm.initialize()) {
			this.updateArms();
			if (xItem instanceof XDie) {
				XItem.LockRotation(xItem);
			}
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
			XItem.LockRotation(xItems.filter((xItem) => xItem instanceof XDie));
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}
}
export class XPool extends XGroup {
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-pool"]}) }
	protected _core: XItem[] = [];
	protected _orbitals: Map<string, XOrbit> = new Map();
	protected _orbitalWeights: Map<string, number> = new Map();
	protected _orbitalSpeeds: Map<string, number> = new Map();

	public get orbitals() { return this._orbitals }
	public get xOrbits(): XOrbit[] { return Array.from(Object.values(this.orbitals)) }
	public get xItems(): XItem[] {
		return this.xOrbits.map((xOrbit) => xOrbit.xItems).flat();
	}

	constructor(xParent: XItem, {orbitals, ...xOptions}: XPoolOptions) {
		super(xParent, xOptions);
		orbitals = orbitals ?? U.objClone(C.xGroupOrbitalDefaults);
		for (const [orbitName, {size, rotationRate}] of Object.entries(orbitals)) {
			this._orbitalWeights.set(orbitName, size);
			this._orbitalSpeeds.set(orbitName, rotationRate);
			this._orbitals.set(orbitName, new XOrbit(orbitName, size, this, rotationRate));
		}
	}

	public async addXItem(xItem: XItem, orbit: string): Promise<boolean> {
		DB.group(`${xItem.constructor.name}.addXItem(${xItem.id}, ${orbit})`);
		const orbital = this.orbitals.get(orbit);
		DB.log("orbital", orbital);
		DB.log("is XOrbit?", orbital instanceof XOrbit);
		if (orbital instanceof XOrbit && await orbital.initialize()) {
			DB.log("Orbital Initialized, Adding Item...");
			const returnItem = await orbital.addXItem(xItem);
			DB.log("Item Added", returnItem);
			DB.groupEnd();
			return returnItem;
			// return orbital.addXItem(xItem);
		}
		DB.error(`FAILED adding ${xItem.id} to '${orbit}' of ${xItem.id}`);
		return Promise.resolve(false);
	}
}

export class XRoll extends XPool {
	protected _hasRolled = false;
	public get hasRolled() { return this._hasRolled }
	public get diceRolls(): number[] {
		if (this.hasRolled) {
			return this.getXKids(XDie, true).map((xDie) => (xDie).value || 0);
		}
		return [];
	}

	// Rolls all XDie in the XRoll.
	public rollDice() {
		this.getXKids(XDie, true).map((xDie) => xDie.roll());
		this._hasRolled = true;
	}

}