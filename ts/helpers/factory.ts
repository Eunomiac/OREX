// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
// #region ▮▮▮▮▮▮▮ External Libraries ▮▮▮▮▮▮▮ ~
// #region ====== GreenSock Animation ====== ~
import {
	default as gsap,
	MotionPathPlugin,
	GSDevTools
} from "gsap/all";
// #endregion ___ GreenSock Animation ___
// #endregion ▮▮▮▮[External Libraries]▮▮▮▮
// #region ▮▮▮▮▮▮▮[Utility]▮▮▮▮▮▮▮ ~
import {
	C, U,
	// #endregion ▮▮▮▮[Utility]▮▮▮▮
	// #region ▮▮▮▮▮▮▮[XItems]▮▮▮▮▮▮▮ ~
	XROOT, XItem,
	XGroup, XPool,
	XDie,
	XTermType, XOrbitType, XRoll
	// #endregion ▮▮▮▮[XItems]▮▮▮▮
} from "./bundler.js";
import type { XArm, XOrbit, ConstructorOf, Index, XOrbitSpecs, XItemOptions, XDieValue} from "./bundler.js";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

// #region ▮▮▮▮▮▮▮[Mixins] Compartmentalized Functionality for XItems ▮▮▮▮▮▮▮ ~



// #endregion ▮▮▮▮[Mixins]▮▮▮▮





// #region 🟪🟪🟪 MIXINS: Functionality Mixins for XClasses 🟪🟪🟪 ~
type MixIn<T extends XItem> = (Base: ConstructorOf<T>) => ConstructorOf<T>;

const MIXINS: Record<string, MixIn<XItem>> = {
	CanParent: <TBase extends ConstructorOf<XItem>>(Base: TBase) => class extends Base {
		#xKids: Set<typeof this> = new Set();

		elem: HTMLElement;
		elem$: JQuery<HTMLElement>;

		pos: Point,
		global: Position



		get kids() { return this.xKids }
	},
	Renderable: <TBase extends ConstructorOf<XItem>>(Base: TBase) => class extends Base {
		get pos() { return this._pos }
	},
	Tweenable: <TBase extends ConstructorOf<XItem>>(Base: TBase) => class extends Base {

	}
}

const MIX = <TBase>(baseClass: ConstructorOf<TBase>, ...mixins: Array<MixIn<TBase>>): ConstructorOf<TBase> => {
	return mixins.reduce((cls, mixin) => mixin(cls), baseClass);
}

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

const XDEFAULTS: Record<string, XOptions> = {

}




abstract class XFactoryBase<CItem extends typeof XItem, CParent extends typeof XGroup>{

	public async Make(
		xParent: InstanceType<CParent>,
		{
			preRenderFuncs = [],
			postRenderFuncs = [],
			postRenderVars = {},
			postInitFuncs = []
		}: XOptions extends ApplicationOptions = {}
	): Promise<ConfirmedXItem<InstanceType<CItem>>> {
		const xItem = this.factoryMethod(xParent);
		await Promise.all(preRenderFuncs.map(async (func) => func(xItem)));
		await xItem.render();
		await Promise.all(postRenderFuncs.map(async (func) => func(xItem)));
		xItem.set(postRenderVars);
		xParent.adopt(xItem);
		try {
			(xItem.constructor as CItem).Register(xItem);
		} catch (err) {
			DB.display(`Error with ${xItem.constructor.name}'s 'Registry' static method.`, err);
		}
		await xItem.initialize();
		await Promise.all(postInitFuncs.map(async (func) => func(xItem)));
		return xItem as ConfirmedXItem<InstanceType<CItem>>;
	}
	protected abstract factoryMethod(xParent: InstanceType<CParent>): InstanceType<CItem>;
}

function classBuilder<ClassType extends typeof XItem | typeof XGroup, ParentClass extends typeof XGroup>(ClassRef: ClassType, defaultRenderOptions: XOptions extends ApplicationOptions) {
	class ThisFactory extends XFactoryBase<ClassType, ParentClass> {
		protected override factoryMethod(xParent: InstanceType<ParentClass>): InstanceType<ClassType> {
			return new ClassRef(xParent) as InstanceType<ClassType>;
		}
	}
	return new ThisFactory();
}

const FACTORIES = {
	XItem: classBuilder<typeof XItem, XItemOptions, typeof XGroup>(XItem),
	XGroup: classBuilder<typeof XGroup, XGroupOptions, typeof XGroup>(XGroup),
	XPool: classBuilder<typeof XPool, XPoolOptions, typeof XGroup>(XPool),
	XRoll: classBuilder<typeof XRoll, XRollOptions, typeof XGroup>(XRoll),
	XDie: classBuilder<typeof XDie, XDieOptions, typeof XGroup>(XDie, { id: "xdie" }),
	XArm: classBuilder<typeof XArm, XItemOptions, typeof XOrbit>(XArm, { id: "-" }, {
		transformOrigin: "0% 50%",
		top: "50%",
		left: "50%",
		xPercent: 0,
		yPercent: 0
	}),
	XOrbit: classBuilder<typeof XOrbit, XOrbitOptions, typeof XPool>(XOrbit),
	/*DEVCODE*/
	XDisplay: classBuilder<typeof XDisplay, XItemOptions, typeof XROOT>(XDisplay, { id: "DISPLAY" }, {
		xPercent: 0,
		yPercent: 0
	})
	/*!DEVCODE*/
};
export { FACTORIES };
// #endregion ▄▄▄▄▄ FACTORIES ▄▄▄▄▄
