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

class XArm extends XItem {
	private _heldXItem: XItem;
	override get parent(): XGroup { return <XGroup>this._xElem.parent }

	constructor(width: number, rotation: number, heldXItem: XItem, parentGroup: XGroup) {
		super({parent: parentGroup, style: {
			height: 2,
			width,
			rotation,
			transformOrigin: "100% 50%",
			top: "50%"
		}});
		this.options.classes.unshift("x-arm");
		this.whenRendered(() => {
			heldXItem.whenRendered(() => {
				this.adopt(heldXItem, false);
			});
		});
		this._heldXItem = heldXItem;
	}

	get heldXItem() { return this._heldXItem }
}

export default class XGroup extends XItem {

	protected _orbitalSizes: Array<number> = [];
	protected _orbitals: Array<Array<XArm>> = [];
	static override get defaultOptions(): ApplicationOptions {
		return U.objMerge(super.defaultOptions, {
			popOut: false,
			classes: U.unique([...super.defaultOptions.classes, "x-group"]),
			template: U.getTemplatePath("xitem")
		});
	}

	constructor(size: number, xOptions: XOptions) {
		super(xOptions);
		this.options.classes.unshift("x-group");
		this.set({
			"--groupRadius": size,
			...xOptions.style
		});
		if (xOptions.initialXItems) {
			const numOrbitals = Array.isArray(xOptions.initialXItems[0])
				? xOptions.initialXItems.length
				: 1;
			this.setOrbitals(xOptions.orbitals);
			this.initChildXItems(xOptions.initialXItems);
		}
	}

	setOrbitals(orbitals = C.xGroupOrbitalDefaults) {
		const min = Math.min(...orbitals);
		const max = Math.max(...orbitals);
		this._orbitalSizes = orbitals.map((orbitSize) => <number><unknown>gsap.utils.mapRange(min, max, min * this.size, max * this.size));
		// this.updateOrbitals();
	}

	initChildXItems(orbitals: Array<XItem|Array<XItem>>) {
		const orbitGroups: Array<Array<XItem>> = [];
		if (orbitals.every((orbital) => orbital instanceof XItem)) {
			orbitGroups.push([...<Array<XItem>>orbitals]);
		} else {
			orbitGroups.push(...<Array<Array<XItem>>>orbitals);
		}
		orbitGroups.forEach((orbitGroup, i) => {
			const armSize = this._orbitalSizes[i];
			this._orbitals[i] = orbitGroup.map((xItem, j, oGroup) => new XArm(armSize, (j * 360) / oGroup.length, xItem, this));
		});
	}
}
