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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _XItem_instances, _a, _XItem_XCONTAINER, _XItem_parent, _XItem_classes_get;
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, XElem
 } from "../helpers/bundler.js";
export default class XItem extends Application {
    constructor(_b) {
        var { parent } = _b, options = __rest(_b, ["parent"]);
        super(options);
        _XItem_instances.add(this);
        _XItem_parent.set(this, void 0);
        __classPrivateFieldSet(this, _XItem_parent, parent, "f");
        this.render(true);
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            popOut: false,
            classes: ["x-item"]
        });
    }
    static get XCONTAINER() {
        if (!__classPrivateFieldGet(this, _a, "f", _XItem_XCONTAINER)) {
            __classPrivateFieldSet(this, _a, new XItem({
                id: "x-container",
                template: U.getTemplatePath("xcontainer.html"),
                parent: null
            }), "f", _XItem_XCONTAINER);
        }
        return __classPrivateFieldGet(this, _a, "f", _XItem_XCONTAINER);
    }
    getData() {
        const context = super.getData();
        context.id = this.id;
        context.classes = __classPrivateFieldGet(this, _XItem_instances, "a", _XItem_classes_get).join(" ");
        return context;
    }
    _render(force, options) {
        const _super = Object.create(null, {
            _render: { get: () => super._render }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super._render.call(this, force, options);
            if (this.parent) {
                $(this.elem).appendTo(this.parent.elem);
            }
            this.pos = new XElem(this.elem, this);
        });
    }
    get elem() { return this.element[0]; }
    get parent() { return __classPrivateFieldGet(this, _XItem_parent, "f"); }
}
_a = XItem, _XItem_parent = new WeakMap(), _XItem_instances = new WeakSet(), _XItem_classes_get = function _XItem_classes_get() { return this.options.classes; };
_XItem_XCONTAINER = { value: void 0 };