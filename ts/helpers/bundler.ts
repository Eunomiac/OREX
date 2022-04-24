// #region ▮▮▮▮▮▮▮[IMPORTS]▮▮▮▮▮▮▮ ~
import {default as baseU} from "./utilities.js";
import {getTemplatePath} from "./templates.js";

import {default as XItem, XBaseContainer, XROOT} from "../xclasses/xitem.js";
import {default as XGroup, XPool, XRoll, XArm, XOrbit} from "../xclasses/xgroup.js";
import {default as XDie, XMod, XTermType} from "../xclasses/xterm.js";
import {XGhost, XMutator, XInfo} from "../xclasses/xmod.js";
import {default as XPad} from "../xclasses/xpad.js";
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮

// #region ████████ EXPORTS: Aggregated Object Exports ████████
// #region ░░░░░░░ Utilities & Constants ░░░░░░░ ~
export const U = {...baseU, getTemplatePath};
export {default as C} from "./config.js";
// #endregion ░░░░[Utilities & Constants]░░░░
// #region ░░░░░░░ Debugging ░░░░░░░ ~
import {default as DB, XDisplay} from "./debugger.js";
// import type {XDisplayOptions} from "./debugger.js";
export {TESTS, DBFUNCS} from "./debugger.js";
// #endregion ░░░░[Debugging]░░░░
// #region ░░░░░░░ GSAP Animation ░░░░░░░ ~
export {
	default as gsap,
	Draggable as Dragger,
	InertiaPlugin,
	MotionPathPlugin,
	RoughEase
} from "gsap/all";
export {default as preloadTemplates} from "./templates.js";
// #endregion ░░░░[GSAP Animation]░░░░

// #region ████████ XItems ████████
export {DB, XItem, XBaseContainer, XGroup, XROOT, XPool, XRoll, XArm, XOrbit, XDie, XMod, XTermType, XGhost, XMutator, XInfo, XPad};
// export {default as XAnimVars, XGSAP, isTimeline} from "./animations.js";
// #endregion ▄▄▄▄▄ XItems ▄▄▄▄▄
// #endregion ▄▄▄▄▄ EXPORTS ▄▄▄▄▄

// #region ████████ TYPES: TypeScript Type Definitions ████████

// import type {Position, XAnim, Renderable, Tweenable} from "../xclasses/xelem.js";
// import XOptions from "../xclasses/xitem.js";
import type {XPoolOptions, XRollOptions} from "../xclasses/xgroup.js";
import type {XTerm, XTermOptions, XDieValue, XDieFace, XDieOptions} from "../xclasses/xterm.js";
import type {XModOptions} from "../xclasses/xmod.js";

export type {XPoolOptions, XRollOptions,
	XTerm, XTermOptions, XDieValue, XDieFace, XDieOptions, XModOptions};

// export interface lockedXItem<T extends XItem> extends XItem {
// 	xParent: XGroup
// }
// #endregion ▄▄▄▄▄ TYPES ▄▄▄▄▄

// // #region ████████ FACTORIES: Abstract XItem Creation Factory ████████ ~

// // export type XInitFunc = (xItem: XItem) => void;
// // export interface RenderOptions {
// // 	preRenderFuncs?: XInitFunc[];
// // 	postRenderFuncs?: XInitFunc[];
// // 	postRenderVars?: Partial<gsap.CSSProperties>;
// // 	postInitFuncs?: XInitFunc[];
// // }
// abstract class XFactoryBase<ClassType extends typeof XItem, ParentClass extends typeof XGroup>{
// 	async Make(
// 		xParent: InstanceType<ParentClass>,
// 		renderOptions: Partial<XTweenVars> = {}
// 	): Promise<InstanceType<ClassType>> {

// 		const xItem = this.factoryMethod(xParent);
// 		await Promise.all(preRenderFuncs.map(async (func) => func(xItem)));
// 		await xItem.render();
// 		await Promise.all(postRenderFuncs.map(async (func) => func(xItem)));
// 		xItem.set(postRenderVars);
// 		xParent.adopt(xItem);
// 		try {
// 			(xItem.constructor as ClassType).Register(xItem);
// 		} catch (err) {
// 			DB.display(`Error with ${xItem.constructor.name}'s 'Registry' static method.`, err);
// 		}
// 		await xItem.initialize();
// 		await Promise.all(postInitFuncs.map(async (func) => func(xItem)));
// 		return xItem as lockedXItem<InstanceType<ClassType>>;
// 	}
// 	protected abstract factoryMethod(xParent: InstanceType<ParentClass>): InstanceType<ClassType>;
// }

// function classBuilder<ClassType extends typeof XItem|typeof XGroup, ParentClass extends typeof XGroup>(ClassRef: ClassType, defaultRenderOptions: RenderOptions) {
// 	class ThisFactory extends XFactoryBase<ClassType,ParentClass> {
// 		protected override factoryMethod(xParent: InstanceType<ParentClass>): InstanceType<ClassType> {
// 			return new ClassRef(xParent) as InstanceType<ClassType>;
// 		}
// 	}
// 	return new ThisFactory();
// }

// const FACTORIES = {
// 	XItem: classBuilder<typeof XItem, XItemOptions, typeof XGroup>(XItem),
// 	XGroup: classBuilder<typeof XGroup, XGroupOptions, typeof XGroup>(XGroup),
// 	XPool: classBuilder<typeof XPool, XPoolOptions, typeof XGroup>(XPool),
// 	XRoll: classBuilder<typeof XRoll, XRollOptions, typeof XGroup>(XRoll),
// 	XDie: classBuilder<typeof XDie, XDieOptions, typeof XGroup>(XDie, {id: "xdie"}),
// 	XArm: classBuilder<typeof XArm, XItemOptions, typeof XOrbit>(XArm, {id: "-"}, {
// 		transformOrigin: "0% 50%",
// 		top: "50%",
// 		left: "50%",
// 		xPercent: 0,
// 		yPercent: 0
// 	}),
// 	XOrbit: classBuilder<typeof XOrbit, XOrbitOptions, typeof XPool>(XOrbit),
// 	/*DEVCODE*/
// 	XDisplay: classBuilder<typeof XDisplay, XItemOptions, typeof XROOT>(XDisplay, {id: "DISPLAY"}, {
// 		xPercent: 0,
// 		yPercent: 0
// 	})
// 	/*!DEVCODE*/
// };
// export {FACTORIES};
// // #endregion ▄▄▄▄▄ FACTORIES ▄▄▄▄▄

// #region ████████ ENUMS: TypeScript Enums ████████
export {Dir} from "./utilities.js";
// #endregion ▄▄▄▄▄ ENUMS ▄▄▄▄▄
