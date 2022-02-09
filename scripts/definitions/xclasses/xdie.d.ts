import { XItem } from "../helpers/bundler.js";
export default class extends XItem {
    static get defaultOptions(): ApplicationOptions;
    getData(): object | Promise<object>;
}
