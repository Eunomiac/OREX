// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #region ====== GreenSock Animation ====== ~
gsap, Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, // GreenSock Animation Platform
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
preloadTemplates, U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XROOT, XElem, XItem, XArm, XOrbit, XGroup, XPool, XRoll, XDie, 
// #endregion ▮▮▮▮[XItems]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Debugging & Tests]▮▮▮▮▮▮▮ ~
DB, TESTS, DBFUNCS } from "./helpers/bundler.js";
// #region ====== GreenSock Animation ====== ~
// #endregion _______ GreenSock Animation _______
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮
// @ts-expect-error Cheating by directly accessing protected member for debug purposes.
Hooks._hooks.init.unshift(() => {
    DB.groupTitle("BOOTING");
    DB.groupDisplay("BOOTING DEV-MODE");
});
// #region ████████ ON INIT: On-Initialization Hook ████████
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
// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄
Hooks.once("ready", async () => {
    DB.groupEnd();
    DB.groupEnd();
    DB.log("... Initialization Complete.");
    /*DEVCODE*/
    DB.groupTitle("READYING");
    DB.display("READYING ORE-X");
    DB.groupInfo("Preparing Debug Controls...");
    const DBCONTROLS = {
        U,
        XElem, XItem, XROOT,
        XGroup, XPool, XRoll, XArm, XOrbit,
        XDie,
        gsap,
        MotionPathPlugin,
        GSDevTools,
        pause: () => {
            gsap.ticker.sleep();
            gsap.globalTimeline.pause();
        },
        play: () => {
            gsap.ticker.wake();
            gsap.globalTimeline.play();
        },
        killAll: XROOT.InitializeXROOT
    };
    DB.groupEnd();
    DB.groupInfo("Declaring Debug Console Globals... ");
    Object.entries({ ...DBCONTROLS, ...TESTS, ...DBFUNCS }).forEach(([key, val]) => { Object.assign(globalThis, { [key]: val }); });
    DB.groupEnd();
    DB.log("ORE-X READY");
    DB.groupDisplay("Finishing Readying...");
    await U.sleep(1000);
    DB.groupEnd();
    DB.groupEnd();
    DB.log("... Readying Complete.");
    DB.groupDisplay("Initializing Roll Generation");
    // const MAINROLL =
    /*!DEVCODE*/
});