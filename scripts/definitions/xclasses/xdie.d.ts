import { XItem } from "../helpers/bundler.js";
export default class extends XItem {
    static get defaultOptions(): ApplicationOptions;
    constructor(options: Partial<ApplicationOptions> | undefined, parent: XItem);
    getData(): object | Promise<object>;
}
