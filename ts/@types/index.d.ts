

/* eslint-disable @typescript-eslint/no-explicit-any */
type list = {[key: string]: any};
type stringLike = string | number | boolean | null | undefined;
type sFunc = (([key, val]: [number | string, any]) => boolean) | ((val: any, key: number) => boolean);
/* eslint-enable @typescript-eslint/no-explicit-any */

type int = number; // Soft assertion that number is integer
type float = number; // Soft assertion that number is float
type posInt = number; // Soft assertion that number is integer >= 0
type HTMLCode = string; // Soft assertion that string contains HTML Code

interface point {x: number, y: number}
interface pointFull {x: number, y: number, rotation: number, scale: number}


interface CONFIG {
	OREX: list
}

interface position {
	local: pointFull,
	global: pointFull,
	height: number,
	width: number
}
