/// <reference types="ts/@types" />
export default class XItem extends Application implements DOMElement {
    private static _XCONTAINER;
    static get defaultOptions(): ApplicationOptions;
    static get XCONTAINER(): XItem;
    private _parent;
    private _xElem;
    constructor(options?: XOptions, parent?: XItem | null);
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
    to(vars: gsap.TweenVars): Promise<gsap.core.Tween> | gsap.core.Tween;
    from(vars: gsap.TweenVars): Promise<gsap.core.Tween> | gsap.core.Tween;
    fromTo(fromVars: gsap.TweenVars, toVars: gsap.TweenVars): Promise<gsap.core.Tween> | gsap.core.Tween;
    set(vars: gsap.TweenVars): Promise<gsap.core.Tween> | gsap.core.Tween;
}
