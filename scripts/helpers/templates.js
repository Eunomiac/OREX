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
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U } from "./bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
export const getTemplatePath = (fileRelativePath) => `/systems/orex/templates/${`${fileRelativePath}.hbs`.replace(/\.*\/*\\*(?:systems|orex|templates)\/*\\*|(\..{2,})\.hbs$/g, "$1")}`;
export default () => __awaiter(void 0, void 0, void 0, function* () {
    return loadTemplates(Object.values(U.objFlatten({
        XITEMS: {
            xRoot: getTemplatePath("xroot"),
            xItem: getTemplatePath("xitem"),
            xArm: getTemplatePath("xarm"),
            xDie: getTemplatePath("xdie")
        },
        CHAT: {
            oRoll: getTemplatePath("chat/oroll")
        }
    })));
});
