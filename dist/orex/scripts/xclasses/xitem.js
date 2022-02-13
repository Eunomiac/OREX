/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
gsap, 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, XElem
 } from "../helpers/bundler.js";
export default class XItem extends Application {
    constructor(xOptions) {
        super(xOptions);
        this.options.classes.unshift("x-item");
        if (xOptions.parent === null) {
            this._parent = null;
        }
        else if (xOptions.parent instanceof XItem) {
            this._parent = xOptions.parent;
        }
        else {
            this._parent = XItem.XROOT;
        }
        this.xElem = new XElem({
            id: this.id,
            renderApp: this,
            noImmediateRender: xOptions.noImmediateRender,
            onRender: xOptions.onRender
        });
    }
    static get defaultOptions() {
        return U.objMerge(Object.assign({}, super.defaultOptions), {
            popOut: false,
            template: U.getTemplatePath("xitem")
        });
    }
    static get XROOT() { return XItem._XROOT; }
    static InitializeXROOT() {
        var _a;
        $((_a = XItem._XROOT) === null || _a === void 0 ? void 0 : _a.elem).remove();
        XItem._TICKERS.forEach((func) => gsap.ticker.remove(func));
        XItem._XROOT = new XItem({ id: "x-root", parent: null });
    }
    static AddTicker(func) {
        this._TICKERS.push(func);
        gsap.ticker.add(func);
    }
    get parent() { return this._parent; }
    set parent(parentXItem) { this._parent = parentXItem; }
    get elem() { return this.xElem.elem; }
    get elem$() { return this.xElem.elem$; }
    get isRendered() { return this.rendered; }
    get _x() { return this.xElem._x; }
    get _y() { return this.xElem._y; }
    get _pos() { return this.xElem._pos; }
    get _rotation() { return this.xElem._rotation; }
    get _scale() { return this.xElem._scale; }
    get x() { return this.xElem.x; }
    get y() { return this.xElem.y; }
    get pos() { return this.xElem.pos; }
    get rotation() { return this.xElem.rotation; }
    get scale() { return this.xElem.scale; }
    get height() { return this.xElem.height; }
    get width() { return this.xElem.width; }
    get size() { return this.xElem.size; }
    get radius() { return this.xElem.radius; }
    get adopt() { return this.xElem.adopt.bind(this.xElem); }
    get set() { return this.xElem.set.bind(this.xElem); }
    get to() { return this.xElem.to.bind(this.xElem); }
    get from() { return this.xElem.from.bind(this.xElem); }
    get fromTo() { return this.xElem.fromTo.bind(this.xElem); }
    getData() {
        const context = super.getData();
        Object.assign(context, {
            id: this.id,
            classes: this.options.classes.join(" ")
        });
        return context;
    }
    renderApplication() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._render(true, {});
            }
            catch (err) {
                this._state = Application.RENDER_STATES.ERROR;
                Hooks.onError("Application#render", err, {
                    msg: `An error occurred while rendering ${this.constructor.name} ${this.appId}`,
                    log: "error"
                });
                return Promise.reject(err);
            }
        });
    }
}
XItem._TICKERS = [];