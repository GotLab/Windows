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
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const createModule_1 = require("./createModule");
const autoDeclare_1 = require("./autoDeclare");
const utils_1 = require("./utils");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    vscode.commands.executeCommand('setContext', 'rust-mod-generator.explorerResourceIsFolder', true);
    context.subscriptions.push(vscode.commands.registerCommand("rust-mod-generator.createRustMod", (originUri) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        let uri = originUri
            ? originUri
            : (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri;
        if (!uri) {
            const err = "Please focus on a .rs file .. or just right-click on a .rs file and use the context menu!";
            vscode.window.showErrorMessage(err);
            throw new Error("");
        }
        const rootPath = (yield fs.promises.lstat(uri.fsPath)).isDirectory()
            ? uri.fsPath
            : path.dirname(uri.fsPath);
        const rootUri = vscode.Uri.file(rootPath);
        const mod = yield createModule_1.getModName(uri, rootUri);
        if (!(mod === null || mod === void 0 ? void 0 : mod.modName)) {
            return;
        }
        let modifier = "";
        const allowAutoDeclare = vscode.workspace
            .getConfiguration("rust-mod-generator")
            .get("addModDeclaration");
        const allowSetModifier = vscode.workspace
            .getConfiguration("rust-mod-generator")
            .get("selectAccessModifier");
        if (allowSetModifier && allowAutoDeclare) {
            modifier = yield vscode.window
                .showQuickPick(["private(default)", "pub"], {
                placeHolder: "Select access modifier.",
            })
                .then((modifier) => (modifier === "pub" ? "pub " : ""));
        }
        if (allowAutoDeclare) {
            let resourceUri = uri;
            const libUri = vscode.Uri.joinPath(rootUri, "lib.rs");
            const modUri = vscode.Uri.joinPath(rootUri, "mod.rs");
            if ((yield utils_1.fileExists(libUri)) && (yield utils_1.fileExists(modUri))) {
                const err = `Both "lib.rs" and "mod.rs" are found. Please check your project structure.`;
                vscode.window.showErrorMessage(err);
                throw new Error("");
            }
            else if (yield utils_1.fileExists(modUri)) {
                resourceUri = modUri;
            }
            else if (yield utils_1.fileExists(libUri)) {
                resourceUri = libUri;
            }
            yield autoDeclare_1.autoDeclare(resourceUri, mod.modName, modifier);
        }
        yield utils_1.focusOnFile(mod.modUri);
    })));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map