// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import {
	// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
	U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XItem
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "./bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮


export const getTemplatePath = (fileRelativePath: string) => `/systems/orex/templates/${
	`${fileRelativePath}.hbs`.replace(/\.*\/*\\*(?:systems|orex|templates)\/*\\*|(\..{2,})\.hbs$/g, "$1")
}`;

const templatePaths = {
	XITEMS: {
		xRoot: getTemplatePath("xroot"),
		xItem: getTemplatePath("xitem"),
		xArm: getTemplatePath("xarm"),
		xDie: getTemplatePath("xdie"),
		xMod: getTemplatePath("xmod")
	},
	CHAT: {
		xRoll: getTemplatePath("chat/xroll")
	},
	DEBUG: {
		xDisplay: getTemplatePath("xdisplay")
	}
};

export default async () => loadTemplates(<string[]>Object.values(U.objFlatten(templatePaths)));
