// #region ▮▮▮▮▮▮▮[IMPORTS]▮▮▮▮▮▮▮ ~
import { default as baseU } from "./utilities.js";
import { getTemplatePath } from "./templates.js";
import { default as XElem } from "../xclasses/xelem.js";
import { default as XItem } from "../xclasses/xitem.js";
import { default as XGroup, XROOT, XPool, XRoll, XArm, XOrbit, XOrbitType } from "../xclasses/xgroup.js";
import { default as XDie, XMod, XTermType } from "../xclasses/xterm.js";
import { XGhost, XMutator, XInfo } from "../xclasses/xmod.js";
import { default as XPad } from "../xclasses/xpad.js";
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮
// #region ████████ EXPORTS: Aggregated Object Exports ████████
// #region ░░░░░░░ Utilities & Constants ░░░░░░░ ~
export const U = { ...baseU, getTemplatePath };
export { default as C } from "./config.js";
// #endregion ░░░░[Utilities & Constants]░░░░
// #region ░░░░░░░ Debugging ░░░░░░░ ~
import { default as DB } from "./debugger.js";
export { TESTS, DBFUNCS } from "./debugger.js";
// #endregion ░░░░[Debugging]░░░░
// #region ░░░░░░░ GSAP Animation ░░░░░░░ ~
export { default as gsap, Draggable as Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, RoughEase } from "/scripts/greensock/esm/all.js";
export { default as preloadTemplates } from "./templates.js";
// #endregion ░░░░[GSAP Animation]░░░░
// #region ████████ XItems ████████
export { DB, XElem, XItem, XGroup, XROOT, XPool, XRoll, XArm, XOrbit, XOrbitType, XDie, XMod, XTermType, XGhost, XMutator, XInfo, XPad };
// #endregion ▄▄▄▄▄ TYPES ▄▄▄▄▄
// #region ████████ FACTORIES: Abstract XItem Creation Factory ████████ ~
class XFactoryBase {
    async Make(xParent, options = {}, onRenderOptions = {}, postRenderFuncs = []) {
        const [xItem, defaultPostRenderFuncs] = this.factoryMethod(xParent, options, onRenderOptions, postRenderFuncs);
        await xItem.render();
        xParent?.adopt(xItem);
        try {
            xItem.constructor.Register(xItem);
        }
        catch (err) {
            DB.display(`Error with ${xItem.constructor.name}'s 'Registry' static method.`, err);
        }
        xItem.set({ ...xItem.renderOptions, ...onRenderOptions });
        await Promise.all([...defaultPostRenderFuncs, ...postRenderFuncs].map((func) => func(xItem)));
        return xItem;
    }
}
function classBuilder(ClassRef, defaultOptions = {}, defaultRenderOptions = {}, defaultPostRenderFuncs = []) {
    class ThisFactory extends XFactoryBase {
        factoryMethod(xParent, options, onRenderOptions = defaultRenderOptions, postRenderFuncs = []) {
            options = U.objMerge(defaultOptions, options);
            onRenderOptions = U.objMerge(defaultRenderOptions, onRenderOptions);
            postRenderFuncs = [...defaultPostRenderFuncs, ...postRenderFuncs];
            return [new ClassRef(xParent, options, onRenderOptions), postRenderFuncs];
        }
    }
    return new ThisFactory();
}
const FACTORIES = {
    XItem: classBuilder(XItem),
    XGroup: classBuilder(XGroup),
    XPool: classBuilder(XPool),
    XRoll: classBuilder(XRoll),
    XDie: classBuilder(XDie, { id: "xdie" }, {
        "--die-size": "40px",
        "--die-color-fg": "black"
    }),
    XArm: classBuilder(XArm, { id: "-" }, {
        // height: 0,
        // width: 0,
        transformOrigin: "0% 50%",
        top: "50%",
        left: "50%",
        xPercent: 0,
        yPercent: 0
    }),
    XOrbit: classBuilder(XOrbit)
};
export { FACTORIES };
// #endregion ▄▄▄▄▄ FACTORIES ▄▄▄▄▄
// #region ████████ ENUMS: TypeScript Enums ████████
export { Dir } from "./utilities.js";
// #endregion ▄▄▄▄▄ ENUMS ▄▄▄▄▄