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
    constructor(xItem, parentGroup) {
        super({
            parent: parentGroup,
            noImmediateRender: true,
            onRender: {
                set: {
                    height: 2,
                    rotation: 0,
                    width: 0,
                    transformOrigin: "0% 50%",
                    top: "50%",
                    left: "50%"
                }
            }
        });
        this.options.classes.unshift("x-arm");
        this.xItem = xItem;
    }
    async initialize(width = 0, rotation = 0) {
        await this.asyncRender();
        this.xItem.parent = this;
        await this.xItem.asyncRender();
        this.xItem.set({ right: -1 * this.xItem.width });
        if (width !== this.width) {
            this.to({ width, duration: 1 });
        }
        if (rotation !== this.rotation) {
            this.to({ rotation, duration: 1 });
        }
    }
}
export default class XGroup extends XItem {
    constructor(xOptions) {
        super(xOptions);
        this._numOrbitals = 1;
        this._core = [];
        this._orbitals = [];
        this._orbitalSizes = [];
        this.options.classes.unshift("x-group");
        this.xOptions = xOptions;
        this.initialize();
    }
    static get defaultOptions() {
        return U.objMerge({ ...super.defaultOptions }, {
            popOut: false,
            classes: U.unique([...super.defaultOptions.classes, "x-group"]),
            template: U.getTemplatePath("xitem")
        });
    }
    get numOrbitals() { return this._numOrbitals; }
    set numOrbitals(value) { this._numOrbitals = value; }
    get xDice() { return this._orbitals.flat().map(([arm, die]) => die); }
    async initialize() {
        await this.xElem.asyncRender();
        this.setOrbitals();
    }
    setOrbitals() {
        /* Subclass XGroup into XPool and XOrbit
                XOrbit = Wraps XChildren in XArms, rotates circles, etc
                    - XOrbits handle tossing between XOrbits and pretty much everything else animated
                XPool = XChildren are centered on pool -- meant to contain XOrbits and centrally-located modifiers
                
            Figure out a way to have to/from/fromTo methods on all XItems that:
                - will adjust animation timescale based on a maximum time to maximum distance ratio (and minspeed ratio?)
                - if timescale is small enough, just uses .set()
            
            Incorporate gsap animations into setting properties via setters. Can still call .set() for instant
                setting, but otherwise direct modifications of values should be run through timescaled animations
        */
        const weights = this.xOptions.orbitals ?? [...C.xGroupOrbitalDefaults];
        const min = Math.min(...weights);
        const max = Math.max(...weights);
        this._orbitalSizes = weights.map((orbitSize) => gsap.utils.mapRange(0, max, 0, this.size / 2, orbitSize));
        this.numOrbitals = weights.length;
        while (this.numOrbitals > this._orbitals.length) {
            this._orbitals.push([]);
        }
        while ((this._orbitals.length || 1) > this.numOrbitals) {
            const excessOrbital = this._orbitals.pop();
            if (U.isArray(excessOrbital) && excessOrbital.length > 0) {
                throw new Error(`${this.constructor.name ?? "XItem"} '${this.id}' can't remove orbitals unless they're empty.`);
            }
        }
        // this.updateOrbitals();
    }
    async addXItem(xItem, orbital) {
        orbital = orbital ?? 0;
        const xArm = new XArm(xItem, this);
        this._orbitals[orbital].push([xArm, xItem]);
        xArm.initialize(this._orbitalSizes[orbital], 0);
    }
    async updateOrbitals() {
        for (const [arm] of this._orbitals.flat()) {
            arm.to({ rotation: U.randInt(0, 360), duration: 1, ease: "sine.inOut" });
        }
    }
}