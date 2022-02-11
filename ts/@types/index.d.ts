

// import {type XElem, XItem, XGroup, XDie, ORoll} from "../helpers/bundler";

/* eslint-disable @typescript-eslint/no-explicit-any */
// type list = {[key: string]: any};
type stringLike = string | number | boolean | null | undefined;

type anyFunc = (...any) => any;
type anyArray = Array<any>;
type anyList = Record<string | number,any>;
type anyPromise = Promise<any>;
type anyPromiseOrReturn = Promise<any> | any;


type sFunc = (([key, val]: [number | string, any]) => boolean) | ((val: any, key: number) => boolean);
type keyMapFunc = (key: string | number, val?: unknown) => string | number;
type valMapFunc = (val: unknown, key?: number | string) => unknown;
/* eslint-enable @typescript-eslint/no-explicit-any */

type int = number; // Soft assertion that number is integer
type float = number; // Soft assertion that number is float
type posInt = number; // Soft assertion that number is integer >= 0
type HTMLCode = string; // Soft assertion that string contains HTML Code

interface point {x: number, y: number}
interface pointFull {x: number, y: number, rotation: number, scale: number}

interface CONFIG {
	OREX: anyList
}

interface DOMElement {
	elem: Element,
	parent: XParent,
	_x: number,
	_y: number,
	_pos: point,
	_rotation: number,
	_scale: number,
	x: number,
	y: number,
	pos: point,
	rotation: number,
	scale: number,
	adopt: (xItem: XItem, isRetainingPosition?: boolean) => void
}

enum XScope {XROOT = "XROOT", SANDBOX = "SANDBOX"}
type XParent = XItem|keyof XScope;

interface XOptions extends Partial<ApplicationOptions> {
	parent: XParent,
	isRendering?: boolean,
	style?: Partial<gsap.CSSProperties> | Array<Partial<gsap.CSSProperties>>,
	initialXItems?: Array<XItem | Array<XItem>>
}

enum OFace { " " = 0, "1" = 1, "2" = 2, "3" = 3, "4" = 4, "5" = 5, "6" = 6, "7" = 7, "8" = 8, "9" = 9, "0" = 10, "M" }

interface ODieResult extends DiceTerm.Result {
	result: OFace
}

interface ODiceTerm extends DiceTerm {
	faces: 10 = 10;
	number: DiceTerm.number = 1;
	modifiers: DiceTerm.modifiers = [];
	results: Array<ODieResult> = [];
	options: DiceTerm.Options = {};
}

// interface ORollTerm extends RollTerm {

// }

interface ORollData extends Roll.data {
	class: string;
	options: Partial<ORollOptions>;
	dice: Array<ODiceTerm>;
	terms: Array<ORollTerm>;
	total: null;
	evaluated: boolean;
}
interface ORollOptions extends RollTerm.EvaluationOptions {
	difficulty?: posInt = 1;
	minimize?: RollTerm.EvaluationOptions.minimize = false;
	maximize?: RollTerm.EvaluationOptions.maximize = false;
	async?: true = true;
}