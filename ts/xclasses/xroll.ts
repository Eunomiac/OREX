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
	XItem, XGroup
} from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

class ODie extends DiceTerm implements ODiceTerm {
	override faces: 10 = 10;
	override number: 1 = 1;
	protected override _evaluated = false;
	override isIntermediate = false;
	override results: [ODieResult] = [{result: OFace[" "]}];

	// override get expression(): string {
	// 	throw new Error("Method not implemented.");
	// }
	// override get formula(): string {
	// 	throw new Error("Method not implemented.");
	// }
	// override get total(): string | number | null | undefined {
	// 	throw new Error("Method not implemented.");
	// }
	// override get flavor(): string {
	// 	throw new Error("Method not implemented.");
	// }
	// override get isDeterministic(): boolean {
	// 	throw new Error("Method not implemented.");
	// }
	// override evaluate(options?: any): this | Promise<this> {
	// 	throw new Error("Method not implemented.");
	// }
	// protected override _evaluate({ minimize, maximize }?: { minimize?: boolean | undefined; maximize?: boolean | undefined; }): Promise<this> {
	// 	throw new Error("Method not implemented.");
	// }
	// protected override _evaluateSync({ minimize, maximize }?: { minimize?: boolean | undefined; maximize?: boolean | undefined; }): this {
	// 	throw new Error("Method not implemented.");
	// }
	// override toJSON(): object {
	// 	throw new Error("Method not implemented.");
	// }
}

export default class ORoll /* implements Partial<Roll> */ {
	protected _parentGroup: XGroup | null;
	protected _foundryRoll?: Roll;
	_evaluated = false;
	_dice: Array<ODiceTerm> = [];

	static CHAT_TEMPLATE = U.getTemplatePath("chat/xroll");

	constructor(xGroup: XGroup | null, data: ORollData, options: ORollOptions = {}) {
		this._parentGroup = xGroup;
	}


	get Roll() {
		return (this._foundryRoll = this._foundryRoll ?? new Roll(""));
	}

}