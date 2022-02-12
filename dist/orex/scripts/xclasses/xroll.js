/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌█████████░░░░░░░░░░░░░░░░ ORE-X for Foundry VTT ░░░░░░░░░░░░░░░░░░█████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌█████████████████████ MIT License █ v0.0.1-prealpha █  ████████████████████▐     *|
|*     ▌██████████░░░░░░░░░░ https://github.com/Eunomiac/orex ░░░░░░░░░░███████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

class ODie extends DiceTerm {
    constructor() {
        super(...arguments);
        this.faces = 10;
        this.number = 1;
        this._evaluated = false;
        this.isIntermediate = false;
        this.results = [{ result: OFace[" "] }];
        // override get expression(): string {
        // 	throw new Error("Method not implemented.");
        // }
        // override get formula(): string {
        // 	throw new Error("Method not implemented.");
        // }
        // override get total(): string | number | null | undefined {
        // 	throw new Error("Method not implemented.");
        // }
        // override get flavor(): string {
        // 	throw new Error("Method not implemented.");
        // }
        // override get isDeterministic(): boolean {
        // 	throw new Error("Method not implemented.");
        // }
        // override evaluate(options?: any): this | Promise<this> {
        // 	throw new Error("Method not implemented.");
        // }
        // protected override _evaluate({ minimize, maximize }?: { minimize?: boolean | undefined; maximize?: boolean | undefined; }): Promise<this> {
        // 	throw new Error("Method not implemented.");
        // }
        // protected override _evaluateSync({ minimize, maximize }?: { minimize?: boolean | undefined; maximize?: boolean | undefined; }): this {
        // 	throw new Error("Method not implemented.");
        // }
        // override toJSON(): object {
        // 	throw new Error("Method not implemented.");
        // }
    }
}
export default class ORoll /* implements Partial<Roll> */ {
    // static CHAT_TEMPLATE = U.getTemplatePath("chat/xroll");
    constructor(xGroup, data, options = {}) {
        this._evaluated = false;
        this._dice = [];
        this._parentGroup = xGroup;
    }
    get Roll() {
        var _a;
        return (this._foundryRoll = (_a = this._foundryRoll) !== null && _a !== void 0 ? _a : new Roll(""));
    }
}