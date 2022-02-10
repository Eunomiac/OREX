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
MAIN, 
// #endregion ▮▮▮▮[Constants]▮▮▮▮
// #region ▮▮▮▮▮▮▮[External Libraries]▮▮▮▮▮▮▮ ~
gsap, Dragger, InertiaPlugin, MotionPathPlugin, GSDevTools, // GreenSock Animation Platform
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
preloadTemplates, U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XItem, XGroup, XDie } from "./helpers/bundler.js";
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
    // Object.assign(CONFIG, {OREX: MAIN as list});
    CONFIG.OREX = MAIN;
    // #endregion ▮▮▮▮[Configuration]▮▮▮▮
    // #region ▮▮▮▮▮▮▮[Handlebar Templates] Preload Handlebars Templates ▮▮▮▮▮▮▮
    return preloadTemplates();
    // #endregion ▮▮▮▮[Handlebar Templates]▮▮▮▮
}));
// #endregion ▄▄▄▄▄ ON INIT ▄▄▄▄▄
/*DEVCODE*/
Hooks.once("ready", () => {
    console.log({
        "this": this,
        U,
        XItem,
        XGroup,
        XDie,
        gsap,
        MotionPathPlugin,
        GSDevTools,
        "pause": () => gsap.globalTimeline.pause(),
        "play": () => gsap.globalTimeline.play()
    });
    const TranslateBox = new XItem({
        classes: ["translate-box"]
    });
    const ScaleBox = new XItem({
        classes: ["scale-box"]
    }, TranslateBox);
    const ExtraScaleBox = new XItem({
        classes: ["extra-scale-box"]
    }, ScaleBox);
    const RotateBox = new XItem({
        classes: ["rotate-box"]
    }, ExtraScaleBox);
    const CounterRotateBox = new XItem({
        classes: ["counter-rotate-box"]
    }, RotateBox);
    const TestDie = new XDie({}, CounterRotateBox);
    TestDie.set({
        "xPercent": -50,
        "yPercent": -50,
        "x": 0,
        "y": 0,
        "--die-size": "50px",
        "--die-color-bg": "lime",
        "--die-color-fg": "black",
        "--die-color-stroke": "black",
        "fontSize": 60,
        "fontFamily": "Oswald",
        "textAlign": "center"
    });
    const dieMarkers = [
        { x: 0.5, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
    ].map(({ x, y }, i) => {
        const marker = new XItem({
            id: `die-marker-${i + 1}`,
            classes: ["x-marker"]
        }, TestDie);
        marker.set({
            xPercent: -50,
            yPercent: -50,
            height: 10,
            width: 10,
            x: x * 50,
            y: y * 50,
            background: ["yellow", "cyan", "magenta"][i]
        });
        return marker;
    });
    const xMarkers = ["yellow", "cyan", "magenta"]
        .map((color, i) => {
        const marker = new XItem({
            id: `x-marker-${i + 1}`,
            classes: ["x-marker"]
        });
        marker.set({
            xPercent: -50,
            yPercent: -50,
            height: 10,
            width: 10,
            x: 100 + (20 * i),
            y: 500 + (40 * i),
            background: color
        });
        return marker;
    });
    setTimeout(() => {
        gsap.to(TranslateBox.elem, {
            x: "+=500",
            duration: 5,
            ease: "power3.inOut",
            repeat: -1,
            yoyo: true
        });
        gsap.to(ScaleBox.elem, {
            scale: 2,
            duration: 15,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
        gsap.to(ExtraScaleBox.elem, {
            scale: 3,
            duration: 5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
        gsap.to(RotateBox.elem, {
            rotation: "+=360",
            duration: 2,
            ease: "none",
            repeat: -1
        });
        gsap.to(CounterRotateBox.elem, {
            rotation: "-=360",
            duration: 2,
            ease: "power4.inOut",
            repeat: -1
        });
        gsap.ticker.add(() => {
            xMarkers.forEach((xMarker, i) => {
                const { pos } = dieMarkers[i];
                xMarker.set(pos);
            });
        });
    }, 100);
    console.log(dieMarkers, xMarkers, TranslateBox, ScaleBox, RotateBox, gsap, MotionPathPlugin);
});
/*!DEVCODE*/ 
