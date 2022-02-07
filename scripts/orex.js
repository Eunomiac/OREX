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
// #region ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮ ~
MAIN, 
// #endregion ▮▮▮▮[Constants]▮▮▮▮
// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
gsap, Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, // GreenSock Animation Platform
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
preloadTemplates, U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XItem, XGroup, XDie
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "./helpers/bundler.js";
/*DEVCODE*/
// import DB from "./helpers/debug.js";
/*!DEVCODE*/
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
// #region ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", () => __awaiter(void 0, void 0, void 0, function* () {
    /*DEVCODE*/ console.log("STARTING ORE-X"); /*!DEVCODE*/
    // #region ▮▮▮▮▮▮▮[Configuration] Apply Configuration Settings ▮▮▮▮▮▮▮
    // Object.assign(CONFIG, {OREX: MAIN as list});
    CONFIG.OREX = MAIN;
    // #endregion ▮▮▮▮[Configuration]▮▮▮▮
    // #region ▮▮▮▮▮▮▮[Handlebar Templates] Preload Handlebars Templates ▮▮▮▮▮▮▮
    return preloadTemplates();
    // #endregion ▮▮▮▮[Handlebar Templates]▮▮▮▮
}));
// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄
/*DEVCODE*/
Hooks.once("ready", () => {
    console.log({
        "this": this,
        U,
        XItem,
        XGroup,
        XDie,
        gsap,
        MotionPathPlugin,
        GSDevTools,
        "pause": () => gsap.globalTimeline.pause(),
        "play": () => gsap.globalTimeline.play()
    });
    const TestXItem = new XItem({ id: "test-item", template: U.getTemplatePath("xcontainer.hbs"), parent: XItem.XCONTAINER });
    console.log(TestXItem);
});
/*!DEVCODE*/ 
