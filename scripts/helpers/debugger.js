// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import { 
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
C, U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XROOT, XItem, XGroup, XPool, XDie, XTermType, XOrbitType, XRoll
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
        const traceStyle = Object.entries({
            ...STYLES.base,
            ...STYLES.trace
        }).map(([prop, val]) => `${prop}: ${val};`).join(" ");
        if (content.length) {
            if (content[0] === "NOGROUP") {
                console.groupCollapsed(`%c${message}`, styleLine);
            }
            else {
                console.groupCollapsed(`%c${message}`, styleLine, ...content);
            }
        }
        else {
            console.groupCollapsed(`%c${message}`, styleLine);
        }
        console.trace();
        console.groupEnd();
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
    trace: {
        "background": "silver",
        "color": "black",
        "font-family": "Fira Code",
        "font-size": "10px",
        "text-align": "right",
        "width": "200px"
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
        "background": "#111111",
        "color": "gold",
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
// #region ████████ XPing: Rendering Position Pings to DOM ████████ ~
class XPing {
    static async Make(point, label, context = XROOT.XROOT, color = "random") {
        color = color === "random" ? U.randElem(Object.keys(C.colors)) : color;
        const xPing = new XPing(point, label, context, color);
        await xPing.xItem.render();
        await xPing.initialize();
    }
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
    constructor(point, label, context = XROOT.XROOT, color = "random") {
        this.color = color === "random" ? U.randElem(Object.keys(C.colors)) : color;
        this.xItem = new XItem(context, { id: XPing.newPingID, classes: ["x-ping"] }, {
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
        });
        this.label = label;
        this.point = point;
        this.context = context;
    }
    async initialize() {
        await this.xItem.initialize();
        this.xItem.elem$.html(this.label);
        XPing.Register(this);
        XLogger("base", { background: this.color }, `▶${U.uCase(this.label)} at {x: ${U.roundNum(this.point.x, 1)}, y: ${U.roundNum(this.point.y, 1)}}`, this);
        return this.xItem.fromTo({
            opacity: 0,
            scale: 0.5
        }, {
            opacity: 1,
            scale: 1,
            ease: "elastic.out(5)",
            duration: 0.5
        });
    }
}
Object.assign(DB, {
    PING: (point, label, context, color) => new XPing(point, label, context, color),
    ClearPings: () => XPing.KillAll()
});
// #endregion ▄▄▄▄▄ XPing ▄▄▄▄▄
const getRollPos = (pos, size) => {
    if (XROOT.XROOT instanceof XItem) {
        const { height, width } = XROOT.XROOT;
        return [
            { x: 0.5 * width, y: 0.5 * height },
            { x: 0.75 * size, y: 0.75 * size },
            { x: width - (0.75 * size), y: 0.75 * size },
            { x: width - (0.75 * size), y: height - (0.75 * size) },
            { x: 0.75 * size, y: height - (0.75 * size) }
        ][pos];
    }
    else {
        DB.error("Attempt to getRollPos() before XROOT.XROOT Rendered.");
        return { x: 0, y: 0 };
    }
};
const ClickPhases = ["PositionXDie", "ParentXArm", "StretchXArm", "ResumeRotation"];
const BuildTestContext = async () => {
    DB.groupTitle("Position Test Setup");
    DB.groupLog("Instantiating Roll");
    const MainRoll = await XRoll.Make(XROOT.XROOT, { id: "Roll" }, { x: 500, y: 500, height: 500, width: 500, outline: "5px solid blue" });
    DB.groupEnd();
    DB.groupLog("Instantiating Dice");
    const Die = await XDie.Make(MainRoll, { id: "Roll-Die", type: XTermType.BasicDie }, {});
    const RollDice = await Promise.all([...new Array(5)].map(() => XDie.Make(MainRoll, { id: "Roll-Die", type: XTermType.BasicDie }, {})));
    const FloatDie = await XDie.Make(XROOT.XROOT, { id: "Float-Die", type: XTermType.BasicDie, color: "red" }, { x: 1200, y: 200 });
    const RandomDice = await Promise.all([
        { x: 200, y: 200, color: "blue" },
        { x: 400, y: 900, color: "gold" },
        { x: 800, y: 200, color: "green" },
        { x: 800, y: 900, color: "cyan" },
        { x: 50, y: 500, color: "magenta" }
    ].map((dieParams, i) => new XDie(XROOT.XROOT, {
        id: `RandomDie-${i}`,
        type: XTermType.BasicDie,
        color: dieParams.color
    }, { x: dieParams.x, y: dieParams.y })));
    DB.groupEnd();
    DB.groupLog("Initializing FloatDie");
    await Promise.all([FloatDie, ...RandomDice].map((die) => die.initialize()));
    DB.groupEnd();
    DB.groupLog("Adding Die");
    await MainRoll.addXItems({ [XOrbitType.Main]: [Die, ...RollDice] });
    DB.groupEnd();
    DB.groupDisplay("Initializing Roll");
    await MainRoll.initialize();
    const Orbit = MainRoll.orbitals.get(XOrbitType.Main);
    // await Orbit.initialize();
    DB.groupEnd();
    DB.groupDisplay("Fetching Arm");
    const [Arm] = Orbit.arms;
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
            const global = MotionPathPlugin.convertCoordinates(xItem.elem, XROOT.XROOT.elem, xItem.xElem.origin);
            posData[xName] = {
                local: `{x: ${U.roundNum(xItem.pos.x)}, y: ${U.roundNum(xItem.pos.y)}, rot: ${U.roundNum(xItem.rotation)}}`,
                origin: `{x: ${U.roundNum(xItem.xElem.origin.x)}, y: ${U.roundNum(xItem.xElem.origin.y)}}`,
                parent: `{x: ${U.roundNum(parent.x)}, y: ${U.roundNum(parent.y)}}`,
                global: `{x: ${U.roundNum(global.x)}, y: ${U.roundNum(global.y)}, rot: ${U.roundNum(xItem.global.rotation)}}`
            };
        });
        console.log(JSON.stringify(posData, null, 2).replace(/"/g, ""));
    };
    Object.assign(globalThis, T, { getPosData, RandomDice });
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
};
const TESTS_ARCHIVE = {
    nestedPositionTest: async () => {
        const TranslateBox = await XPool.Make(XROOT.XROOT, {
            id: "translate-box",
            classes: ["translate-box"]
        }, { xPercent: 0, yPercent: 0 });
        await TranslateBox.initialize();
        TranslateBox.to({
            x: "+=500",
            duration: 5,
            ease: "power3.inOut",
            repeat: -1,
            yoyo: true
        });
        const ScaleBox = await XGroup.Make(TranslateBox, {
            id: "scale-box-1",
            classes: ["scale-box"]
        }, {
            xPercent: 0,
            yPercent: 0
        });
        await ScaleBox.initialize();
        ScaleBox.to({
            scale: 2,
            duration: 15,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
        const ExtraScaleBox = await XGroup.Make(ScaleBox, {
            id: "scale-box-2",
            classes: ["extra-scale-box"]
        }, {
            xPercent: 0,
            yPercent: 0
        });
        await ExtraScaleBox.initialize();
        ExtraScaleBox.to({
            scale: 3,
            duration: 5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
        const RotateBox = await XGroup.Make(ExtraScaleBox, {
            id: "rotate-box-1",
            classes: ["rotate-box"]
        }, {
            xPercent: 0,
            yPercent: 0
        });
        await RotateBox.initialize();
        RotateBox.to({
            rotation: "+=360",
            duration: 2,
            ease: "none",
            repeat: -1
        });
        const CounterRotateBox = await XGroup.Make(RotateBox, {
            id: "rotate-box-2",
            classes: ["rotate-box"]
        }, {
            xPercent: 0,
            yPercent: 0
        });
        await CounterRotateBox.initialize();
        CounterRotateBox.to({
            rotation: "-=360",
            duration: 2,
            ease: "power4.inOut",
            repeat: -1
        });
        await Promise.all([TranslateBox, ScaleBox, ExtraScaleBox, RotateBox, CounterRotateBox].map((xItem) => xItem.initialize()));
        const TestDie = await XGroup.Make(CounterRotateBox, { id: "test-die" }, { height: 40, width: 40, background: "lime" });
        const dieMarkers = await Promise.all([
            { x: 0.5, y: 0, background: "yellow" },
            { x: 0, y: 1, background: "cyan" },
            { x: 1, y: 1, background: "magenta" }
        ].map(({ x, y, background }, i) => XItem.Make(TestDie, {
            id: `die-marker-${i + 1}`,
            classes: ["x-marker"]
        }, {
            height: 10,
            width: 10,
            x: x * 50,
            y: y * 50,
            background
        })));
        await Promise.all(dieMarkers.map((marker) => marker.initialize()));
        const xMarkers = await Promise.all(["yellow", "cyan", "magenta"]
            .map((background, i) => XItem.Make(XROOT.XROOT, {
            id: `x-marker-${i + 1}`,
            classes: ["x-marker"]
        }, {
            height: 10,
            width: 10,
            x: 100 + (20 * i),
            y: 500 + (40 * i),
            background
        })));
        await Promise.all(xMarkers.map((marker) => marker.initialize()));
        xMarkers.forEach((marker, i) => marker.set(dieMarkers[i].pos));
        DB.log("Test Die Objs =>", dieMarkers, xMarkers, TranslateBox, ScaleBox, RotateBox, TestDie);
    }
};
const DBFUNCS = {
    BuildTestContext,
    makeRoll: async (dice, { pos = 0, color = "cyan", size = 200 } = {}) => {
        const rollPos = getRollPos(pos, size);
        const xRoll = await XRoll.Make(XROOT.XROOT, {
            id: "ROLL"
        }, {
            ...rollPos,
            "height": size,
            "width": size,
            "--bg-color": color
        });
        await xRoll.initialize();
        const xDice = Object.fromEntries(await Promise.all([
            XOrbitType.Main,
            XOrbitType.Inner,
            XOrbitType.Outer
        ].map((orbitType) => {
            const numDice = dice.shift();
            if (!numDice) {
                return Promise.resolve([]);
            }
            return Promise.all([orbitType, [...new Array(numDice)].map(() => XDie.Make(xRoll, {
                    id: "xDie",
                    type: XTermType.BasicDie
                }, {}))]);
        })));
        DB.display("XROLL's XDICE", xDice);
        await Promise.all(Object.values(xDice).flat().filter((xDie) => Boolean(xDie)).map((xDie) => xDie.initialize()));
        await xRoll.addXItems(xDice);
        return xRoll;
    }
};
const TESTS = {
    // makePool: (xParent: XItem, {id, x, y, size = 200, color = "cyan"}: {id: string, x: number, y: number, size: number, color: string}) => {
    // 	return new XPool(xParent, {
    // 		id,
    // 		onRender: {
    // 			set: {
    // 			}
    // 		},
    // 		orbitals: C.xGroupOrbitalDefaults
    // 	});
    // },
    makeDie: ({ value = undefined, color = "white", numColor = "black", strokeColor = "black", size = 50 } = {}) => new XDie(XROOT.XROOT, {
        id: "x-die",
        type: XTermType.BasicDie,
        value,
        color,
        numColor,
        strokeColor,
        size
    }),
    // testGroups: async () => {
    // 	const POOLS = [
    // 		// {x: 550, y: 350, size: 200, color: "gold", orbitals: {main: 0.75, outer: 1.25, inner: 0.25}, dice: {main: [5, "cyan", [3, "red"]]}},
    // 		{
    // 			x: 950, y: 650, size: 400, color: "rgba(255, 0, 0, 0.5)",
    // 			/* orbitals: {
    // 				[XOrbitType.Core]: { radiusRatio: 0.35, rotationScaling: 1},
    // 				[XOrbitType.Main]: { radiusRatio: 1, rotationScaling: 1},
    // 				[XOrbitType.Outer]: { radiusRatio: 1.5, rotationScaling: 1}
    // 			}, */
    // 			dice: {
    // 				main: [6, "cyan", [2, "lime"]],
    // 				outer: [5, "silver", [3, "gold"], [4, "rgba(0, 0, 255, 0.5)"]],
    // 				inner: [3, "red"]
    // 			}
    // 		}
    // 	].map(async ({x, y, size, color, /* orbitals, */ dice}, i) => {
    // 		const xPool = TESTS.makePool(XROOT.XROOT, {
    // 			id: "POOL",
    // 			x, y, size, color/* , orbitals */
    // 		});
    // 		await xPool.initialize(); // @ts-expect-error How to tell TS the type of object literal's values?
    // 		globalThis.CIRCLE ??= []; // @ts-expect-error How to tell TS the type of object literal's values?
    // 		globalThis.CIRCLE.push(xPool);
    // 		for (const [name, [numDice, color, ...nestedPools]] of Object.entries(dice) as Array<[XOrbitType, [number, string, ...Array<[number, string]>]]>) {
    // 			for (let j = 0; j < numDice; j++) {
    // 				const xDie = new XDie(XROOT.XROOT as XGroup, {
    // 					id: "xDie",
    // 					type: XTermType.BasicDie,
    // 					value: U.randInt(0, 9) as XDieValue,
    // 					color: typeof color === "string" ? color : undefined
    // 				});
    // 				if (!(await xPool.addXItem(xDie, name))) {
    // 					DB.error(`Error rendering xDie '${xDie.id}'`);
    // 				}
    // 			}
    // 			if (nestedPools.length) {
    // 				DB.log("Nested Pools", nestedPools);
    // 				for (const [nestedNumDice, nestedColor] of nestedPools) {
    // 					const nestedPool = TESTS.makePool(XROOT.XROOT, {
    // 						id: "subPool",
    // 						x: 0,
    // 						y: 0,
    // 						size: 75,
    // 						color: nestedColor
    // 					});
    // 					await xPool.addXItem(nestedPool, name);
    // 					await nestedPool.initialize();
    // 					for (let k = 0; k < nestedNumDice; k++) {
    // 						const id = "xDie";
    // 						try {
    // 							await nestedPool.addXItem(new XDie(XROOT.XROOT as XGroup, {
    // 								id,
    // 								type: XTermType.BasicDie,
    // 								value: U.randInt(0, 9) as XDieValue,
    // 								color: typeof nestedColor === "string" ? nestedColor : undefined
    // 							}), XOrbitType.Main);
    // 						} catch (error) {
    // 							DB.error(`Error rendering xDie '${id}'`, error);
    // 						}
    // 					}
    // 				}
    // 			}
    // 		}
    // 	});
    // 	await Promise.allSettled(POOLS);
    // 	// @ts-expect-error Debugging
    // 	globalThis.POOLS = POOLS;
    // 	return Promise.allSettled(POOLS);
    // },
    createRoll: async (dice, setParams = {}, nestedXGroups = []) => {
        setParams = { x: 0, y: 0, height: 400, width: 400, dieColor: "white", poolColor: "cyan", ...setParams };
        const { dieColor, poolColor, ...set } = setParams;
        set["--bg-color"] = poolColor;
        const rollPool = await XRoll.Make(XROOT.XROOT, {
            id: "ROLL"
        }, { set });
        await rollPool.initialize();
        // const dieColors = ["white", "cyan", "gold", "lime"];
        let diceToAdd = dice.flatMap((qty) => {
            const color = dieColor; // dieColors.shift();
            return [...new Array(qty)].map(() => new XDie(XROOT.XROOT, {
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
        const pointMarker = await XItem.Make(XROOT.XROOT, {
            id: "pointMarker"
        }, {
            height: 0,
            width: 0,
            x: 0,
            y: 0
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
                        XROOT.XROOT.adopt(xDie);
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
                        await xArm.snapToXItem();
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
            XROOT.XROOT.adopt(targetDie, true);
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
export { DB as default, TESTS, DBFUNCS };