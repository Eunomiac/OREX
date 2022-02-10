

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
	parent: xItem | null,
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
