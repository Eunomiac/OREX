// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
} from "./bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export default async () => loadTemplates(Object.values({
	xContainer: U.getTemplatePath("xcontainer.hbs"),
	xDie: U.getTemplatePath("xdie.hbs")
	// Template Paths by Category; use U.getTemplatePath(fileName, subPath)
}).flat());