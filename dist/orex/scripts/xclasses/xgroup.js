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
        this._orbitalSizes = [];
        this._orbitals = [];
        this.options.classes.unshift("x-group");
        this.setOrbitals(xOptions.orbitals);
        this.initialize(xOptions);
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
    initialize(xOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.xElem.render();
        });
    }
    setOrbitals(orbitals = C.xGroupOrbitalDefaults) {
        const min = Math.min(...orbitals);
        const max = Math.max(...orbitals);
        this._orbitalSizes = orbitals.map((orbitSize) => gsap.utils.mapRange(min, max, min * this.size, max * this.size));
        // this.updateOrbitals();
    }
}