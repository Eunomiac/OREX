
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮
C, 
// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
gsap, Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, // GreenSock Animation Platform
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
preloadTemplates, U, DB, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XElem, XItem, XGroup, XPool, XRoll, XDie
 } from "./helpers/bundler.js";
import { XTermType } from "./xclasses/xterm.js";
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
// ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {
    // ▮▮▮▮▮▮▮ Apply Configuration Settings ▮▮▮▮▮▮▮
    preloadTemplates();
    // ▮▮▮▮▮▮▮ DOM Initialization ▮▮▮▮▮▮▮
    XItem.InitializeXROOT();
});