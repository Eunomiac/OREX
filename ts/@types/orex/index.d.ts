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
interface XTerm extends Application, Tweenable {
	type: XTermType,
	xParent: XGroup,
	// THIS SHIT IS WRONG AND BAD: NEED TO ACCOUNT FOR OTHER TYPES OF VALUES
	value?: XDieValue,
	ApplyEffect?: (xRoll: XRoll) => XRoll
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

// declare enum XOrbitType {
// 	Core = "Core",
// 	Main = "Main",
// 	Inner = "Inner",
// 	Outer = "Outer"
// }

// declare enum XTermType {
// 	// Can we extend XDieType here, somehow?
// 	BasicDie, ExpertDie, MasterDie, GobbleDie,
// 	BasicSet, MatchSet, RunSet, FullHouseSet,
// 	Difficulty, Modifier, Trait, Styler,
// 	Ignore
// }

type XDieFace = " " | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "X";
type XDieValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type XDieType = XTermType.BasicDie | XTermType.ExpertDie | XTermType.MasterDie | XTermType.GobbleDie;
type XModType = XTermType.Difficulty | XTermType.Modifier | XTermType.Trait;

namespace XOptions {
	interface Base {
		id?: string,
		classes?: string[],
		template?: string,
		vars?: XStyleVars,
		xParent?: XParent | null
	 }

	interface ROOT extends Base {
		id: "XROOT",
		classes: ["XROOT"],
		xParent: null
	}

	interface Item extends Base {
		xParent: XContainer,
		isFreezingRotate?: boolean
	}

	interface Group extends Item { }

	interface Arm extends Group {
		xParent: XOrbit,
		heldItem: XItem
	}

	interface Orbit extends Group {
		xParent: XPool
		name: XOrbitType,
		radiusRatio: number,
		rotationScaling: number
	}

	interface Pool extends Group {
		size: number,
		orbitals?: Partial<Record<XOrbitType, XOrbitSpecs>>
	}

	interface Roll extends Pool {
		color?: string,
		size?: number,
		position: Point
	}

	interface Source extends Pool { }

	interface Term extends Item {
		type: XTermType
	}
	interface Die extends Term {
		type: XDieType,
		value?: XDieValue,
		dieSize?: number,
		dieColor?: string,
		numColor?: string,
		strokeColor?: string,
	}

	interface Mod extends Term {
		type: XModType,
		value?: number
	}
}


