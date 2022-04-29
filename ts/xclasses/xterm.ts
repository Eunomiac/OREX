// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XROOT, XItem, XGroup, XPool, XRoll, XTermType
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "../helpers/bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮
export default class XDie extends XItem implements XTerm {

	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Die> {

		const defaultXOptions: Required<XOptions.Die> = {
			id: U.getUID("XDIE"),
			classes: ["x-die"],
			template: U.getTemplatePath("xdie"),
			isFreezingRotate: true,
			type: XTermType.BasicDie,
			value: 0,
			dieSize: 40,
			dieColor: "rgba(255, 255, 255, 1)",
			strokeColor: "rgba(0, 0, 0, 1)",
			numColor: "rgba(0, 0, 0, 1)",
			vars: {
				fontSize: "calc(1.2 * var(--die-size))",
				fontFamily: "Oswald",
				textAlign: "center"
			}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XDie> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Die>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XParent, xOptions: XOptions.Die) {
		super(xParent, xOptions);
		this.options.vars = {
			...this.options.vars,
			...{
				"height": this.options.dieSize,
				"width": this.options.dieSize,
				"--die-size": `${this.options.dieSize}px`,
				"--die-color-fg": this.options.numColor,
				"--die-color-bg": this.options.dieColor,
				"--die-color-stroke": this.options.strokeColor
			}
		};
		this.#type = this.options.type;
		this.#value = this.options.value;
	}

	#type: XDieType;
	get type() { return this.#type }

	#value: XDieValue = 0;
	get value() { return this.#value }
	set value(val: XDieValue) {
		if (val && val > 0 && val <= 10) {
			this.#value = val;
			this.value$.html(this.face);
		}
	}
	protected get value$() { return $(`#${this.id} .die-val`) }
	get face(): XDieFace { return [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "X"][this.#value] as XDieFace }

	get isRolled() { return this.value > 0 }

	roll() { this.value = U.randInt(1, 10) as XDieValue }

	override async render(): Promise<this> {
		if (this._renderPromise) { return this._renderPromise }
		const superPromise = super.render();
		this._renderPromise = superPromise
			.then(async () => {
				this.value$.html(this.face);
				return this;
			});
		return this._renderPromise;
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
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Mod> {

		const defaultXOptions: Required<XOptions.Mod> = {
			id: U.getUID("XMOD"),
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
			super.defaultOptions,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XMod> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Mod>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XParent, xOptions: XOptions.Mod) {
		super(xParent, xOptions);
	}

	private _value: XDieValue = 0;
	protected get value$() { return $(`#${this.id} .die-val`) }

	get type(): XModType { return this.options.type }
	get value() { return (this._value = this._value ?? 0) }
	set value(val: XDieValue) {
		this._value = val;
		this.value$.html(`${val}`);
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
export class XGhost extends XMod {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Ghost> {

		const defaultXOptions: Required<XOptions.Ghost> = {
			id: U.getUID("XGHOST"),
			classes: ["x-ghost"],
			template: U.getTemplatePath("xmod"),
			isFreezingRotate: true,
			type: XTermType.Modifier,
			value: 0,
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XGhost> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Ghost>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XParent, xOptions: XOptions.Ghost) {
		super(xParent, xOptions);
	}

}

export class XMutator extends XMod {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Mutator> {

		const defaultXOptions: Required<XOptions.Mutator> = {
			id: U.getUID("XMUTATOR"),
			classes: ["x-mutator"],
			template: U.getTemplatePath("xmod"),
			isFreezingRotate: true,
			type: XTermType.Modifier,
			value: 0,
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XMutator> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Mutator>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XParent, xOptions: XOptions.Mutator) {
		super(xParent, xOptions);
	}
}

export class XInfo extends XMod {
	// #region ▮▮▮▮▮▮▮[Virtual Overrides] Overriding Necessary Virtual Properties ▮▮▮▮▮▮▮ ~
	static override get defaultOptions(): ApplicationOptions & Required<XOptions.Info> {

		const defaultXOptions: Required<XOptions.Info> = {
			id: U.getUID("XINFO"),
			classes: ["x-info"],
			template: U.getTemplatePath("xmod"),
			isFreezingRotate: true,
			type: XTermType.Modifier,
			value: 0,
			vars: {}
		};
		return U.objMerge(
			super.defaultOptions,
			defaultXOptions
		);
	}
	static override REGISTRY: Map<string, XInfo> = new Map();
	declare options: ApplicationOptions & Required<XOptions.Info>;
	declare xParent: XParent;
	// #endregion ▮▮▮▮[Virtual Overrides]▮▮▮▮

	constructor(xParent: XParent, xOptions: XOptions.Info) {
		super(xParent, xOptions);
	}
}