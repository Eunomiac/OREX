// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XROOT, XItem, XGroup, XPool, XRoll
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮


export default class XDie extends XItem implements XTerm {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions() {
		const defaultXOptions: Omit<XOptions.Die, "xParent"> = {
			id: "??-XDie-??",
			classes: ["x-die"],
			template: U.getTemplatePath("xdie"),
			isFreezingRotate: true,
			type: XTermType.BasicDie,
			value: 0,
			dieColor: "white",
			strokeColor: "black",
			numColor: "black",
			vars: {
				fontSize: "calc(1.2 * var(--die-size))",
				fontFamily: "Oswald",
				textAlign: "center"
			}
		};
		return U.objMerge(
			super.defaultOptions as Required<XOptions.Die>,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XDie> = new Map();
	declare options: Required<XOptions.Die>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	get type() { return this.options.type }

	protected get value$() { return $(`#${this.id} .die-val`) }

	#value: XDieValue = 0;
	get value() { return this.#value }
	set value(val: XDieValue) {
		if (val && val > 0 && val <= 10) {
			this.#value = val;
			this.value$.html(this.face);
		}
	}
	get face(): XDieFace { return [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "X"][this.#value] as XDieFace }

	get isRolled() { return this.value > 0 }

	roll() { this.value = U.randInt(1, 10) as XDieValue }

	override async render(): Promise<this> {
		await super.render();
		this.value$.html(this.face);
		return this;
	}

	constructor(xOptions: Partial<XOptions.Die>) {
		xOptions.type ??= XTermType.BasicDie;
		xOptions.isFreezingRotate ??= true;
		super(xOptions);
		this.options.vars = {
			...this.options.vars,
			...{
				"--die-size": `${this.size}px`,
				"--die-color-fg": this.options.numColor,
				"--die-color-bg": this.options.dieColor,
				"--die-color-stroke": this.options.strokeColor
			}
		};
	}

	override getData() {
		const context = super.getData();
		const faceNum = this.value === 10 ? 0 : (this.value || " ");

		Object.assign(context, {
			value: faceNum
		});

		return context;
	}
}


export class XMod extends XItem implements XTerm {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions() {
		const defaultXOptions: Omit<XOptions.Mod, "xParent"> = {
			id: "??-XMod-??",
			classes: ["x-mod"],
			template: U.getTemplatePath("xmod"),
			isFreezingRotate: true,
			type: XTermType.Modifier,
			value: 0,
			vars: {
				fontSize: "calc(1.2 * var(--die-size))",
				fontFamily: "Oswald",
				textAlign: "center"
			}
		};
		return U.objMerge(
			super.defaultOptions as Required<XOptions.Mod>,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XMod> = new Map();
	declare options: Required<XOptions.Mod>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	private _value: XDieValue = 0;
	protected get value$() { return $(`#${this.id} .die-val`) }

	get type(): XModType { return this.options.type }
	get value() { return (this._value = this._value ?? 0) }
	set value(val: XDieValue) {
		this._value = val;
		this.value$.html(`${val}`);
	}

	constructor(xOptions: Partial<XOptions.Mod>) {
		super(xOptions);
	}

	override getData() {
		const context = super.getData();
		const faceNum = this.value === 10 ? 0 : (this.value || " ");

		Object.assign(context, {
			value: faceNum
		});

		return context;
	}
}