import {C, XItem} from "../helpers/bundler.js";
export default class XGroup extends XItem {
	protected _orbitals: Record<number, Array<XItem>>;
	static get defaultOptions(): ApplicationOptions;
	constructor(size: number, xOptions: XOptions);
	setOrbitals(numOrbitals: number, {min, max, mid}?: typeof C.xGroupOrbitalDefaults): void;
	initChildXItems(orbitals: Array<XItem>): void;
}
