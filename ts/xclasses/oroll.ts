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
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	XItem, XGroup, XDie
} from "../helpers/bundler.js";
import type * as T from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export default class ORoll /* implements Partial<Roll> */ {
	protected _foundryRoll?: Roll;
	_evaluated = false;
	_items: Array<XItem> = [];

	// static CHAT_TEMPLATE = U.getTemplatePath("chat/xroll");

	// constructor(options: ORoll.Options = {}, data: ORoll.Data) {

	// }


	get Roll() {
		return (this._foundryRoll = this._foundryRoll ?? new Roll(""));
	}

}

declare namespace ORoll {
	interface Data extends RollTerm.Data {
		numDice: number,
		evaluated: boolean,
		options: Options
	}
	interface Options extends RollTerm.Options {
		initialXItems?: Array<XItem>

	}
}