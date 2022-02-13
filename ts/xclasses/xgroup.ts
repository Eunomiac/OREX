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
	orbitals?: Array<number>
}
class XArm extends XItem {
	constructor(width: number, rotation: number, parentGroup: XGroup) {
		super({
			parent: parentGroup,
			onRender: {
				set: {
					height: 2,
					width,
					rotation,
					transformOrigin: "100% 50%",
					top: "50%"
				}
			}});
		this.options.classes.unshift("x-arm");
	}
}

export default class XGroup extends XItem {
	private _numOrbitals = 1;

	protected _orbitalSizes: Array<number> = [];
	protected _orbitals: Array<Array<[XArm, XItem]>> = [];

	static override get defaultOptions(): ApplicationOptions {
		return U.objMerge({...super.defaultOptions}, {
			popOut: false,
			classes: U.unique([...super.defaultOptions.classes, "x-group"]),
			template: U.getTemplatePath("xitem")
		});
	}

	constructor(xOptions: XGroupOptions) {
		super(xOptions);
		this.options.classes.unshift("x-group");
		this.setOrbitals(xOptions.orbitals);
		this.initialize(xOptions);
	}

	public get numOrbitals() { return this._numOrbitals }
	public set numOrbitals(value) { this._numOrbitals = value }

	async initialize(xOptions: XGroupOptions) {
		await this.xElem.render();

	}

	setOrbitals(orbitals = C.xGroupOrbitalDefaults) {
		const min = Math.min(...orbitals);
		const max = Math.max(...orbitals);
		this._orbitalSizes = orbitals.map((orbitSize) => <number><unknown>gsap.utils.mapRange(min, max, min * this.size, max * this.size));
		// this.updateOrbitals();
	}

}
