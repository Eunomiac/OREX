/* eslint-disable @typescript-eslint/no-explicit-any */
declare type stringLike = string | number | boolean | null | undefined;

declare type anyFunc = (...any: any[]) => any;
declare type anyArray = Array<any>;
declare type anyList = Record<string | number,any>;
declare type anyPromise = Promise<any>;
declare type anyPromiseOrReturn = Promise<any> | any;


declare type sFunc = (([key, val]: [number | string, any]) => boolean) | ((val: any, key: number) => boolean);
declare type keyMapFunc = (key: string | number, val?: unknown) => string | number;
declare type valMapFunc = (val: unknown, key?: number | string) => unknown;
/* eslint-enable @typescript-eslint/no-explicit-any */

declare type int = number; // Soft assertion that number is integer
declare type float = number; // Soft assertion that number is float
declare type posInt = number; // Soft assertion that number is integer >= 0
declare type HTMLCode = string; // Soft assertion that string contains HTML Code

declare interface point {x: number, y: number}
declare interface pointFull {x: number, y: number, rotation: number, scale: number}

declare interface CONFIG {
	OREX: anyList
}

declare interface DOMElement {
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

declare enum XScope {XROOT = "XROOT", SANDBOX = "SANDBOX"}
declare type XParent = XItem|XScope;

declare interface XOptions extends Partial<ApplicationOptions> {
	parent: XParent,
	isRendering?: boolean,
	style?: Partial<gsap.CSSProperties>,
	initialXItems?: Array<XItem | Array<XItem>>,
	orbitals?: Array<number>
}

declare enum OFace { " " = 0, "1" = 1, "2" = 2, "3" = 3, "4" = 4, "5" = 5, "6" = 6, "7" = 7, "8" = 8, "9" = 9, "0" = 10, "M" }

declare interface ODieResult extends DiceTerm.Result {
	result: OFace
}

declare interface ODiceTerm extends DiceTerm {
	faces: 10 = 10;
	number: DiceTerm.number = 1;
	modifiers: DiceTerm.modifiers = [];
	results: Array<ODieResult> = [];
	options: DiceTerm.Options = {};
}

declare interface ORollData extends Roll.data {
	class: string;
	options: Partial<ORollOptions>;
	dice: Array<ODiceTerm>;
	terms: Array<ORollTerm>;
	total: null;
	evaluated: boolean;
}
declare interface ORollOptions extends RollTerm.EvaluationOptions {
	difficulty?: posInt = 1;
	minimize?: RollTerm.EvaluationOptions.minimize = false;
	maximize?: RollTerm.EvaluationOptions.maximize = false;
	async?: true = true;
}