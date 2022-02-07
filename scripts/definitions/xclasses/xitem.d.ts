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
    pos: XElem | undefined;
    getData(): list;
    constructor({ parent, ...options }: XOptions);
    _render(force?: boolean | undefined, options?: list | undefined): Promise<void>;
    get elem(): HTMLElement;
    get parent(): XItem | null;
}
export {};
