// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮ ~
	C,
	// #endregion ▮▮▮▮[Constants]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
	gsap,
	Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	GSDevTools,
	RoughEase,
	// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XElem, XItem
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
import type {XItemOptions} from "../xclasses/xitem.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export interface XGroupOptions extends XItemOptions {
	parent: XItem;
}
export interface XPoolOptions extends XGroupOptions {
	orbitals?: Record<string,number>;
}
export type XOrbitOptions = XGroupOptions
class XArm extends XItem {
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-arm"]}) }
	public xItem: XItem;

	constructor(xItem: XItem, parentOrbit: XOrbit) {
		super({
			id: `${parentOrbit.id}-arm-${parentOrbit.xChildren.size}`,
			parent: parentOrbit,
			onRender: {
				set: {
					height: 2,
					rotation: 0,
					width: 0,
					transformOrigin: "0% 50%",
					top: "50%",
					left: "50%"
				}
			}});
		this.xItem = xItem;
		this.adopt(xItem, false);
	}

	override async initialize(): Promise<boolean> {
		if (await super.initialize()) {
			this.xItem.set({right: -1 * this.xItem.width});
			this.adopt(this.xItem, false);
			return this.xItem.confirmRender();
		}
		return Promise.resolve(false);
	}
}

export default class XGroup extends XItem {
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-group"]}) }

	public override get parent() { return <XItem>super.parent }
	public override set parent(xItem: XItem) { super.parent = xItem }
}


/* Subclass XGroup into XPool and XOrbit
				XOrbit = Wraps XChildren in XArms, rotates circles, etc
					- XOrbits handle tossing between XOrbits and pretty much everything else animated
				XPool = XChildren are centered on pool -- meant to contain XOrbits and centrally-located modifiers

			Figure out a way to have to/from/fromTo methods on all XItems that:
				- will adjust animation timescale based on a maximum time to maximum distance ratio (and minspeed ratio?)
				- if timescale is small enough, just uses .set()
		*/

export class XPool extends XGroup {
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-pool"]}) }
	protected _core: Array<XItem> = [];
	protected _orbitals: Map<string, XOrbit> = new Map();
	protected _orbitalWeights: Map<string, number>;

	public get orbitals() { return this._orbitals }
	public get xOrbits(): Array<XOrbit> { return Array.from(Object.values(this.orbitals)) }
	public get xItems(): Array<XItem> {
		return this.xOrbits.map((xOrbit) => xOrbit.getXChildren()).flat();
	}

	constructor({orbitals, ...xOptions}: XPoolOptions) {
		super(xOptions);
		orbitals = orbitals ?? {...C.xGroupOrbitalDefaults};
		this._orbitalWeights = new Map(Object.entries(orbitals));
		this._orbitalWeights.forEach((weight, name) => {
			this._orbitals.set(name, new XOrbit(name, weight, this));
		});
	}

	public async addXItem(xItem: XItem, orbit: string): Promise<boolean> {
		const orbital = this.orbitals.get(orbit);
		if (orbital instanceof XOrbit && await orbital.initialize()) {
			return orbital.addXItem(xItem);
		}
		return Promise.resolve(false);
	}
}

export class XOrbit extends XGroup {
	static override get defaultOptions() { return U.objMerge(super.defaultOptions, {classes: ["x-orbit"]}) }
	protected _weight: number;

	protected get arms(): Array<XArm> { return Array.from(<Set<XArm>>this.xChildren) }
	public get xItems() { return this.arms.map((arm) => arm.xItem) }

	public get orbitRadius() { return this.weight * 0.5 * this.parent.width }
	public get weight() { return this._weight }
	public set weight(weight) {
		this._weight = weight;
		if (this.isRendered) {
			this.updateArms();
		}
	}

	constructor(id: string, weight: number, parentGroup: XGroup) {
		super({id, parent: parentGroup, onRender: {
			set: {
				xPercent: -50,
				yPercent: -50,
				height: parentGroup.height,
				width: parentGroup.width,
				left: 0.5 * parentGroup.width,
				top: 0.5 * parentGroup.height
			}
		}});
		const self = this;
		this.to({
			rotation: "+=360",
			repeat: -1,
			duration: 10 * weight,
			ease: "none",
			onUpdate() {
				self.xItems.forEach((xItem: XItem) => {
					if (xItem.parent?.isInitialized) {
						xItem.set({rotation: -1 * xItem.parent.global.rotation});
					}
				});
			}
		});
		this._weight = weight;
	}

	protected updateArms() {
		console.log(`[${this.id}] Updating Arms`, this.arms);
		const angleStep = 360 / this.arms.length;
		this.arms.forEach((arm, i) => {
			arm.to({width: this.orbitRadius, rotation: angleStep * i, delay: 0.2 * i, ease: "power2.inOut", duration: 1});
		});
	}

	public async addXItem(xItem: XItem, angle = 0): Promise<boolean> {
		console.log(`[${this.id}] Adding XItem: ${xItem.id}`);
		const xArm = new XArm(xItem, this);
		if (await xArm.initialize()) {
			this.updateArms();
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	public async addXItems(xItems: Array<XItem>): Promise<boolean> {
		const allPromises = xItems.map((xItem, i) => {
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