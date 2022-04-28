
// ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮
import { XTermType } from "../scripts/helpers/bundler.js";
import { 
// ▮▮▮▮▮▮▮ External Libraries ▮▮▮▮▮▮▮
// ====== GreenSock Animation ======
gsap, Dragger, InertiaPlugin, MotionPathPlugin, 

// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
preloadTemplates, U, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XROOT, XItem, XArm, XOrbit, XOrbitType, XGroup, XPool, XRoll, XDie, 
// ▮▮▮▮▮▮▮[Debugging & Tests]▮▮▮▮▮▮▮
DB, DBFUNCS

 } from "./helpers/bundler.js";
// ====== GreenSock Animation ======
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin);

Hooks._hooks.init.unshift(() => {
    DB.groupTitle("BOOTING");
    DB.groupDisplay("BOOTING DEV-MODE");
});
// ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {
    DB.groupEnd();
    DB.log("DEV-MODE BOOTED");
    DB.groupEnd();
    DB.log("... Booting Complete.");
    DB.groupTitle("INITIALIZING");
    DB.display("INITIALIZING ORE-X");
    DB.groupInfo("Preloading Templates...");
    preloadTemplates();
    DB.groupEnd();
    DB.groupInfo("Rendering XROOT to DOM");
    await XROOT.InitializeXROOT();
    DB.groupEnd();
    DB.log("ORE-X INITIALIZED");
    DB.groupDisplay("Finishing Initialization ...");
});
Hooks.once("ready", async () => {
    DB.groupEnd();
    DB.groupEnd();
    DB.log("... Initialization Complete.");
});