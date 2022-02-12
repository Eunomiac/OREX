import type {XGroup} from "../helpers/bundler.js";
export declare class ORoll {
	protected _parentGroup: XGroup | null;
	protected _foundryRoll?: Roll;
	_evaluated: boolean;
	_dice: Array<ODiceTerm>;
	static CHAT_TEMPLATE: string;
	constructor(xGroup: XGroup | null, data: ORollData, options?: ORollOptions);
	get Roll(): Roll;
}
