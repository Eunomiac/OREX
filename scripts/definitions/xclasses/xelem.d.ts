/// <reference types="ts/@types" />
import { XItem } from "../helpers/bundler.js";
export default class XElem implements DOMElement {
    private _xItem;
    constructor(xItem: XItem);
    get elem(): HTMLElement;
    get xItem(): XItem;
    get parent(): XItem | null;
    get _x(): number;
    get _y(): number;
    get _pos(): point;
    get _rotation(): number;
    get _scale(): number;
    get pos(): point;
    get x(): number;
    get y(): number;
    get rotation(): number;
    get scale(): number;
    getLocalPosData(xItem: XItem, globalPoint?: point): pointFull;
    adopt(xItem: XItem, isRetainingPosition?: boolean): void;
    get height(): number;
    get width(): number;
    get size(): number;
    get radius(): number | false;
}
