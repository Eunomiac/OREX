
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U } from "./bundler.js";
export const getTemplatePath = (fileRelativePath) => `/systems/orex/templates/${`${fileRelativePath}.hbs`.replace(/\.*\/*\\*(?:systems|orex|templates)\/*\\*|(\..{2,})\.hbs$/g, "$1")}`;
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