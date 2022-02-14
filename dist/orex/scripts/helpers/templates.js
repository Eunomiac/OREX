/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U } from "./bundler.js";
export const getTemplatePath = (fileRelativePath) => `/systems/orex/templates/${`${fileRelativePath}.html`.replace(/\.*\/*\\*(?:systems|orex|templates)\/*\\*|(\..{2,})\.html$/g, "$1")}`;
const templatePaths = {
    XITEMS: {
        xRoot: getTemplatePath("xroot"),
        xItem: getTemplatePath("xitem"),
        xArm: getTemplatePath("xarm"),
        xDie: getTemplatePath("xdie")
    },
    CHAT: {
        oRoll: getTemplatePath("chat/oroll")
    }
};
export default async () => loadTemplates(Object.values(U.objFlatten(templatePaths)));