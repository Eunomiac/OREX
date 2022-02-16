
export default class ORoll{
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