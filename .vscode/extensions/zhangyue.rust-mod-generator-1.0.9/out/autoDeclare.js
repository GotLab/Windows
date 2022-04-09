"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoDeclare = void 0;
const vscode = require("vscode");
const insertLine = require("insert-line");
function autoDeclare(resource, modName, modifier) {
    return __awaiter(this, void 0, void 0, function* () {
        const text = `${modifier}mod ${modName};`;
        const relativePath = vscode.workspace.asRelativePath(resource);
        yield insertLine(resource.fsPath)
            .prepend(text)
            .then((err) => {
            if (err) {
                vscode.window.showErrorMessage(`Failed to declare the mod "${modName}" in ${relativePath}"`);
            }
            else {
                vscode.window.showInformationMessage(`Successfully declare the mod "${modName}" in ${relativePath}"`);
            }
        });
    });
}
exports.autoDeclare = autoDeclare;
//# sourceMappingURL=autoDeclare.js.map