/// <reference types="ts/@types" />
import { XItem } from "../helpers/bundler.js";
export default class XElem {
    #private;
    element: Element;
    xItem: XItem;
    constructor(element: Element, xItem: XItem);
    get height(): number;
    get width(): number;
    get localPosition(): pointFull;
    get globalPosition(): pointFull;
    get position(): position;
}
