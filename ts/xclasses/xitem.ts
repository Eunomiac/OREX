// #region ████████ IMPORTS ████████ ~
import {
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
	XElem
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
} from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

type XOptions = {id: string, classes?: string[], template: string, parent: XItem | null };

export default class XItem extends Application {

	static #XCONTAINER: XItem;

	static override get defaultOptions(): ApplicationOptions {
		return mergeObject(super.defaultOptions, {
			popOut: false,
			classes: ["x-item"]
		});
	}

	static get XCONTAINER(): XItem {
		if (!this.#XCONTAINER) {
			this.#XCONTAINER = new XItem({
				id: "x-container",
				template: U.getTemplatePath("xcontainer.hbs"),
				parent: null
			});
		}
		return this.#XCONTAINER;
	}

	#parent: XItem | null;
	pos: XElem | undefined;

	override getData() {
		const context = super.getData() as list;

		context.id = this.id;
		context.classes = this.#classes.join(" ");

		return context;
	}

	constructor({parent, ...options}: XOptions) {
		super(options);
		this.#parent = parent;
		this.render(true);
	}

	override async _render(force?: boolean | undefined, options?: list | undefined) {
		await super._render(force, options);
		if (this.parent) {
			$(this.elem).appendTo(this.parent.elem);
		}
		this.pos = new XElem(this.elem, this);
	}

	get #classes(): string[] { return this.options.classes }
	get elem(): HTMLElement { return this.element[0] }
	get parent() { return this.#parent }
}