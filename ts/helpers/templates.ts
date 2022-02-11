// #region ████████ IMPORTS ████████ ~
import {
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XItem
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "./bundler.js";
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄


export const getTemplatePath = (fileRelativePath: string) => `/systems/orex/templates/${
	`${fileRelativePath}.hbs`.replace(/\.*\/*\\*(?:systems|orex|templates)\/*\\*|(\..{2,})\.hbs$/g, "$1")
}`;

export default async () => loadTemplates(Object.values(U.objFlatten({
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
