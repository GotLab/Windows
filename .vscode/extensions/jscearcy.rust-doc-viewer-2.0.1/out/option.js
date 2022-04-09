"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Option = void 0;
class Option {
    constructor(val) {
        this.wrappedVal = val;
    }
    static lift(val) {
        return new Option(val);
    }
    static isValue(val) {
        return val.wrappedVal !== null && val.wrappedVal !== undefined;
    }
    map(fn) {
        if (this.wrappedVal !== null && this.wrappedVal !== undefined) {
            this.wrappedVal = fn(this.wrappedVal);
        }
        return this;
    }
    unwrap() {
        if (this.wrappedVal) {
            return this.wrappedVal;
        }
        else {
            throw new Error('Value was not defined');
        }
    }
}
exports.Option = Option;
//# sourceMappingURL=option.js.map