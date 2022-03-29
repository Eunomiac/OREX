// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
C, U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XItem, XGroup, XPool, XDie, XTermType, XOrbitType, XRoll
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "./bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮
// #region ████████ XLogger: Formatted Logging to Console ████████ ~
const XLogger = (type, stylesOverride, message, ...content) => {
    if (C.isDebugging) {
        const styleLine = Object.entries({
            ...STYLES.base,
            ...STYLES[type] ?? {},
            ...stylesOverride
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
    title: {
        "background": "linear-gradient(to right,#da1b60,#ff8a00)",
        "color": "#100e17",
        "font-family": "Candal",
        "font-size": "18px",
        "padding": "0 30px 0 10px",
        "margin-left": "-20px"
    },
    display: {
        "background": "#EDB620",
        "color": "black",
        "font-family": "AlverataInformalW01-Regular",
        "font-size": "16px",
        "padding": "0 10px 0 10px",
        "font-weight": "bold"
    },
    base: {
        "background": "#000000",
        "color": "#EDB620",
        "font-family": "Pragmata Pro",
        "padding": "0 20px 0 20px"
    },
    info: {
        "background": "transparent",
        "color": "white",
        "font-size": "11px",
        "font-weight": "normal",
        "font-family": "Fira Code",
        "padding": "0 30px 0 30px"
        // "margin-left": "250px"
    },
    error: {
        "color": "#FF0000",
        "background": "#950A0F",
        "font-weight": "bold",
        "padding": "0 800px 0 50px"
    },
    groupEnd: {}
};
const DB = {
    log: (message, ...content) => XLogger("base", {}, message, ...(content.length ? content : ["NOGROUP"])),
    title: (message) => XLogger("title", {}, message, "NOGROUP"),
    display: (message, ...content) => XLogger("display", {}, message, ...(content.length ? content : ["NOGROUP"])),
    info: (message, ...content) => XLogger("info", {}, message, ...(content.length ? content : ["NOGROUP"])),
    error: (message, ...content) => XLogger("error", {}, message, ...(content.length ? content : ["NOGROUP"])),
    groupLog: (label) => XLogger("base", {}, label),
    groupTitle: (label) => XLogger("title", {}, label),
    groupDisplay: (label) => XLogger("display", {}, label),
    groupInfo: (label) => XLogger("info", {}, label),
    groupError: (label) => XLogger("error", {}, label),
    groupEnd: () => console.groupEnd()
    // XArm
};
// #endregion ▄▄▄▄▄ XLogger ▄▄▄▄▄
// #region ████████ XPing: Rendering Position Pings to DOM ████████
class XPing {
    static REGISTRY = new Map();
    static Register(xPing) {
        if (this.REGISTRY.has(xPing.label)) {
            this.REGISTRY.get(xPing.label)?.xItem.kill();
        }
        this.REGISTRY.set(xPing.label, xPing);
    }
    static Unregister(xPing) {
        this.REGISTRY.delete(xPing.label);
        xPing.xItem.kill();
    }
    static KillAll() {
        this.REGISTRY.forEach((xPing) => xPing.xItem.kill());
        this.REGISTRY.clear();
    }
    static get newPingID() { return `xPing-${this.REGISTRY.size + 1}`; }
    xItem;
    label;
    color;
    point;
    context;
    constructor(point, label, context = XItem.XROOT, color = "random") {
        this.color = color === "random" ? U.randElem(Object.keys(C.colors)) : color;
        this.xItem = new XItem(context, {
            id: XPing.newPingID,
            classes: ["x-ping"],
            onRender: {
                set: {
                    height: 100,
                    width: 100,
                    x: point.x,
                    y: point.y,
                    background: `radial-gradient(red 5%, ${this.color} 10%, transparent 60%, yellow 62%, transparent 64%)`,
                    textAlign: "center",
                    lineHeight: "50px",
                    fontSize: "24px",
                    fontFamily: "Oswald",
                    color: "white",
                    textShadow: "0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black"
                },
                from: {
                    opacity: 0,
                    scale: 0.5
                },
                to: {
                    opacity: 1,
                    scale: 1,
                    ease: "elastic.out(5)",
                    duration: 0.5
                }
            }
        });
        this.label = label;
        this.point = point;
        this.context = context;
        this.initialize();
    }
    async initialize() {
        await this.xItem.initialize();
        this.xItem.elem$.html(this.label);
        XPing.Register(this);
        XLogger("base", { background: this.color }, `▶${U.uCase(this.label)} at {x: ${U.roundNum(this.point.x, 1)}, y: ${U.roundNum(this.point.y, 1)}}`, this);
    }
}
Object.assign(DB, {
    PING: (point, label, context, color) => new XPing(point, label, context, color),
    ClearPings: () => XPing.KillAll()
});
// #endregion ▄▄▄▄▄ XPing ▄▄▄▄▄
const ClickPhases = ["PositionXDie", "ParentXArm", "StretchXArm", "ResumeRotation"];
const BuildTestContext = async () => {
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
    await Promise.all([TranslateBox, ScaleBox, ExtraScaleBox, RotateBox, CounterRotateBox].map((xItem) => xItem.initialize()));
    return { TranslateBox, ScaleBox, ExtraScaleBox, RotateBox, CounterRotateBox };
};
const TESTS = {
    testCoords: async () => {
        const { TranslateBox, ScaleBox, RotateBox, CounterRotateBox } = await BuildTestContext();
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
    makePool: (xParent, { id, x, y, size = 200, color = "cyan" }) => {
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
            orbitals: C.xGroupOrbitalDefaults
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
                /* orbitals: {
                    [XOrbitType.Core]: { radiusRatio: 0.35, rotationScaling: 1},
                    [XOrbitType.Main]: { radiusRatio: 1, rotationScaling: 1},
                    [XOrbitType.Outer]: { radiusRatio: 1.5, rotationScaling: 1}
                }, */
                dice: {
                    main: [6, "cyan", [2, "lime"]],
                    outer: [5, "silver", [3, "gold"], [4, "rgba(0, 0, 255, 0.5)"]],
                    inner: [3, "red"]
                }
            }
        ].map(async ({ x, y, size, color, /* orbitals, */ dice }, i) => {
            const xPool = TESTS.makePool(XItem.XROOT, {
                id: "POOL",
                x, y, size, color /* , orbitals */
            });
            await xPool.initialize(); // @ts-expect-error How to tell TS the type of object literal's values?
            globalThis.CIRCLE ??= []; // @ts-expect-error How to tell TS the type of object literal's values?
            globalThis.CIRCLE.push(xPool);
            for (const [name, [numDice, color, ...nestedPools]] of Object.entries(dice)) {
                for (let j = 0; j < numDice; j++) {
                    const xDie = new XDie(XItem.XROOT, {
                        id: "xDie",
                        type: XTermType.BasicDie,
                        value: U.randInt(0, 9),
                        color: typeof color === "string" ? color : undefined
                    });
                    if (!(await xPool.addXItem(xDie, name))) {
                        DB.error(`Error rendering xDie '${xDie.id}'`);
                    }
                }
                if (nestedPools.length) {
                    DB.log("Nested Pools", nestedPools);
                    for (const [nestedNumDice, nestedColor] of nestedPools) {
                        const nestedPool = TESTS.makePool(XItem.XROOT, {
                            id: "subPool",
                            x: 0,
                            y: 0,
                            size: 75,
                            color: nestedColor
                        });
                        await xPool.addXItem(nestedPool, name);
                        await nestedPool.initialize();
                        for (let k = 0; k < nestedNumDice; k++) {
                            const id = "xDie";
                            try {
                                await nestedPool.addXItem(new XDie(XItem.XROOT, {
                                    id,
                                    type: XTermType.BasicDie,
                                    value: U.randInt(0, 9),
                                    color: typeof nestedColor === "string" ? nestedColor : undefined
                                }), XOrbitType.Main);
                            }
                            catch (error) {
                                DB.error(`Error rendering xDie '${id}'`, error);
                            }
                        }
                    }
                }
            }
        });
        await Promise.allSettled(POOLS);
        // @ts-expect-error Debugging
        globalThis.POOLS = POOLS;
        return Promise.allSettled(POOLS);
    },
    createRoll: async (dice, setParams = {}, nestedXGroups = []) => {
        setParams = { x: 0, y: 0, height: 400, width: 400, dieColor: "white", poolColor: "cyan", ...setParams };
        const { dieColor, poolColor, ...set } = setParams;
        set["--bg-color"] = poolColor;
        const rollPool = new XRoll(XItem.XROOT, {
            id: "ROLL",
            onRender: { set }
        });
        await rollPool.initialize();
        // const dieColors = ["white", "cyan", "gold", "lime"];
        let diceToAdd = dice.flatMap((qty) => {
            const color = dieColor; // dieColors.shift();
            return [...new Array(qty)].map(() => new XDie(XItem.XROOT, {
                id: "xDie",
                type: XTermType.BasicDie,
                value: 0,
                color
            }));
        });
        await Promise.allSettled(diceToAdd.map((xDie) => xDie.initialize()));
        nestedXGroups.forEach((xGroup) => {
            const index = Math.floor(Math.random() * diceToAdd.length);
            diceToAdd = [
                ...diceToAdd.slice(0, index),
                xGroup,
                ...diceToAdd.slice(index)
            ];
        });
        await rollPool.addXItems({ [XOrbitType.Main]: diceToAdd });
        return rollPool;
    },
    angleClicks: async (focus, isXArmTest) => {
        const pointMarker = new XItem(XItem.XROOT, {
            id: "pointMarker",
            onRender: {
                set: {
                    height: 0,
                    width: 0,
                    x: 0,
                    y: 0
                }
            }
        });
        await pointMarker.initialize();
        document.addEventListener("click", async (event) => {
            DB.display("Click Event Triggered");
            DB.PING({ x: event.pageX, y: event.pageY }, "EVENT");
            pointMarker.set({ x: event.pageX, y: event.pageY });
            DB.log(`Event Position: {x: ${event.pageX}, y: ${event.pageY}}`);
            DB.log(`Focus Position: {x: ${focus.global.x}, y: ${focus.global.y}}`);
            DB.log(`Distance: ${focus.getDistanceTo({ x: event.pageX, y: event.pageY })}`);
            DB.log(`Angle: ${focus.getGlobalAngleTo({ x: event.pageX, y: event.pageY })}`);
            if (isXArmTest) {
                const [xArm, xDie] = isXArmTest;
                const clickPhase = ClickPhases.shift();
                ClickPhases.push(clickPhase);
                const { x, y } = xArm.xElem.getLocalPosData(pointMarker);
                DB.display(`Click pos from xArm: {x: ${U.roundNum(x, 1)}, y: ${U.roundNum(y, 1)}}`);
                switch (clickPhase) {
                    case "PositionXDie": {
                        focus.pauseRotating();
                        XItem.XROOT.adopt(xDie);
                        xDie.set({ x: event.pageX, y: event.pageY, rotation: 0 });
                        break;
                    }
                    case "ParentXArm": {
                        const { x, y } = MotionPathPlugin.convertCoordinates(xDie.elem, xArm.elem, { x: 0, y: 0 });
                        DB.PING({ x, y }, "xDie", xArm);
                        xArm.adopt(xDie, true),
                            xArm.set({ outlineColor: "gold" });
                        break;
                    }
                    case "StretchXArm": {
                        await xArm.stretchToXItem();
                        await xDie.set({ x: 0, y: 0, rotation: -1 * xArm.global.rotation });
                        const { x, y } = MotionPathPlugin.convertCoordinates(xDie.elem, xArm.elem, { x: 0, y: 0 });
                        DB.PING({ x, y }, "xDie", xArm);
                        break;
                    }
                    case "ResumeRotation": {
                        focus.playRotating();
                        break;
                    }
                    // no default
                }
                DB.log("Objects", { event, focus, xDie, xArm });
            }
            else {
                DB.log("Objects", { event, focus });
            }
        });
    },
    xArmTest: async (parentRoll) => {
        const [targetDie] = (parentRoll.orbitals.get(XOrbitType.Main)?.xTerms ?? []);
        if (targetDie?.isInitialized && targetDie.xParent) {
            const xArm = targetDie.xParent;
            XItem.XROOT.adopt(targetDie, true);
            targetDie.set({ "x": 100, "y": 100, "--die-color-bg": "magenta" });
            Object.assign(globalThis, {
                xDie: targetDie,
                xArm
            });
            TESTS.angleClicks(parentRoll, [xArm, targetDie]);
            DB.log("XArm Test Ready", { parentRoll, xDie: targetDie, xArm });
        }
    }
};
export { DB as default, TESTS };