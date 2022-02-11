/// <reference types="ts/@types" />
import { XItem } from "../helpers/bundler.js";
export default class XElem implements DOMElement {
    private _xItem;
    private _parent;
    private _renderPromise?;
    constructor(xItem: XItem);
    get xItem(): XItem;
    get elem(): HTMLElement;
    get parent(): XItem | XScope;
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
    getLocalPosData(ofItem: XItem, globalPoint?: point): pointFull;
    asyncRender(): anyPromise;
    whenRendered(func: anyFunc): any;
    to(vars: gsap.TweenVars): any;
    from(vars: gsap.TweenVars): any;
    fromTo(fromVars: gsap.TweenVars, toVars: gsap.TweenVars): any;
    set(vars: gsap.TweenVars): any;
    adopt(xParent: XItem, isRetainingPosition?: boolean): void;
    get height(): number;
    get width(): number;
    get size(): number;
    get radius(): number | false;
}
