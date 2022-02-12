import {XItem} from "../helpers/bundler.js";
export default class extends XItem {
	static get defaultOptions(): ApplicationOptions;
	constructor(xOptions: XOptions);
	getData(): object | Promise<object>;
}
