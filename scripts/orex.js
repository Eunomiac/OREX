// #region ████████ IMPORTS ████████ ~
import { 
// #region ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮ ~
C, 
// #endregion ▮▮▮▮[Constants]▮▮▮▮
// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
gsap, Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, // GreenSock Animation Platform
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
preloadTemplates, U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XElem, XItem, XGroup, XPool, XOrbit, XDie, ORoll
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "./helpers/bundler.js";
/*DEVCODE*/ // import DB from "./helpers/debug.js"; /*!DEVCODE*/
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
// #region ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {
    /*DEVCODE*/
    console.log("STARTING ORE-X");
    // CONFIG.debug.hooks = true;
    /*!DEVCODE*/
    // #region ▮▮▮▮▮▮▮ Apply Configuration Settings ▮▮▮▮▮▮▮
    Object.assign(CONFIG, { OREX: C });
    preloadTemplates();
    // #endregion ▮▮▮▮[Configuration]▮▮▮▮
    // #region ▮▮▮▮▮▮▮ DOM Initialization ▮▮▮▮▮▮▮ ~
    XItem.InitializeXROOT();
    // #endregion ▮▮▮▮[DOM]▮▮▮▮
});
// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄
/*DEVCODE*/
Hooks.once("ready", () => {
    // SIMPLIFY THIS SHIT!  SEPARATE PARENTING FROM ELEMENTS, CONTROL ASYNC RENDER WAITS OUTSIDE OF CLASS
    Object.entries({
        U,
        XElem,
        XItem,
        XGroup, XPool, XOrbit,
        XDie,
        ORoll,
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
        testCoords: () => {
            const TranslateBox = new XPool({
                id: "translate-box",
                classes: ["translate-box"],
                parent: XItem.XROOT,
                onRender: {
                    to: {
                        x: "+=500",
                        duration: 5,
                        ease: "power3.inOut",
                        repeat: -1,
                        yoyo: true
                    }
                }
            });
            const ScaleBox = new XGroup({
                id: "scale-box-1",
                classes: ["scale-box"],
                parent: TranslateBox,
                onRender: {
                    to: {
                        scale: 2,
                        duration: 15,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true
                    }
                }
            });
            const ExtraScaleBox = new XGroup({
                id: "scale-box-2",
                classes: ["extra-scale-box"],
                parent: ScaleBox,
                onRender: {
                    to: {
                        scale: 3,
                        duration: 5,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true
                    }
                }
            });
            const RotateBox = new XGroup({
                id: "rotate-box-1",
                classes: ["rotate-box"],
                parent: ExtraScaleBox,
                onRender: {
                    to: {
                        rotation: "+=360",
                        duration: 2,
                        ease: "none",
                        repeat: -1
                    }
                }
            });
            const CounterRotateBox = new XItem({
                id: "rotate-box-2",
                classes: ["rotate-box"],
                parent: RotateBox,
                onRender: {
                    to: {
                        rotation: "-=360",
                        duration: 2,
                        ease: "power4.inOut",
                        repeat: -1
                    }
                }
            });
            const TestDie = new XDie({ id: "test-die", parent: CounterRotateBox, value: 3, color: "lime", size: 50 });
            const dieMarkers = [
                { x: 0.5, y: 0, background: "yellow" },
                { x: 0, y: 1, background: "cyan" },
                { x: 1, y: 1, background: "magenta" }
            ].map(({ x, y, background }, i) => new XItem({
                id: `die-marker-${i + 1}`,
                classes: ["x-marker"],
                parent: TestDie,
                onRender: {
                    set: {
                        xPercent: -50,
                        yPercent: -50,
                        height: 10,
                        width: 10,
                        x: x * 50,
                        y: y * 50,
                        background
                    }
                }
            }));
            const xMarkers = ["yellow", "cyan", "magenta"]
                .map((background, i) => new XItem({
                id: `x-marker-${i + 1}`,
                classes: ["x-marker"],
                onRender: {
                    set: {
                        xPercent: -50,
                        yPercent: -50,
                        height: 10,
                        width: 10,
                        x: 100 + (20 * i),
                        y: 500 + (40 * i),
                        background
                    }
                }
            }));
            xMarkers.forEach((xMarker, i) => {
                xMarker.addTicker(() => {
                    if (dieMarkers[i].isInitialized) {
                        xMarker.set(dieMarkers[i].pos);
                    }
                });
            });
            [
                TestDie,
                ...dieMarkers,
                ...xMarkers
            ].forEach((xItem) => xItem.initialize());
            console.log(dieMarkers, xMarkers, TranslateBox, ScaleBox, RotateBox, gsap, MotionPathPlugin);
            console.log(TestDie.value);
        },
        makePool: ({ x = 600, y = 400, size = 300, color = "gold", orbitals = C.xGroupOrbitalDefaults } = {}) => new XPool({
            id: `x-pool-${Array.from($(".x-pool")).length}`,
            parent: XItem.XROOT,
            onRender: {
                set: {
                    "height": size,
                    "width": size,
                    "left": x - (0.5 * size),
                    "top": y - (0.5 * size),
                    "xPercent": -50,
                    "yPercent": -50,
                    "--bg-color": color
                }
            },
            orbitals
        }),
        makeDie: ({ value = undefined, color = "white", numColor = "black", strokeColor = "black", size = 50 } = {}) => new XDie({
            id: `x-die-${Array.from($(".x-die")).length}`,
            value,
            color,
            numColor,
            strokeColor,
            size
        }),
        testGroups: async () => {
            const POOLS = [
                { x: 600, y: 400, size: 300, color: "gold", orbitals: { main: 0.75, outer: 1.5, inner: 0.25 }, dice: { main: [6, "cyan"], outer: [10, "silver"], inner: [3, "red"] } }
            ].map(async ({ x, y, size, color, orbitals, dice }) => {
                const xPool = new XPool({
                    id: "test-pool",
                    parent: XItem.XROOT,
                    onRender: {
                        set: {
                            "height": size,
                            "width": size,
                            "left": x - (0.5 * size),
                            "top": y - (0.5 * size),
                            "xPercent": -50,
                            "yPercent": -50,
                            "--bg-color": color
                        }
                    },
                    orbitals
                });
                await xPool.initialize(); // @ts-expect-error How to tell TS the type of object literal's values?
                globalThis.CIRCLE = xPool;
                for (const [name, [numDice, color]] of Object.entries(dice)) {
                    for (let i = 0; i < numDice; i++) {
                        if (!(await xPool.addXItem(new XDie({
                            id: `${xPool.id}-die-${i}`,
                            parent: null,
                            value: U.randInt(0, 9),
                            color: typeof color === "string" ? color : undefined
                        }), name))) {
                            console.warn(`Error rendering xDie '${xPool.id}-die-${i}'`);
                        }
                    }
                }
            });
            return Promise.allSettled(POOLS);
        },
        killAll: XItem.InitializeXROOT
    })
        .forEach(([key, val]) => { Object.assign(globalThis, { [key]: val }); });
    /* eslint-disable prefer-destructuring */
    const testCoords = globalThis.testCoords;
    const killAll = globalThis.killAll;
    const testGroups = globalThis.testGroups;
    /* eslint-enable prefer-destructuring */
    testCoords();
    setTimeout(() => {
        killAll();
        setTimeout(() => {
            testGroups();
        }, 1000);
    }, 5000);
});
/*!DEVCODE*/ 