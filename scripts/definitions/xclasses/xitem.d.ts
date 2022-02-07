/// <reference types="ts/@types" />
import { XElem } from "../helpers/bundler.js";
declare type XOptions = {
    id: string;
    classes?: string[];
    template: string;
    parent: XItem | null;
};
export default class XItem extends Application {
    #private;
    static get defaultOptions(): ApplicationOptions;
    static get XCONTAINER(): XItem;
    getData(): list;
    constructor({ parent, ...options }: XOptions);
    set(properties: gsap.TweenVars): gsap.core.Tween | false;
    applyGSAPSets(): void;
    _render(force?: boolean | undefined, options?: list | undefined): Promise<void>;
    get elem(): HTMLElement;
    get parent(): XItem | null;
    get positionData(): XElem | undefined;
}
export {};
