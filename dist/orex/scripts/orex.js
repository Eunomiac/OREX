
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
gsap, Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, // GreenSock Animation Platform
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
preloadTemplates, registerXEffects, U, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XElem, XItem, XGroup, XPool, XRoll, XDie, 
 } from "./helpers/bundler.js";
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
registerXEffects();
// ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {
    DB.display("INITIALIZATION: ORE-X");
    DB.groupLog("Preloading Templates ...");
    preloadTemplates();
    DB.groupEnd();
    DB.groupLog("Rendering XROOT to DOM");
    XItem.InitializeXROOT();
    DB.groupEnd();
    DB.log("ORE-X INITIALIZED");
    DB.groupDisplay("INITIALIZATION: Finishing Up...");
});