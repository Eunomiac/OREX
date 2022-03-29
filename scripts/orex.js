// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #region ====== GreenSock Animation ====== ~
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
DB, TESTS, XTermType, XOrbitType
// #endregion ▮▮▮▮[Debugging & Tests]▮▮▮▮
/*!DEVCODE*/
 } from "./helpers/bundler.js";
import { XArm, XOrbit } from "./xclasses/xgroup.js";
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
    XItem.InitializeXROOT();
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
    DB.log("ORE-X READY");
    DB.groupDisplay("Finishing Readying...");
    setTimeout(async () => {
        DB.groupEnd();
        DB.groupEnd();
        DB.log("... Readying Complete.");
        DB.groupTitle("Position Test Setup");
        DB.groupLog("Instantiating Roll");
        const MainRoll = new XRoll(XItem.XROOT, {
            id: "Roll",
            onRender: {
                set: { x: 500, y: 500, height: 500, width: 500, outline: "5px solid blue" }
            }
        });
        DB.groupEnd();
        DB.groupLog("Instantiating Dice");
        const Die = new XDie(MainRoll, {
            id: "Roll-Die",
            type: XTermType.BasicDie
        });
        const FloatDie = new XDie(XItem.XROOT, {
            id: "Float-Die",
            type: XTermType.BasicDie,
            color: "red",
            onRender: {
                set: { x: 1200, y: 200 }
            }
        });
        const RandomDice = [
            { x: 200, y: 200, color: "blue" },
            { x: 400, y: 900, color: "gold" },
            { x: 800, y: 200, color: "green" },
            { x: 800, y: 900, color: "cyan" },
            { x: 50, y: 500, color: "magenta" }
        ].map((dieParams, i) => new XDie(XItem.XROOT, {
            id: `RandomDie-${i}`,
            type: XTermType.BasicDie,
            color: dieParams.color,
            onRender: {
                set: { x: dieParams.x, y: dieParams.y }
            }
        }));
        DB.groupEnd();
        DB.groupLog("Initializing FloatDie");
        await Promise.all([FloatDie, ...RandomDice].map((die) => die.initialize()));
        DB.groupEnd();
        DB.groupLog("Adding Die");
        await MainRoll.addXItem(Die, XOrbitType.Main);
        DB.groupEnd();
        DB.groupDisplay("Initializing Roll");
        await MainRoll.initialize();
        const Orbit = MainRoll.orbitals.get(XOrbitType.Main);
        // await Orbit.initialize();
        DB.groupEnd();
        DB.groupDisplay("Fetching Arm");
        const Arm = Orbit.getXKids(XArm)[0];
        DB.log("XArm", Arm);
        DB.groupEnd();
        const T = {
            Die,
            FloatDie,
            Arm,
            Orbit,
            MainRoll
        };
        const getPosData = () => {
            const posData = {};
            ["MainRoll", "Orbit", "Arm", "Die", "FloatDie"].forEach((xName) => {
                // @ts-expect-error Debugging.
                const xItem = T[xName];
                const xParent = xItem.xParent;
                const parent = MotionPathPlugin.convertCoordinates(xItem.elem, xParent.elem, xItem.xElem.origin);
                const global = MotionPathPlugin.convertCoordinates(xItem.elem, XItem.XROOT.elem, xItem.xElem.origin);
                posData[xName] = {
                    local: `{x: ${U.roundNum(xItem.pos.x)}, y: ${U.roundNum(xItem.pos.y)}, rot: ${U.roundNum(xItem.rotation)}}`,
                    origin: `{x: ${U.roundNum(xItem.xElem.origin.x)}, y: ${U.roundNum(xItem.xElem.origin.y)}}`,
                    parent: `{x: ${U.roundNum(parent.x)}, y: ${U.roundNum(parent.y)}}`,
                    global: `{x: ${U.roundNum(global.x)}, y: ${U.roundNum(global.y)}, rot: ${U.roundNum(xItem.global.rotation)}}`
                };
            });
            console.log(JSON.stringify(posData, null, 2).replace(/"/g, ""));
        };
        Object.assign(globalThis, T, { XArm, XOrbit, getPosData, RandomDice });
        DB.log("Setup Complete.");
        DB.groupDisplay("Starting Timeouts...");
        setTimeout(async () => {
            DB.groupEnd();
            DB.groupEnd();
            DB.log("Initial Position Data");
            getPosData();
            return;
            DB.groupTitle("Initializing Test XRoll... ");
            const nestedRolls = await Promise.all([
                [[8], { height: 150, width: 150, dieColor: "purple", poolColor: "gold" }],
                [[3], { height: 100, width: 100, dieColor: "blue", poolColor: "orange" }],
                [[3], { height: 75, width: 75, dieColor: "magenta", poolColor: "lime" }]
            ].map(([dice, params]) => TESTS.createRoll(dice, params)));
            const ROLL = await TESTS.createRoll([7], { x: 1250, y: 500 }, nestedRolls);
            Object.assign(globalThis, { ROLL, nestedRolls });
            DB.groupEnd();
            setTimeout(() => TESTS.xArmTest(ROLL), 500);
        }, U.randInt(1000, 5000));
    }, 1000);
    /*!DEVCODE*/
});