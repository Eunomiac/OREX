/// <reference types="ts/@types" />
import { XElem } from "../helpers/bundler.js";
export default class XItem extends Application implements Partial<DOMElement> {
    private static _XROOT?;
    private static _TICKERS;
    static get defaultOptions(): ApplicationOptions;
    static AddTicker(func: anyFunc): void;
    static XKill(): void;
    static get XROOT(): XItem;
    _xElem: XElem;
    constructor(options: XOptions);
    get isRendered(): boolean;
    get elem(): HTMLElement;
    get parent(): XItem | XScope;
    get _x(): number;
    get _y(): number;
    get _pos(): point;
    get _rotation(): number;
    get _scale(): number;
    get x(): number;
    get y(): number;
    get pos(): point;
    get rotation(): number;
    get scale(): number;
    get adopt(): (xParent: XItem, isRetainingPosition?: boolean) => void;
    get set(): (vars: gsap.TweenVars) => any;
    get to(): (vars: gsap.TweenVars) => any;
    get from(): (vars: gsap.TweenVars) => any;
    get fromTo(): (fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => any;
    getData(): object | Promise<object>;
    renderApp(): Promise<void>;
}
