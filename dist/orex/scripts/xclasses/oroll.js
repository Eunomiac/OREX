/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

export default class ORoll /* implements Partial<Roll> */ {
    constructor() {
        this._evaluated = false;
        this._items = [];
    }
    // static CHAT_TEMPLATE = U.getTemplatePath("chat/xroll");
    // constructor(options: ORoll.Options = {}, data: ORoll.Data) {
    // }
    get Roll() {
        return (this._foundryRoll = this._foundryRoll ?? new Roll(""));
    }
}