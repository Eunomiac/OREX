// #endregion ___ GreenSock Animation ___
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
import { XItem, XGroup, XPool, XDie, XRoll
// #endregion ▮▮▮▮[XItems]▮▮▮▮
 } from "./bundler.js";
const MIXINS = {
    CanParent: (Base) => class extends Base {
        #xKids = new Set();
        elem;
        elem$;
        pos;
        global;
        get kids() { return this.xKids; }
    },
    Renderable: (Base) => class extends Base {
        get pos() { return this._pos; }
    },
    Tweenable: (Base) => class extends Base {
    }
};
const MIX = (baseClass, ...mixins) => {
    return mixins.reduce((cls, mixin) => mixin(cls), baseClass);
};
const ApplicationMix = MIX(XGroup, MIXINS.Renderable, MIXINS.CanParent);
class XItemMix extends MIXINS.CanParent(Application) {
}
/* type Constructor<T = {}> = new (...args: any[]) => T;
type MixIn<TBase extends Constructor> = (Base: TBase) => TBase;

class MixinBuilder<TSuper extends Constructor> {
    superclass: TSuper;
    constructor(superclass: TSuper) { this.superclass = superclass }
    with(...mixins: MixIn<TSuper>[]) { return mixins.reduce((cls, mixin: MixIn<TSuper> = (x) => x) => mixin(cls), this.superclass) }
}
export const MIX = (superclass: Constructor<XItem>) => new MixinBuilder(superclass);


const HasMotionPath: MixIn<Constructor<XItem>> = (superclass) => class extends superclass {
    _path = ""
    get path() { return this._path}
    set path(v) { this._path = v}
};

class BetterAngelsActorSheet extends MIX(XItem).with(HasMotionPath) {

    constructor() {
        super();
        this._path = "fifteen";
    }


}




const MIXINS = {




    Scale: function Scale<TBase extends Constructor>(Base: TBase) {
        return class Scaling extends Base {
            get scaling() { return this._scaling },
            set scaling(v) { this._scaling = v }
        }
    }
} */
// #endregion 🟪🟪🟪 MIXINS 🟪🟪🟪
// #region 🟩🟩🟩 FACTORIES: Factory Functions for XClasses & Mixins 🟩🟩🟩
// #region ████████ XCLASSES: Async Instantiation & Rendering of XItems ████████ ~
// #endregion ▄▄▄▄▄ XCLASSES ▄▄▄▄▄
// #region ████████ MIXINS: Applying Mixins ████████ ~
// #endregion ▄▄▄▄▄ MIXINS ▄▄▄▄▄
// #endregion 🟩🟩🟩 FACTORIES 🟩🟩🟩
// #region ████████ FACTORIES: Abstract XItem Creation Factory ████████ ~
// XItemOptions, XGroupOptions, XPoolOptions, XOrbitSpecs, XRollOptions, XTermOptions, XDieOptions, XModOptions
const XDEFAULTS = {};
class XFactoryBase {
    async Make(xParent, { preRenderFuncs = [], postRenderFuncs = [], postRenderVars = {}, postInitFuncs = [] } = {}) {
        const xItem = this.factoryMethod(xParent);
        await Promise.all(preRenderFuncs.map(async (func) => func(xItem)));
        await xItem.render();
        await Promise.all(postRenderFuncs.map(async (func) => func(xItem)));
        xItem.set(postRenderVars);
        xParent.adopt(xItem);
        try {
            xItem.constructor.Register(xItem);
        }
        catch (err) {
            DB.display(`Error with ${xItem.constructor.name}'s 'Registry' static method.`, err);
        }
        await xItem.initialize();
        await Promise.all(postInitFuncs.map(async (func) => func(xItem)));
        return xItem;
    }
}
function classBuilder(ClassRef, defaultRenderOptions) {
    class ThisFactory extends XFactoryBase {
        factoryMethod(xParent) {
            return new ClassRef(xParent);
        }
    }
    return new ThisFactory();
}
const FACTORIES = {
    XItem: classBuilder(XItem),
    XGroup: classBuilder(XGroup),
    XPool: classBuilder(XPool),
    XRoll: classBuilder(XRoll),
    XDie: classBuilder(XDie, { id: "xdie" }),
    XArm: classBuilder(XArm, { id: "-" }, {
        transformOrigin: "0% 50%",
        top: "50%",
        left: "50%",
        xPercent: 0,
        yPercent: 0
    }),
    XOrbit: classBuilder(XOrbit),
    /*DEVCODE*/
    XDisplay: classBuilder(XDisplay, { id: "DISPLAY" }, {
        xPercent: 0,
        yPercent: 0
    })
    /*!DEVCODE*/
};
export { FACTORIES };
// #endregion ▄▄▄▄▄ FACTORIES ▄▄▄▄▄