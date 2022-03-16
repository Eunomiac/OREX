
// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮
gsap, Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, // GreenSock Animation Platform
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
<<<<<<< HEAD
<<<<<<< Updated upstream
preloadTemplates, U, DB, 
=======
preloadTemplates, U, 
>>>>>>> Stashed changes
=======
preloadTemplates, registerXEffects, U, 
>>>>>>> a9a1a28c472c9a7438b75d41370888a95a9074c2
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