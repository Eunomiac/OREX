// #region ████████ IMPORTS ████████ ~
import { 
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
U, 
// #endregion ▮▮▮▮[Utility]▮▮▮▮
// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
XItem } from "../helpers/bundler.js";
export var XTermType;
(function (XTermType) {
    XTermType[XTermType["BasicDie"] = 0] = "BasicDie";
    XTermType[XTermType["ExpertDie"] = 1] = "ExpertDie";
    XTermType[XTermType["MasterDie"] = 2] = "MasterDie";
    XTermType[XTermType["GobbleDie"] = 3] = "GobbleDie";
    XTermType[XTermType["BasicSet"] = 4] = "BasicSet";
    XTermType[XTermType["MatchSet"] = 5] = "MatchSet";
    XTermType[XTermType["RunSet"] = 6] = "RunSet";
    XTermType[XTermType["FullHouseSet"] = 7] = "FullHouseSet";
    XTermType[XTermType["Difficulty"] = 8] = "Difficulty";
    XTermType[XTermType["Modifier"] = 9] = "Modifier";
    XTermType[XTermType["Trait"] = 10] = "Trait";
    XTermType[XTermType["Styler"] = 11] = "Styler";
})(XTermType || (XTermType = {}));
export default class XDie extends XItem {
    constructor(xParent, xOptions) {
        const dieSize = xOptions.size ?? 40;
        xOptions.id = `${xOptions.id}-${U.getUID()}`;
        xOptions.onRender ?? (xOptions.onRender = {});
        xOptions.onRender.set = {
            ...{
                "--die-size": `${dieSize}px`,
                "--die-color-fg": xOptions.numColor ?? "black",
                "--die-color-bg": xOptions.color ?? "white",
                "--die-color-stroke": xOptions.strokeColor ?? "black"
            },
            ...xOptions.onRender.set ?? {}
        };
        super(xParent, xOptions);
        this.value = 0;
        this.value = xOptions.value ?? 0;
        this.termType = xOptions.type;
    }
    static get defaultOptions() {
        return U.objMerge(super.defaultOptions, {
            classes: ["x-die"],
            template: U.getTemplatePath("xdie"),
            onRender: {
                set: {
                    fontSize: "calc(1.2 * var(--die-size))",
                    fontFamily: "Oswald",
                    textAlign: "center"
                }
            }
        });
    }
    get isRolled() { return this.value > 0; }
    roll() { return (this.value = U.randInt(1, 10)); }
    get xParent() { return super.xParent; }
    set xParent(xItem) { super.xParent = xItem; }
    ApplyEffect(xRoll) {
        return xRoll;
    }
    getData() {
        const context = super.getData();
        Object.assign(context, {
            value: this.value ?? " "
        });
        return context;
    }
}