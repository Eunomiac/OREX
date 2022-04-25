
// ▮▮▮▮▮▮▮[IMPORTS]▮▮▮▮▮▮▮
import { default as baseU } from "./utilities.js";
import { getTemplatePath } from "./templates.js";
import { default as XItem, XBaseContainer, XROOT } from "../xclasses/xitem.js";
import { default as XGroup, XPool, XRoll, XArm, XOrbit } from "../xclasses/xgroup.js";
import { default as XDie, XMod } from "../xclasses/xterm.js";
import { XGhost, XMutator, XInfo } from "../xclasses/xmod.js";
import { default as XPad } from "../xclasses/xpad.js";
// ████████ EXPORTS: Aggregated Object Exports ████████
// ░░░░░░░ Utilities & Constants ░░░░░░░
export const U = { ...baseU, getTemplatePath };
export { default as C } from "./config.js";
// ░░░░░░░ Debugging ░░░░░░░
import { default as DB } from "./debugger.js";
// import type {XDisplayOptions} from "./debugger.js";
export { DBFUNCS } from "./debugger.js";
// ░░░░░░░ GSAP Animation ░░░░░░░
export { default as gsap, Draggable as Dragger, InertiaPlugin, MotionPathPlugin, RoughEase } from "/scripts/greensock/esm/all.js";
export { default as preloadTemplates } from "./templates.js";
// ████████ XItems ████████
export { DB, XItem, XBaseContainer, XGroup, XROOT, XPool, XRoll, XArm, XOrbit, XDie, XMod, XGhost, XMutator, XInfo, XPad };
// export {default as XAnimVars, XGSAP, isTimeline} from "./animations.js";

// ████████ TYPES: TypeScript Type Definitions ████████
// import type {Position, XAnim, Renderable, Tweenable} from "../xclasses/xelem.js";
// import XOptions from "../xclasses/xitem.js";
// export interface lockedXItem<T extends XItem> extends XItem {
// 	xParent: XGroup
// }
// // ████████ FACTORIES: Abstract XItem Creation Factory ████████
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
//
// };
// export {FACTORIES};
//