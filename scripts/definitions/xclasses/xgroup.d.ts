/// <reference types="ts/@types" />
import { XItem } from "../helpers/bundler.js";
export default class XGroup extends XItem {
    static get defaultOptions(): ApplicationOptions;
    constructor(size: number, xOptions: XOptions);
}
