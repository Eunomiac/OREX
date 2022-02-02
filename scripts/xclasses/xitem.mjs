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
	U
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
} from "../helpers/bundler.mjs";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export default class XItem extends Application {

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			popOut: false,
			classes: ["x-item"]
		});
	}

	static get XCONTAINER() {
		return (this._XCONTAINER = this._XCONTAINER ?? new XItem({
			id: "x-container",
			template: "xcontainer.hbs",
			parent: null
		}));
	}

	getData() {
		const context = super.getData();

		context.id = this.id;
		context.classes = this._classes.join(" ");

		return context;
	}

	constructor({id, classes, template, parent = XItem.XCONTAINER} = {}) {
		super(U.objCompact({
			id,
			template: template ? U.getTemplatePath(template) : undefined,
			classes
		}));
		this.render(true);
		if (parent instanceof XItem) {
			this._parent = parent;
		}
	}

	get id() { return this.options.id }
	get _classes() { return this.options.classes }
}