
// ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮
import { 
// ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮
C, U, XItem, XGroup, XPool, XDie, XTermType, XOrbitType, XRoll
 } from "./bundler.js";
// ████████ XLogger: Formatted Logging to Console ████████
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
// ████████ XPing: Rendering Position Pings to DOM ████████
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
        this.xItem = new XItem({
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
        }, context);
        this.label = label;
        this.point = point;
        this.context = context;
        this.initialize();
    }
    async initialize() {
        await this.xItem.xInitialize();
        this.xItem.elem$.html(this.label);
        XPing.Register(this);
        XLogger("base", { background: this.color }, `▶${U.uCase(this.label)} at {x: ${U.roundNum(this.point.x, 1)}, y: ${U.roundNum(this.point.y, 1)}}`, this);
    }
}
const getPosData = (xItems) => {
    const posData = {};
    xItems.forEach((xItem) => {
        const xParent = xItem.xParent;
        const parent = MotionPathPlugin.convertCoordinates(xItem.elem, xParent.elem, xItem.xElem.origin);
        const global = MotionPathPlugin.convertCoordinates(xItem.elem, XItem.XROOT.elem, xItem.xElem.origin);
        let xName = xItem.id.replace(/_.*$/u, "");
        if (xName in posData) {
            xName += `_${Object.keys(posData).length}`;
        }
        posData[xName] = {
            local: `{x: ${U.roundNum(xItem.pos.x)}, y: ${U.roundNum(xItem.pos.y)}, rot: ${U.roundNum(xItem.rotation)}}`,
            origin: `{x: ${U.roundNum(xItem.xElem.origin.x)}, y: ${U.roundNum(xItem.xElem.origin.y)}}`,
            parent: `{x: ${U.roundNum(parent.x)}, y: ${U.roundNum(parent.y)}}`,
            global: `{x: ${U.roundNum(global.x)}, y: ${U.roundNum(global.y)}, rot: ${U.roundNum(xItem.global.rotation)}}`
        };
    });
    console.log(JSON.stringify(posData, null, 2).replace(/"/g, ""));
    return posData;
};
Object.assign(DB, {
    PING: (point, label, context, color) => new XPing(point, label, context, color),
    ClearPings: () => XPing.KillAll(),
    getPosData
});
// ████████ XTools: Various Debug Tools Assigned to Global This Space ████████
// const XTOOLS = {
// 	MakeRoll: async (
// 		itemsByOrbit: Array<number|XGroup|XItem & XTerm> = [
// 			[6]
// 		],
// 		rollParams: Partial<XRollOptions> = {
// 			color: "gold", size: 500
// 		}
// 	) => {
// 		DB.groupTitle("Building XRoll... ");
// 		const ROLL = await TESTS.createRoll(
// 			[7],
// 			{ x: 1250, y: 500 },
// 			await Promise.all((<Array<Parameters<typeof TESTS.createRoll>>>[
// 				[[8], { height: 150, width: 150, dieColor: "purple", poolColor: "gold" }],
// 				[[3], { height: 100, width: 100, dieColor: "blue", poolColor: "orange" }],
// 				[[3], { height: 75, width: 75, dieColor: "magenta", poolColor: "lime" }]
// 			]).map(([dice, params]) => TESTS.createRoll(dice, params)))
// 		);
// 		Object.assign(globalThis, { ROLL, SUBROLLS: ROLL.getXKids(XRoll) });
// 		return ROLL;
// 	}
// }
const ClickPhases = ["PositionXDie", "ParentXArm", "StretchXArm", "ResumeRotation"];
const BuildTestContext = async () => {
    const TranslateBox = new XPool({
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
    const ScaleBox = new XGroup({
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
    }, TranslateBox);
    const ExtraScaleBox = new XGroup({
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
    }, ScaleBox);
    const RotateBox = new XGroup({
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
    }, ExtraScaleBox);
    const CounterRotateBox = new XGroup({
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
    }, RotateBox);
    await Promise.all([TranslateBox, ScaleBox, ExtraScaleBox, RotateBox, CounterRotateBox].map((xItem) => xItem.xInitialize()));
    return { TranslateBox, ScaleBox, ExtraScaleBox, RotateBox, CounterRotateBox };
};
const TESTS = {
    angleClicks: async (focus, isXArmTest) => {
        const pointMarker = new XItem({
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
        await pointMarker.xInitialize();
        document.addEventListener("click", async (event) => {
            DB.groupDisplay(`Click Event: {x: ${event.pageX}, y: ${event.pageY}}`);
            DB.PING({ x: event.pageX, y: event.pageY }, "EVENT");
            // pointMarker.set({x: event.pageX, y: event.pageY});
            DB.log(`Event Position: {x: ${event.pageX}, y: ${event.pageY}}`);
            DB.log(`Focus Position: {x: ${focus.global.x}, y: ${focus.global.y}}`);
            DB.log(`Distance: ${focus.getDistanceTo({ x: event.pageX, y: event.pageY })}`);
            DB.log(`Angle: ${focus.getGlobalAngleTo({ x: event.pageX, y: event.pageY })}`);
            DB.log("Objects", { event, focus });
        });
    },
    xArmTestOne: async (parentRoll) => {
        const [xDie] = (parentRoll.orbitals.get(XOrbitType.Main)?.xTerms ?? []);
        if (xDie?.isInitialized && xDie.xParent) {
            const xArm = xDie.xParent;
            XItem.XROOT.adopt(xDie);
            xDie.set({ "x": 100, "y": 100, "--die-color-bg": "magenta" });
            Object.assign(globalThis, {
                xDie: xDie,
                xArm
            });
            TESTS.angleClicks(parentRoll, [xArm, xDie]);
            // const isXArmTest = [xArm, targetDie];
            document.addEventListener("click", async (event) => {
                // const [xArm, xDie] = isXArmTest as [XArm, XDie];
                const clickPhase = ClickPhases.shift();
                ClickPhases.push(clickPhase);
                switch (clickPhase) {
                    case "PositionXDie": {
                        parentRoll.pauseRotating();
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
                        parentRoll.playRotating();
                        break;
                    }

                }
                DB.log("Objects", { event, focus, xDie, xArm });
            });
            DB.log("XArm Test Ready", { parentRoll, xDie: xDie, xArm });
        }
    },
    PositionTest: async () => {
        DB.groupTitle("Position Test Setup");
        DB.groupLog("Instantiating Roll");
        const MainRoll = new XRoll({
            id: "Roll",
            onRender: {
                set: { x: 500, y: 500, height: 500, width: 500, outline: "5px solid blue" }
            }
        });
        DB.groupEnd();
        DB.groupLog("Instantiating Dice");
        const Die = new XDie({
            id: "Roll-Die",
            type: XTermType.BasicDie
        }, MainRoll);
        const FloatDie = new XDie({
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
        ].map((dieParams, i) => new XDie({
            id: `RandomDie-${i}`,
            type: XTermType.BasicDie,
            color: dieParams.color,
            onRender: {
                set: { x: dieParams.x, y: dieParams.y }
            }
        }));
        DB.groupEnd();
        DB.groupLog("Initializing FloatDie");
        await Promise.all([FloatDie, ...RandomDice].map((die) => die.xInitialize()));
        DB.groupEnd();
        DB.groupLog("Adding Die");
        await MainRoll.addXItem(Die, XOrbitType.Main);
        DB.groupEnd();
        DB.groupDisplay("Initializing Roll");
        await MainRoll.xInitialize();
        const Orbit = MainRoll.orbitals.get(XOrbitType.Main);
        // await Orbit.initialize();
        DB.groupEnd();
        DB.groupDisplay("Fetching Arm");
        const Arm = Orbit.getXKids(XItem)[0];
        DB.log("XArm", Arm);
        DB.groupEnd();
        const T = {
            Die,
            FloatDie,
            Arm,
            Orbit,
            MainRoll
        };
        Object.assign(globalThis, T, { getPosData, RandomDice });
        DB.groupEnd();
        DB.log("Position Test Setup Complete.");
    },
    xArmTest: async (isPreinitializing = false) => {
        DB.groupTitle("Initializing XArm Catch Test");
        DB.groupLog("Resetting XROOT");
        XItem.XROOT.kill();
        DB.groupEnd();
        DB.groupLog("Creating ROLL ...");
        const ROLL = new XRoll({
            id: "ROLL",
            onRender: {
                set: {
                    x: 0,
                    y: 0,
                    height: 500,
                    width: 500,
                    color: "gold"
                }
            }
        });
        // if (isPreinitializing) { await ROLL.initialize() }
        DB.groupEnd();
        DB.groupDisplay("Creating ROLL's DICE ...");
        ROLL.addXItems({ [XOrbitType.Main]: new Array(6)
                .fill(XTermType.BasicDie)
                .map((xDieType) => new XDie({
                id: "die",
                type: xDieType
            }, ROLL))
        });
        DB.groupEnd();
        Object.assign(globalThis, {
            INIT: {
                ROLL: ROLL.xInitialize.bind(ROLL),
                ROLLDICE: async () => ROLL.xKids.forEach((xItem) => xItem instanceof XDie && xItem.xInitialize())
            }
        });
        DB.groupEnd();
        DB.title("Ready to INIT.ROLL / INIT.ROLLDICE");
    }
};
export { DB as default, TESTS };