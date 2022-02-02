// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
} from "./bundler.mjs";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export default async () => loadTemplates(Object.values({
	xContainer: U.getTemplatePath("xcontainer.hbs")
	// Template Paths by Category; use U.getTemplatePath(fileName, subPath)
}).flat());