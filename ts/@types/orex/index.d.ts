// GLOBALS
type Point = gsap.Point2D;
interface Position extends Point {
	height: number;
	width: number;
	rotation: number;
	scale: number;
}

type Anim = gsap.core.Tween | gsap.core.Timeline;

interface XStyleVars extends Partial<FreezeProps<gsap.CSSProperties>> {
	isFreezingRotate?: boolean;
}

interface XTweenVars extends FreezeProps<gsap.TweenVars> {
	scaling?: {
		target: keyof FreezeProps<gsap.TweenVars>,
		maxDelta: number,
		maxDur?: number,
		minDur?: number
	};
}

// IMPLEMENTABLE INTERFACES
interface DOMRenderer extends Position {
	id: string;
	xParent: XParent | null;

	elem: HTMLElement;
	elem$: JQuery<HTMLElement>;

	pos: Point;
	global: Position;

	rendered: boolean;
	render: () => Promise<this>;
	kill: () => Promise<void>;

	set: (vars: gsap.CSSProperties) => Anim;
	vars: XStyleVars;
}
interface XKid extends Application, Tweenable {
	xParent: XParent;
}

interface XParent extends Application, DOMRenderer {
	xKids: XKid[];
	hasXKids: boolean;
	getXKids<X extends XKid>(classRef: ConstructorOf<X>): X[];

	registerXKid: (xKid: XKid & XItem) => void;
	unregisterXKid: (xKid: XKid & XItem) => void;

	adopt: (xItems: XItem | XItem[]) => void;
	disown: (xItems: XKid & XItem | Array<XKid & XItem>) => void;
}
interface Tweenable extends DOMRenderer {
	tweens: Record<string, Anim>;
	to: (vars: XTweenVars) => Anim;
	from: (vars: XTweenVars) => Anim;
	fromTo: (fromVars: gsap.TweenVars, toVars: XTweenVars) => Anim;
}

// XOPTIONS: Options Parameter Schemas for XItems.
type XOrbitSpecs = {
	name: XOrbitType,
	radiusRatio: number,
	rotationScaling: number
};

enum XOrbitType {
	Main = "Main",
	Inner = "Inner",
	Outer = "Outer"
}

namespace XOptions {
	interface Base extends ApplicationOptions {
		id: string,
		classes: string[],
		vars: XStyleVars,
		xParent: XParent | null
	 }

	interface ROOT extends Base {
		id: "XROOT",
		classes: ["XROOT"],
		xParent: null
	}

	interface Item extends Base {
		xParent: XContainer,
		isFreezingRotate: boolean
	}

	interface Group extends Item { }

	interface Arm extends Group {
		xParent: XOrbit
		heldItem: XItem
	}

	interface Orbit extends Group {
		xParent: XPool
		name: string,
		radiusRatio?: number,
		rotationScaling?: number
	}

	interface Pool extends Group {
		orbitals?: Partial<Record<XOrbitType, XOrbitSpecs>>;
	}

	interface Roll extends Pool {

	}
}

