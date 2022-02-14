var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
XElem, XItem, XGroup, XDie } from "./helpers/bundler.js";
/*DEVCODE*/
// import DB from "./helpers/debug.js";
/*!DEVCODE*/
gsap.registerPlugin(Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools);
// #endregion ▄▄▄▄▄ IMPORTS ▄▄▄▄▄
// #region ████████ ON INIT: On-Initialization Hook ████████
Hooks.once("init", () => __awaiter(void 0, void 0, void 0, function* () {
    /*DEVCODE*/ console.log("STARTING ORE-X"); /*!DEVCODE*/
    // CONFIG.debug.hooks = true;
    // #region ▮▮▮▮▮▮▮[Configuration] Apply Configuration Settings ▮▮▮▮▮▮▮
    CONFIG.OREX = C;
    // #endregion ▮▮▮▮[Configuration]▮▮▮▮
    // #region ▮▮▮▮▮▮▮[Handlebar Templates] Preload Handlebars Templates ▮▮▮▮▮▮▮
    preloadTemplates();
    // #endregion ▮▮▮▮[Handlebar Templates]▮▮▮▮
    XItem.InitializeXROOT();
}));
// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄
/*DEVCODE*/
// SIMPLIFY THIS SHIT!  SEPARATE PARENTING FROM ELEMENTS, CONTROL ASYNC RENDER WAITS OUTSIDE OF CLASS
Hooks.once("ready", () => {
    Object.entries({
        U,
        XElem,
        XItem,
        XGroup,
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
        testCoords: () => __awaiter(void 0, void 0, void 0, function* () {
            const TranslateBox = new XItem({
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
            const ScaleBox = new XItem({
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
            const ExtraScaleBox = new XItem({
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
            const RotateBox = new XItem({
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
                classes: ["counter-rotate-box"],
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
            const TestDie = new XDie({ parent: CounterRotateBox, value: 3, color: "lime", size: 100 });
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
            function testCoordsTicker() {
                xMarkers.forEach((xMarker, i) => __awaiter(this, void 0, void 0, function* () {
                    yield xMarker.asyncRender();
                    xMarker.set(dieMarkers[i].pos);
                }));
            }
            XItem.AddTicker(testCoordsTicker);
            console.log(dieMarkers, xMarkers, TranslateBox, ScaleBox, RotateBox, gsap, MotionPathPlugin);
            console.log(TestDie.value);
        }),
        testGroup: (params = {}) => new XGroup({
            parent: XItem.XROOT,
            onRender: {
                set: {
                    height: 200,
                    width: 200,
                    left: 200,
                    top: 100,
                    xPercent: -50,
                    yPercent: -50
                }
            },
            orbitals: [0.5, 1, 1.5]
        }),
        killAll: XItem.InitializeXROOT
    }) // @ts-expect-error How to tell TS the type of object literal's values?
        .forEach(([key, val]) => { globalThis[key] = val; });
});
/*!DEVCODE*/ 