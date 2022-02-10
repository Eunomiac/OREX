import { XItem } from "../helpers/bundler.js";
export default class XGroup extends XItem {
    static get defaultOptions(): ApplicationOptions;
    constructor(options: Partial<ApplicationOptions>, parent?: XItem | null);
}
