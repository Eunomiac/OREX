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
XElem, XItem
 } from "../helpers/bundler.js";
class XArm extends XElem {
}
export default class XGroup extends XItem {
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            popOut: false,
            classes: U.unique([...super.defaultOptions.classes, "x-group"])
        });
    }
    constructor(options, parent = XItem.XCONTAINER) {
        options.template = U.getTemplatePath("xgroup.html");
        super(options, parent);
    }
}