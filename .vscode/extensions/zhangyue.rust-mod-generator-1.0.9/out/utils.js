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
exports.updateCustomWhenClause = exports.focusOnFile = exports.fileExists = void 0;
const vscode = require("vscode");
function fileExists(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield vscode.workspace.fs
            .stat(uri)
            .then((stat) => (stat.type ? true : false))
            .then(undefined, (isRejected) => !isRejected);
    });
}
exports.fileExists = fileExists;
function focusOnFile(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        yield vscode.workspace
            .openTextDocument(uri)
            .then((doc) => vscode.window.showTextDocument(doc));
    });
}
exports.focusOnFile = focusOnFile;
function updateCustomWhenClause(rootUri) {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.commands.executeCommand('setContext', 'rust-mod-generator.explorerResourceIsFolder', (yield fileExists(vscode.Uri.joinPath(rootUri, "mod.rs")))
            || (yield fileExists(vscode.Uri.joinPath(rootUri, "lib.rs"))));
    });
}
exports.updateCustomWhenClause = updateCustomWhenClause;
//# sourceMappingURL=utils.js.map