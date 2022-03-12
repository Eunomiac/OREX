// #region ████████ IMPORTS ████████ ~
import { 
// #region ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮ ~
C, 
// #endregion ▮▮▮▮[Constants]▮▮▮▮
// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
gsap, Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, // GreenSock Animation Platform
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
preloadTemplates, U, DB, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XElem, XItem, XGroup, XPool, XRoll, XDie, XTermType
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "./helpers/bundler.js";
/*DEVCODE*/ // import DB from "./helpers/debug.js"; /*!DEVCODE*/
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
// #region ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", async () => {
    /*DEVCODE*/
    // (<Partial<Game>>game).settings?.set("orex", "debug", true);
    DB.display("STARTING ORE-X");
    // CONFIG.debug.hooks = true;
    /*!DEVCODE*/
    // #region ▮▮▮▮▮▮▮ Apply Configuration Settings ▮▮▮▮▮▮▮
    preloadTemplates();
    // #endregion ▮▮▮▮[Configuration]▮▮▮▮
    // #region ▮▮▮▮▮▮▮ DOM Initialization ▮▮▮▮▮▮▮ ~
    XItem.InitializeXROOT();
    // #endregion ▮▮▮▮[DOM]▮▮▮▮
});
// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄
/*DEVCODE*/
Hooks.once("ready", () => {
    const DBCONTROLS = {
        U,
        XElem,
        XItem,
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
        testCoords: () => {
            const TranslateBox = new XPool(XItem.XROOT, {
                id: "translate-box",
                classes: ["translate-box"],
                onRender: {
                    set: {
                        xPercent: 0,
                        yPercent: 0
                    },
                    to: {
                        x: "+=500",
                        duration: 5,
                        ease: "power3.inOut",
                        repeat: -1,
                        yoyo: true
                    }
                }
            });
            const ScaleBox = new XGroup(TranslateBox, {
                id: "scale-box-1",
                classes: ["scale-box"],
                onRender: {
                    set: {
                        xPercent: 0,
                        yPercent: 0
                    },
                    to: {
                        scale: 2,
                        duration: 15,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true
                    }
                }
            });
            const ExtraScaleBox = new XGroup(ScaleBox, {
                id: "scale-box-2",
                classes: ["extra-scale-box"],
                onRender: {
                    set: {
                        xPercent: 0,
                        yPercent: 0
                    },
                    to: {
                        scale: 3,
                        duration: 5,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true
                    }
                }
            });
            const RotateBox = new XGroup(ExtraScaleBox, {
                id: "rotate-box-1",
                classes: ["rotate-box"],
                onRender: {
                    set: {
                        xPercent: 0,
                        yPercent: 0
                    },
                    to: {
                        rotation: "+=360",
                        duration: 2,
                        ease: "none",
                        repeat: -1
                    }
                }
            });
            const CounterRotateBox = new XGroup(RotateBox, {
                id: "rotate-box-2",
                classes: ["rotate-box"],
                onRender: {
                    set: {
                        xPercent: 0,
                        yPercent: 0
                    },
                    to: {
                        rotation: "-=360",
                        duration: 2,
                        ease: "power4.inOut",
                        repeat: -1
                    }
                }
            });
            const TestDie = new XDie(CounterRotateBox, { id: "test-die", type: XTermType.BasicDie, value: 3, color: "lime", size: 50 });
            const dieMarkers = [
                { x: 0.5, y: 0, background: "yellow" },
                { x: 0, y: 1, background: "cyan" },
                { x: 1, y: 1, background: "magenta" }
            ].map(({ x, y, background }, i) => new XItem(TestDie, {
                id: `die-marker-${i + 1}`,
                classes: ["x-marker"],
                onRender: {
                    set: {
                        height: 10,
                        width: 10,
                        x: x * 50,
                        y: y * 50,
                        background
                    }
                }
            }));
            const xMarkers = ["yellow", "cyan", "magenta"]
                .map((background, i) => new XItem(XItem.XROOT, {
                id: `x-marker-${i + 1}`,
                classes: ["x-marker"],
                onRender: {
                    set: {
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
            DB.log("Test Die Objs =>", dieMarkers, xMarkers, TranslateBox, ScaleBox, RotateBox, TestDie);
        },
        makePool: (xParent = XItem.XROOT, { id, x, y, size, color, orbitals }) => {
            return new XPool(xParent, {
                id,
                onRender: {
                    set: {
                        "height": size,
                        "width": size,
                        "left": x - (0.5 * size),
                        "top": y - (0.5 * size),
                        "--bg-color": color
                    }
                },
                orbitals
            });
        },
        makeDie: ({ value = undefined, color = "white", numColor = "black", strokeColor = "black", size = 50 } = {}) => new XDie(XItem.XROOT, {
            id: "x-die",
            type: XTermType.BasicDie,
            value,
            color,
            numColor,
            strokeColor,
            size
        }),
        testGroups: async () => {
            const POOLS = [
                { x: 550, y: 350, size: 200, color: "gold", orbitals: { main: 0.75, outer: 1.25, inner: 0.25 }, dice: { main: [5, "cyan", [3, "red"]] } }
                // {x: 1150, y: 750, size: 200, color: "rgba(255, 0, 0, 0.5)", orbitals: {main: 0.6, outer: 1, inner: 0.25}, dice: {main: [6, "cyan"], outer: [10, "silver"], inner: [3, "red"]}}
            ].map(async ({ x, y, size, color, orbitals, dice }, i) => {
                const xPool = DBCONTROLS.makePool(XItem.XROOT, {
                    id: `test-pool-${i + 1}`,
                    x, y, size, color, orbitals
                });
                await xPool.initialize(); // @ts-expect-error How to tell TS the type of object literal's values?
                globalThis.CIRCLE ?? (globalThis.CIRCLE = []); // @ts-expect-error How to tell TS the type of object literal's values?
                globalThis.CIRCLE.push(xPool);
                for (const [name, [numDice, color, ...nestedPools]] of Object.entries(dice)) {
                    for (let j = 0; j < numDice; j++) {
                        const id = `${xPool.id}-x-die-${j + 1}`;
                        if (!(await xPool.addXItem(new XDie(XItem.XROOT, {
                            id,
                            type: XTermType.BasicDie,
                            value: U.randInt(0, 9),
                            color: typeof color === "string" ? color : undefined
                        }), name))) {
                            DB.error(`Error rendering xDie '${id}'`);
                        }
                    }
                    if (nestedPools.length) {
                        DB.log("Nested Pools", nestedPools);
                        for (const [nestedNumDice, nestedColor] of nestedPools) {
                            const nestedPool = DBCONTROLS.makePool(XItem.XROOT, {
                                id: `test-pool-${i + 1}-nested-pool-${U.getUID()}`,
                                x: 0,
                                y: 0,
                                size: 75,
                                color: nestedColor,
                                orbitals: C.xGroupOrbitalDefaults
                            });
                            await xPool.addXItem(nestedPool, name);
                            await nestedPool.initialize();
                            for (let k = 0; k < nestedNumDice; k++) {
                                const id = `${nestedPool.id}-x-die-${k + 1}`;
                                if (!(await nestedPool.addXItem(new XDie(XItem.XROOT, {
                                    id,
                                    type: XTermType.BasicDie,
                                    value: U.randInt(0, 9),
                                    color: typeof nestedColor === "string" ? nestedColor : undefined
                                }), name))) {
                                    DB.error(`Error rendering xDie '${id}'`);
                                }
                            }
                        }
                    }
                }
            });
            return Promise.allSettled(POOLS);
        },
        killAll: XItem.InitializeXROOT
    };
    Object.entries(DBCONTROLS).forEach(([key, val]) => { Object.assign(globalThis, { [key]: val }); });
    setTimeout(() => {
        // @ts-expect-error DEBUGGING CODE
        globalThis.testGroups();
    }, 1000);
    return;
    // @ts-expect-error DEBUGGING CODE
    globalThis.testCoords();
    setTimeout(() => {
        // @ts-expect-error DEBUGGING CODE
        globalThis.killAll();
        setTimeout(() => {
            // @ts-expect-error DEBUGGING CODE
            globalThis.testGroups();
        }, 1000);
    }, 5000);
});
/*!DEVCODE*/ 