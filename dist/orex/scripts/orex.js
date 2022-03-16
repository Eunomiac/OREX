
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮
C, 
// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
gsap, Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, // GreenSock Animation Platform
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
<<<<<<< Updated upstream
preloadTemplates, U, DB, 
=======
preloadTemplates, U, 
>>>>>>> Stashed changes
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XElem, XItem, XGroup, XPool, XRoll, XDie, XTermType
 } from "./helpers/bundler.js";
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
// ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {
    // ▮▮▮▮▮▮▮ Apply Configuration Settings ▮▮▮▮▮▮▮
    preloadTemplates();
    // ▮▮▮▮▮▮▮ DOM Initialization ▮▮▮▮▮▮▮
    XItem.InitializeXROOT();
});