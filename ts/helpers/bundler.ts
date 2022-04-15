// #region ▮▮▮▮▮▮▮[IMPORTS]▮▮▮▮▮▮▮ ~
import {default as baseU} from "./utilities.js";
import {getTemplatePath} from "./templates.js";

import {default as XElem} from "../xclasses/xelem.js";
import {default as XItem} from "../xclasses/xitem.js";
import {default as XGroup, XROOT, XPool, XRoll, XArm, XOrbit, XOrbitType} from "../xclasses/xgroup.js";
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
import type {XDisplayOptions} from "./debugger.js";
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
export {DB, XElem, XItem, XGroup, XROOT, XPool, XRoll, XArm, XOrbit, XOrbitType, XDie, XMod, XTermType, XGhost, XMutator, XInfo, XPad};
// export {default as XAnimVars, XGSAP, isTimeline} from "./animations.js";
// #endregion ▄▄▄▄▄ XItems ▄▄▄▄▄
// #endregion ▄▄▄▄▄ EXPORTS ▄▄▄▄▄

// #region ████████ TYPES: TypeScript Type Definitions ████████
import type {int, float, posInt, posFloat, HTMLCode, List, Index, ConstructorOf, KnownKeys, Concrete} from "./utilities.js";
import type {Position, XAnim, Renderable, Tweenable} from "../xclasses/xelem.js";
import type {XItemOptions} from "../xclasses/xitem.js";
import type {XGroupOptions, XPoolOptions, XOrbitOptions, XOrbitSpecs, XRollOptions} from "../xclasses/xgroup.js";
import type {XTerm, XTermOptions, XDieValue, XDieFace, XDieOptions} from "../xclasses/xterm.js";
import type {XModOptions} from "../xclasses/xmod.js";

export type {int, float, posInt, posFloat, HTMLCode, List, Index, ConstructorOf, KnownKeys, Concrete,
	Position, XAnim, Renderable, Tweenable, XItemOptions, XGroupOptions, XPoolOptions, XOrbitSpecs, XRollOptions,
	XTerm, XTermOptions, XDieValue, XDieFace, XDieOptions, XModOptions};
// #endregion ▄▄▄▄▄ TYPES ▄▄▄▄▄

// #region ████████ FACTORIES: Abstract XItem Creation Factory ████████ ~
abstract class XFactoryBase<ClassType extends typeof XItem, OptionsType extends XItemOptions, ParentClass extends typeof XGroup>{
	async Make(
		xParent: InstanceType<ParentClass>,
		options: Partial<OptionsType> = {},
		onRenderOptions: Partial<gsap.CSSProperties> = {},
		postRenderFuncs: Array<(xItem: InstanceType<ClassType>) => void> = []
	) {
		const [xItem, defaultPostRenderFuncs] = this.factoryMethod(xParent, options, onRenderOptions, postRenderFuncs);
		await xItem.render();
		xParent?.adopt(xItem);
		try {
			(xItem.constructor as ClassType).Register(xItem);
		} catch (err) {
			DB.display(`Error with ${xItem.constructor.name}'s 'Registry' static method.`, err);
		}
		xItem.set({...xItem.renderOptions, ...onRenderOptions});
		await Promise.all([...defaultPostRenderFuncs, ...postRenderFuncs].map((func) => func(xItem)));
		return xItem;
	}
	protected abstract factoryMethod(
			xParent: InstanceType<ParentClass>,
			options: Partial<OptionsType>,
			onRenderOptions: Partial<gsap.CSSProperties>,
			postRenderFuncs: Array<(xItem: InstanceType<ClassType>) => void>
	): [InstanceType<ClassType>, Array<(xItem: InstanceType<ClassType>) => void>]
}

function classBuilder<
		ClassType extends typeof XItem|typeof XGroup,
		OptionsType extends XItemOptions,
		ParentClass extends typeof XGroup
	>(
	ClassRef: ClassType,
	defaultOptions: Partial<OptionsType> = {},
	defaultRenderOptions: Partial<gsap.CSSProperties> = {},
	defaultPostRenderFuncs: Array<(xItem: InstanceType<ClassType>) => void> = []
) {
	class ThisFactory extends XFactoryBase<ClassType,OptionsType,ParentClass> {
		protected override factoryMethod(
			xParent: InstanceType<ParentClass>,
			options: OptionsType,
			onRenderOptions: Partial<gsap.CSSProperties> = defaultRenderOptions,
			postRenderFuncs: Array<(xItem: InstanceType<ClassType>) => void> = []
		): [InstanceType<ClassType>, Array<(xItem: InstanceType<ClassType>) => void>] {
			options = U.objMerge(defaultOptions, options) as OptionsType;
			onRenderOptions = U.objMerge(defaultRenderOptions, onRenderOptions);
			postRenderFuncs = [...defaultPostRenderFuncs, ...postRenderFuncs];
			return [new ClassRef(xParent, options, onRenderOptions) as InstanceType<ClassType>, postRenderFuncs];
		}
	}
	return new ThisFactory();
}

const FACTORIES = {
	XItem: classBuilder<typeof XItem, XItemOptions, typeof XGroup>(XItem),
	XGroup: classBuilder<typeof XGroup, XGroupOptions, typeof XGroup>(XGroup),
	XPool: classBuilder<typeof XPool, XPoolOptions, typeof XGroup>(XPool),
	XRoll: classBuilder<typeof XRoll, XRollOptions, typeof XGroup>(XRoll),
	XDie: classBuilder<typeof XDie, XDieOptions, typeof XGroup>(XDie, {id: "xdie"}, {
		"--die-size": "40px",
		"--die-color-fg": "black"
	}),
	XArm: classBuilder<typeof XArm, XItemOptions, typeof XOrbit>(XArm, {id: "-"}, {
		transformOrigin: "0% 50%",
		top: "50%",
		left: "50%",
		xPercent: 0,
		yPercent: 0
	}),
	XOrbit: classBuilder<typeof XOrbit, XOrbitOptions, typeof XPool>(XOrbit),
	/*DEVCODE*/
	XDisplay: classBuilder<typeof XDisplay, XDisplayOptions, typeof XROOT>(XDisplay, {id: "DISPLAY"}, {
		xPercent: 0,
		yPercent: 0
	})
	/*!DEVCODE*/
};
export {FACTORIES};
// #endregion ▄▄▄▄▄ FACTORIES ▄▄▄▄▄

// #region ████████ ENUMS: TypeScript Enums ████████
export {Dir} from "./utilities.js";
// #endregion ▄▄▄▄▄ ENUMS ▄▄▄▄▄
