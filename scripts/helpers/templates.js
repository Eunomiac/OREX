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
U
// #endregion ▮▮▮▮[Utility]▮▮▮▮
 } from "./bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
export default () => __awaiter(void 0, void 0, void 0, function* () {
    return loadTemplates(Object.values({
        xContainer: U.getTemplatePath("xcontainer.hbs")
        // Template Paths by Category; use U.getTemplatePath(fileName, subPath)
    }).flat());
});
