// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XElem
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "./bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄

export default async () => loadTemplates(Object.values({
	xRoot: XElem.getTemplatePath("xroot"),
	xItem: XElem.getTemplatePath("xitem"),
	xArm: XElem.getTemplatePath("xarm"),
	xDie: XElem.getTemplatePath("xdie")
}).flat());