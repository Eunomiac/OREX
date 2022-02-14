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
// ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮
C, 
// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
gsap, 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, XItem
 } from "../helpers/bundler.js";
class XArm extends XItem {
    constructor(width, rotation, parentGroup) {
        super({
            parent: parentGroup,
            onRender: {
                set: {
                    height: 2,
                    width,
                    rotation,
                    transformOrigin: "100% 50%",
                    top: "50%"
                }
            }
        });
        this.options.classes.unshift("x-arm");
    }
}
export default class XGroup extends XItem {
    constructor(xOptions) {
        super(xOptions);
        this._numOrbitals = 1;
        this._orbitals = [];
        this._orbitalSizes = [];
        this.options.classes.unshift("x-group");
        this.xOptions = xOptions;
        this.initialize();
    }
    static get defaultOptions() {
        return U.objMerge(Object.assign({}, super.defaultOptions), {
            popOut: false,
            classes: U.unique([...super.defaultOptions.classes, "x-group"]),
            template: U.getTemplatePath("xitem")
        });
    }
    get numOrbitals() { return this._numOrbitals; }
    set numOrbitals(value) { this._numOrbitals = value; }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.xElem.asyncRender();
            this.setOrbitals();
        });
    }
    setOrbitals() {
        var _a;
        const weights = (_a = this.xOptions.orbitals) !== null && _a !== void 0 ? _a : [...C.xGroupOrbitalDefaults];
        const min = Math.min(...weights);
        const max = Math.max(...weights);
        this._orbitalSizes = weights.map((orbitSize) => gsap.utils.mapRange(min, max, min * this.size, max * this.size));
        // this.updateOrbitals();
    }
}