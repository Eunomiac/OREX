// ████████ IMPORTS ████████
import { 
// ▮▮▮▮▮▮▮[Constants]▮▮▮▮▮▮▮
C, 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
U, 
// ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮
XItem, XGroup, XPool, XDie, XTermType, XOrbitType, XRoll
 } from "./bundler.js";
const XDebugger = (type, message, ...content) => {
    if (C.isDebugging) {
        const styleLine = Object.entries({
            ...STYLES.base,
            ...STYLES[type] ?? {}
        }).map(([prop, val]) => `${prop}: ${val};`).join(" ");
        if (content.length) {
            if (content[0] === "NOGROUP") {
                console.log(`%c${message}`, styleLine);
            }
            else {
                console.groupCollapsed(`%c${message}`, styleLine, ...content);
                console.trace();
                console.groupEnd();
            }
        }
        else {
            console.groupCollapsed(`%c${message}`, styleLine);
        }
    }
};
const STYLES = {
    base: {
        "background": "#000000",
        "color": "#EDB620",
        "font-family": "Pragmata Pro",
        "padding": "0 25px"
    },
    display: {
        "background": "#EDB620",
        "color": "black",
        "font-family": "AlverataInformalW01-Regular",
        "font-size": "16px",
        // "margin-left": "-100px",
        "padding": "0 10vw 0 10px"
    },
    error: {
        "color": "#FF0000",
        "background": "#950A0F",
        "font-weight": "bold"
    },
    info: {
        "background": "transparent",
        "color": "white",
        "font-weight": "bold",
        "font-family": "Pragmata Pro"
    },
    groupEnd: {}
};
const DB = {
<<<<<<< HEAD
<<<<<<< Updated upstream
    group: (label) => XDebugger("group", label),
    groupEnd: () => XDebugger("groupEnd", ""),
    display: (message, ...content) => XDebugger("display", message, ...content),
    log: (message, ...content) => XDebugger("base", message, ...content),
    error: (message, ...content) => XDebugger("error", message, ...content)
=======
=======
>>>>>>> a9a1a28c472c9a7438b75d41370888a95a9074c2
    display: (message, ...content) => XDebugger("display", message, ...(content.length ? content : ["NOGROUP"])),
    log: (message, ...content) => XDebugger("base", message, ...(content.length ? content : ["NOGROUP"])),
    info: (message, ...content) => XDebugger("info", message, ...(content.length ? content : ["NOGROUP"])),
    error: (message, ...content) => XDebugger("error", message, ...(content.length ? content : ["NOGROUP"])),
    groupDisplay: (label) => XDebugger("display", label),
    groupLog: (label) => XDebugger("base", label),
    groupInfo: (label) => XDebugger("info", label),
    groupError: (label) => XDebugger("error", label),
    groupEnd: () => console.groupEnd()
<<<<<<< HEAD
};
const TESTS = {
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
    makePool: (xParent = XItem.XROOT, { id, x, y, size = 200, color = "cyan", orbitals = C.xGroupOrbitalDefaults }) => {
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
            orbitals: {
                [XOrbitType.Main]: { radiusRatio: -0.8, rotationRate: 0.5 },
                [XOrbitType.Outer]: { radiusRatio: 1.5, rotationRate: 1 },
                [XOrbitType.Core]: { radiusRatio: 0.15, rotationRate: 1 }
            }
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
            // {x: 550, y: 350, size: 200, color: "gold", orbitals: {main: 0.75, outer: 1.25, inner: 0.25}, dice: {main: [5, "cyan", [3, "red"]]}},
            {
                x: 950, y: 650, size: 400, color: "rgba(255, 0, 0, 0.5)",
                orbitals: {
                    [XOrbitType.Core]: { radiusRatio: 0.35, rotationRate: 1 },
                    [XOrbitType.Main]: { radiusRatio: 1, rotationRate: 1 },
                    [XOrbitType.Outer]: { radiusRatio: 1.5, rotationRate: 1 }
                },
                dice: {
                    main: [6, "cyan", [2, "lime"]],
                    outer: [5, "silver", [3, "gold"], [4, "rgba(0, 0, 255, 0.5)"]],
                    inner: [3, "red"]
                }
            }
        ].map(async ({ x, y, size, color, orbitals, dice }, i) => {
            const xPool = TESTS.makePool(XItem.XROOT, {
                id: `test-pool-${i + 1}`,
                x, y, size, color, orbitals
            });
            await xPool.initialize();
            globalThis.CIRCLE ?? (globalThis.CIRCLE = []);
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
                        const nestedPool = TESTS.makePool(XItem.XROOT, {
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
                            try {
                                await nestedPool.addXItem(new XDie(XItem.XROOT, {
                                    id,
                                    type: XTermType.BasicDie,
                                    value: U.randInt(0, 9),
                                    color: typeof nestedColor === "string" ? nestedColor : undefined
                                }), XOrbitType.Main);
                            }
                            catch (error) {
                                DB.error(`Error rendering xDie '${id}'`);
                            }
                        }
                    }
                }
            }
        });
        await Promise.allSettled(POOLS);

        globalThis.POOLS = POOLS;
        return Promise.allSettled(POOLS);
    },
    createRoll: async (dice) => {
        const rollPool = new XRoll(XItem.XROOT, {
            id: "test-roll",
            keepID: true,
            onRender: {
                set: {
                    x: 500,
                    y: 500,
                    height: 400,
                    width: 400
                }
            }
        });
        await rollPool.initialize();
        const dieColors = ["white", "cyan", "gold", "lime"];
        let count = 0;
        const diceToAdd = dice.flatMap((qty) => {
            const color = dieColors.shift();
            return [...new Array(qty)].map(() => new XDie(XItem.XROOT, {
                id: `xDie${(count++)}`,
                type: XTermType.BasicDie,
                value: 0,
                color
            }));
        });
        await Promise.allSettled(diceToAdd.map((xDie) => xDie.initialize()));
        rollPool.addXItems({ [XOrbitType.Main]: diceToAdd });
        return rollPool;
    }
