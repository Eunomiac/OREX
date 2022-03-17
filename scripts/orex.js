// #region ████████ IMPORTS ████████ ~
import { 
// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
gsap, Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, // GreenSock Animation Platform
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
preloadTemplates, U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XElem, XItem, XGroup, XPool, XRoll, XDie, 
// #endregion ▮▮▮▮[XItems]▮▮▮▮
/*DEVCODE*/
// #region ▮▮▮▮▮▮▮[Debugging & Tests]▮▮▮▮▮▮▮ ~
DB, TESTS
// #endregion ▮▮▮▮[Debugging & Tests]▮▮▮▮
/*!DEVCODE*/
 } from "./helpers/bundler.js";
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
// @ts-expect-error Cheating by directly accessing protected member for debug purposes.
Hooks._hooks.init.unshift(() => {
    DB.title("BOOTING");
    DB.groupDisplay("BOOTING DEV-MODE");
});
// #region ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {
    DB.groupEnd();
    DB.log("DEV-MODE BOOTED");
    DB.title("INITIALIZING");
    DB.display("INITIALIZING ORE-X");
    DB.groupInfo("Preloading Templates...");
    preloadTemplates();
    DB.groupEnd();
    DB.groupInfo("Rendering XROOT to DOM");
    XItem.InitializeXROOT();
    DB.groupEnd();
    DB.log("ORE-X INITIALIZED");
    DB.groupDisplay("Continuing  Initialization ...");
});
// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄
Hooks.once("ready", async () => {
    DB.groupEnd();
    DB.log("... Initialization Complete.");
    /*DEVCODE*/
    DB.title("READYING");
    DB.display("READYING ORE-X");
    DB.groupInfo("Preparing Debug Controls...");
    const DBCONTROLS = {
        U,
        XElem, XItem,
        XGroup, XPool, XRoll,
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
        killAll: XItem.InitializeXROOT
    };
    DB.groupEnd();
    DB.groupInfo("Declaring Debug Console Globals... ");
    Object.entries({ ...DBCONTROLS, ...TESTS }).forEach(([key, val]) => { Object.assign(globalThis, { [key]: val }); });
    DB.groupEnd();
    DB.groupInfo("Initializing Test XRoll... ");
    const ROLL = await TESTS.createRoll([3, 4, 5, 2]);
    Object.assign(globalThis, { ROLL });
    DB.groupEnd();
    DB.log("ORE-X READY");
    DB.groupDisplay("Finishing Readying...");
    setTimeout(() => {
        DB.groupEnd();
        DB.log("... Readying Complete.");
    }, 1000);
    /*!DEVCODE*/
});