var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// #region ████████ IMPORTS ████████ ~
import { 
// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
gsap, 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, XElem
// #endregion ▮▮▮▮[Utility]▮▮▮▮
 } from "../helpers/bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
export default class XItem extends Application {
    constructor(options) {
        super(options);
        this.options.classes.unshift("x-item");
        this._xElem = new XElem(this);
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            template: U.getTemplatePath("xitem")
        });
    }
    static AddTicker(func) {
        this._TICKERS.push(func);
        gsap.ticker.add(func);
    }
    static XKill() {
        if (XItem._XROOT) {
            $(XItem._XROOT.elem).remove();
            XItem._TICKERS.forEach((func) => gsap.ticker.remove(func));
            delete XItem._XROOT;
        }
    }
    static get XROOT() {
        if (!this._XROOT) {
            this._XROOT = new XItem({
                id: "x-root",
                parent: "SANDBOX"
            });
        }
        return this._XROOT;
    }
    get isRendered() { return this.rendered; }
    get elem() { return this._xElem.elem; }
    get parent() { return this._xElem.parent; }
    get _x() { return this._xElem._x; }
    get _y() { return this._xElem._y; }
    get _pos() { return this._xElem._pos; }
    get _rotation() { return this._xElem._rotation; }
    get _scale() { return this._xElem._scale; }
    get x() { return this._xElem.x; }
    get y() { return this._xElem.y; }
    get pos() { return this._xElem.pos; }
    get rotation() { return this._xElem.rotation; }
    get scale() { return this._xElem.scale; }
    get adopt() { return this._xElem.adopt.bind(this._xElem); }
    get set() { return this._xElem.set.bind(this._xElem); }
    get to() { return this._xElem.to.bind(this._xElem); }
    get from() { return this._xElem.from.bind(this._xElem); }
    get fromTo() { return this._xElem.fromTo.bind(this._xElem); }
    getData() {
        const context = super.getData();
        Object.assign(context, {
            id: this.id,
            classes: this.options.classes.join(" ")
        });
        return context;
    }
    renderApp() {
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
