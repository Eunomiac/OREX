
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮
C, 
// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
gsap, Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, // GreenSock Animation Platform
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
preloadTemplates, U, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XElem, XItem, XGroup, XPool, XOrbit, XDie, ORoll
 } from "./helpers/bundler.js";
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
// ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {
    // ▮▮▮▮▮▮▮ Apply Configuration Settings ▮▮▮▮▮▮▮
    Object.assign(CONFIG, { OREX: C });
    preloadTemplates();
    // ▮▮▮▮▮▮▮ DOM Initialization ▮▮▮▮▮▮▮
    XItem.InitializeXROOT();
});