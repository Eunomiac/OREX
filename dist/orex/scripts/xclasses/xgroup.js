/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

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
    constructor(width, rotation, heldXItem, parentGroup) {
        super({ parent: parentGroup, style: {
                height: 2,
                width,
                rotation,
                transformOrigin: "100% 50%",
                top: "50%"
            } });
        this.options.classes.unshift("x-arm");
        this.whenRendered(() => {
            heldXItem.whenRendered(() => {
                this.adopt(heldXItem, false);
            });
        });
        this._heldXItem = heldXItem;
    }
    get parent() { return this._xElem.parent; }
    get heldXItem() { return this._heldXItem; }
}
export default class XGroup extends XItem {
    constructor(size, xOptions) {
        super(xOptions);
        this._orbitalSizes = [];
        this._orbitals = [];
        this.options.classes.unshift("x-group");
        this.set(Object.assign({ "--groupRadius": size }, xOptions.style));
        if (xOptions.initialXItems) {
            const numOrbitals = Array.isArray(xOptions.initialXItems[0])
                ? xOptions.initialXItems.length
                : 1;
            this.setOrbitals(xOptions.orbitals);
            this.initChildXItems(xOptions.initialXItems);
        }
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: U.unique([...super.defaultOptions.classes, "x-group"]),
            template: U.getTemplatePath("xitem")
        });
    }
    setOrbitals(orbitals = C.xGroupOrbitalDefaults) {
        const min = Math.min(...orbitals);
        const max = Math.max(...orbitals);
        this._orbitalSizes = orbitals.map((orbitSize) => gsap.utils.mapRange(min, max, min * this.size, max * this.size));
        // this.updateOrbitals();
    }
    initChildXItems(orbitals) {
        const orbitGroups = [];
        if (orbitals.every((orbital) => orbital instanceof XItem)) {
            orbitGroups.push([...orbitals]);
        }
        else {
            orbitGroups.push(...orbitals);
        }
        orbitGroups.forEach((orbitGroup, i) => {
            const armSize = this._orbitalSizes[i];
            this._orbitals[i] = orbitGroup.map((xItem, j, oGroup) => new XArm(armSize, (j * 360) / oGroup.length, xItem, this));
        });
    }
}