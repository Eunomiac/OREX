/// <reference types="ts/@types" />
declare function objMap(obj: anyList | anyArray, keyFunc: keyMapFunc | valMapFunc | false, valFunc?: valMapFunc): anyList | anyArray;
declare function get(target: gsap.TweenTarget, property: string, unit: string): number;
declare function get(target: gsap.TweenTarget, property: string): string | number;
declare const _default: {
    GMID: () => string | false;
    isNumber: (ref: unknown) => ref is number;
    isPosInt: (ref: unknown) => ref is number;
    isIterable: (ref: unknown) => ref is Iterable<unknown>;
    isHTMLCode: (ref: unknown) => ref is string;
    hasItems: (ref: unknown) => ref is anyList | anyArray;
    areEqual: (...refs: anyArray) => boolean;
    pFloat: (ref: unknown, sigDigits?: number | undefined, isStrict?: boolean) => number;
    pInt: (ref: unknown, isStrict?: boolean) => number;
    radToDeg: (rad: number, isConstrained?: boolean) => number;
    degToRad: (deg: number, isConstrained?: boolean) => number;
    testRegExp: (str: stringLike, patterns?: (string | RegExp)[], flags?: string, isTestingAll?: boolean) => boolean;
    regExtract: (ref: stringLike, pattern: string | RegExp, flags?: string) => string | string[] | undefined;
    uCase: (str: stringLike) => string;
    lCase: (str: stringLike) => string;
    sCase: (str: stringLike) => string;
    tCase: (str: stringLike) => string;
    hyphenate: (str: stringLike) => string;
    unhyphenate: (str: stringLike) => string;
    pluralize: (singular: string, num: number, plural?: string | undefined) => string;
    oxfordize: (items: (string | number)[], useOxfordComma?: boolean) => string;
    ellipsize: (text: stringLike, maxLength: number) => string;
    parseArticles: (str: stringLike) => string;
    signNum: (num: number, delim?: string) => string;
    padNum: (num: number, numDecDigits: number) => string;
    stringifyNum: (num: string | number) => string;
    verbalizeNum: (num: string | number) => string;
    ordinalizeNum: (num: string | number, isReturningWords?: boolean) => string;
    romanizeNum: (num: number, isUsingGroupedChars?: boolean) => string;
    loremIpsum: (numWords?: number) => string;
    randWord: (numWords?: number, wordList?: string[]) => string;
    isIn: (needle: stringLike, haystack?: stringLike[], fuzziness?: number) => unknown;
    isInExact: (needle: stringLike, haystack: stringLike[]) => unknown;
    randNum: (min: number, max: number, snap?: number) => number;
    randInt: (min: number, max: number) => number;
    coinFlip: () => boolean;
    cycleNum: (num: number, [min, max]?: [(number | undefined)?, (number | undefined)?]) => number;
    cycleAngle: (angle: number) => number;
    roundNum: (num: number, sigDigits?: number) => number;
    getDistance: ({ x: x1, y: y1 }: point, { x: x2, y: y2 }: point) => number;
    getAngle: ({ x: x1, y: y1 }: point, { x: x2, y: y2 }: point, { x: xO, y: yO }?: point) => number;
    getAngleDelta: (angleStart: number, angleEnd: number) => number;
    randElem: (array: anyArray) => unknown;
    randIndex: (array: anyArray) => number;
    makeCycler: (array: anyArray, index?: number) => Generator<unknown, any, unknown>;
    getLast: (array: anyArray) => unknown;
    unique: (array: anyArray) => anyArray;
    partition: (obj: anyList | anyArray, predicate?: (val: unknown, key: unknown) => boolean) => [anyList | anyArray, anyList | anyArray];
    objMap: typeof objMap;
    objFilter: (obj: anyList | anyArray, keyFunc: false | keyMapFunc | valMapFunc, valFunc?: valMapFunc | undefined) => anyList | anyArray;
    objForEach: (obj: anyList, func: (val: unknown, key?: string | number | undefined) => void) => void;
    objCompact: (obj: anyList, preserve?: stringLike[]) => anyList | anyArray;
    remove: (obj: anyList | anyArray, searchFunc: sFunc) => unknown;
    replace: (obj: anyList | anyArray, searchFunc: sFunc, repVal: unknown) => boolean;
    removeFirst: (array: anyArray, element: unknown) => unknown[];
    pullElement: (array: anyArray, checkFunc?: (_v?: unknown, _i?: number, _a?: anyArray) => void) => unknown;
    pullIndex: (array: anyArray, index: number) => unknown;
    objClone: (obj: unknown) => unknown;
    objMerge: (target: unknown, source: unknown, { isMergingArrays, isOverwritingArrays }: {
        isMergingArrays: boolean;
        isOverwritingArrays: boolean;
    }) => unknown;
    objExpand: (obj: anyList) => {};
    objFlatten: (obj: anyList) => anyList;
    getDynamicFunc: (funcName: string, func: (...args: anyArray) => unknown, context: object) => false | ((...args: stringLike[]) => unknown);
    gsap: typeof globalThis.gsap;
    get: typeof get;
    set: (targets: gsap.TweenTarget, vars: gsap.TweenVars) => gsap.core.Tween;
    getRawCirclePath: (r: number, { x: xO, y: yO }?: point) => (string | number)[][];
    drawCirclePath: (radius: number, origin: point) => string;
    formatAsClass: (str: string) => string;
    getGSAngleDelta: (startAngle: number, endAngle: number) => string;
    getTemplatePath: (fileRelativePath: string) => string;
};
export default _default;
