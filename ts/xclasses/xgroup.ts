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

	protected _orbitals: Array<Array<[XArm, XItem]>> = [];
	protected _orbitalSizes: Array<number> = [];

	static override get defaultOptions(): ApplicationOptions {
		return U.objMerge({...super.defaultOptions}, {
			popOut: false,
			classes: U.unique([...super.defaultOptions.classes, "x-group"]),
			template: U.getTemplatePath("xitem")
		});
	}

	public override xOptions: XGroupOptions;

	constructor(xOptions: XGroupOptions) {
		super(xOptions);
		this.options.classes.unshift("x-group");
		this.xOptions = xOptions;
		this.initialize();
	}

	public get numOrbitals() { return this._numOrbitals }
	public set numOrbitals(value) { this._numOrbitals = value }

	async initialize() {
		await this.xElem.asyncRender();
		this.setOrbitals();

	}

	setOrbitals() {
		const weights = this.xOptions.orbitals ?? [...C.xGroupOrbitalDefaults];
		const min = Math.min(...weights);
		const max = Math.max(...weights);
		this._orbitalSizes = weights.map((orbitSize) => <number><unknown>gsap.utils.mapRange(min, max, min * this.size, max * this.size));
		// this.updateOrbitals();
	}

}