>>>>>>> Stashed changes
=======
>>>>>>> a9a1a28c472c9a7438b75d41370888a95a9074c2
};
const TESTS = {
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
    makePool: (xParent = XItem.XROOT, { id, x, y, size = 200, color = "cyan", orbitals = C.xGroupOrbitalDefaults }) => {
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
            orbitals: {
                [XOrbitType.Main]: { radiusRatio: -0.8, rotationRate: 0.5 },
                [XOrbitType.Outer]: { radiusRatio: 1.5, rotationRate: 1 },
                [XOrbitType.Core]: { radiusRatio: 0.15, rotationRate: 1 }
            }
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
            // {x: 550, y: 350, size: 200, color: "gold", orbitals: {main: 0.75, outer: 1.25, inner: 0.25}, dice: {main: [5, "cyan", [3, "red"]]}},
            {
                x: 950, y: 650, size: 400, color: "rgba(255, 0, 0, 0.5)",
                orbitals: {
                    [XOrbitType.Core]: { radiusRatio: 0.35, rotationRate: 1 },
                    [XOrbitType.Main]: { radiusRatio: 1, rotationRate: 1 },
                    [XOrbitType.Outer]: { radiusRatio: 1.5, rotationRate: 1 }
                },
                dice: {
                    main: [6, "cyan", [2, "lime"]],
                    outer: [5, "silver", [3, "gold"], [4, "rgba(0, 0, 255, 0.5)"]],
                    inner: [3, "red"]
                }
            }
        ].map(async ({ x, y, size, color, orbitals, dice }, i) => {
            const xPool = TESTS.makePool(XItem.XROOT, {
                id: `test-pool-${i + 1}`,
                x, y, size, color, orbitals
            });
            await xPool.initialize();
            globalThis.CIRCLE ?? (globalThis.CIRCLE = []);
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
                        const nestedPool = TESTS.makePool(XItem.XROOT, {
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
                            try {
                                await nestedPool.addXItem(new XDie(XItem.XROOT, {
                                    id,
                                    type: XTermType.BasicDie,
                                    value: U.randInt(0, 9),
                                    color: typeof nestedColor === "string" ? nestedColor : undefined
                                }), XOrbitType.Main);
                            }
                            catch (error) {
                                DB.error(`Error rendering xDie '${id}'`);
                            }
                        }
                    }
                }
            }
        });
        await Promise.allSettled(POOLS);

        globalThis.POOLS = POOLS;
        return Promise.allSettled(POOLS);
    },
    createRoll: async (dice) => {
        const rollPool = new XRoll(XItem.XROOT, {
            id: "test-roll",
            keepID: true,
            onRender: {
                set: {
                    x: 500,
                    y: 500,
                    height: 200,
                    width: 200
                }
            }
        });
        await rollPool.initialize();
        const dieColors = ["white", "cyan", "gold", "lime"];
        let count = 0;
        const diceToAdd = dice.flatMap((qty) => {
            const color = dieColors.shift();
            return [...new Array(qty)].map(() => new XDie(XItem.XROOT, {
                id: `xDie${(count++)}`,
                type: XTermType.BasicDie,
                value: 0,
                color
            }));
        });
        await Promise.allSettled(diceToAdd.map((xDie) => xDie.initialize()));
        rollPool.addXItems({ [XOrbitType.Main]: diceToAdd });
        return rollPool;
    }
};
export { DB as default, TESTS };