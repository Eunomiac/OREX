/// <reference types="ts/@types" />
export default class XItem extends Application implements DOMElement {
    private static _XCONTAINER;
    static get defaultOptions(): ApplicationOptions;
    static get XCONTAINER(): XItem;
    private _parent;
    private _xElem;
    private _renderPromise;
    constructor(options?: Partial<ApplicationOptions>, parent?: XItem | null);
    get elem(): HTMLElement;
    get parent(): XItem | null;
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
    get adopt(): (xItem: XItem, isRetainingPosition?: boolean) => void;
    getData(): object | Promise<object>;
    asyncRender(force?: boolean, options?: {}): anyPromise;
    whenRendered(func: anyFunc): any;
    to(vars: gsap.TweenVars): any;
    from(vars: gsap.TweenVars): any;
    fromTo(fromVars: gsap.TweenVars, toVars: gsap.TweenVars): any;
    set(vars: gsap.TweenVars): any;
}
