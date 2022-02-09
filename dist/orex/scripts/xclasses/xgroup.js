/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XItem
 } from "../helpers/bundler.js";
class XArm extends XItem {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            popOut: false,
            classes: ["x-arm"]
        });
    }
}
export default class XGroup extends XItem {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            popOut: false,
            classes: ["x-group"]
        });
    }
    constructor(options) {
        options.template = U.getTemplatePath("xgroup.html");
        super(options);
    }
}