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
exports.getModName = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const utils_1 = require("./utils");
function getModName(uri, rootUri) {
    return __awaiter(this, void 0, void 0, function* () {
        return vscode.window
            .showInputBox({
            placeHolder: "<directory_name> or <file_name>.rs",
            prompt: "Enter the mod name. If the input ends with .rs, a single .rs file will be created, else a new subdirectory with mod.rs will be created."
        })
            .then((modName) => __awaiter(this, void 0, void 0, function* () {
            if (!modName) {
                return;
            }
            if (!(yield utils_1.fileExists(vscode.Uri.joinPath(rootUri, "mod.rs")))
                && !(yield utils_1.fileExists(vscode.Uri.joinPath(rootUri, "lib.rs")))) {
                const err = `The directory "${rootUri.fsPath}" does not contain either a "mod.rs" or "lib.rs".`;
                vscode.window.showErrorMessage(err);
                throw new Error("");
            }
            let modUri = vscode.Uri.joinPath(rootUri, modName);
            if (modName.endsWith(".rs")) {
                // Check if the mod already exists.
                if ((yield utils_1.fileExists(modUri)) ||
                    (yield utils_1.fileExists(vscode.Uri.joinPath(rootUri, path.basename(modName, ".rs"))))) {
                    const err = `The mod "${path.basename(modName, ".rs")}" already exists.`;
                    vscode.window.showErrorMessage(err);
                    throw new Error("");
                }
                modUri = yield createModule(modUri, false);
            }
            else {
                // Check if the mod already exists.
                if ((yield utils_1.fileExists(modUri)) ||
                    (yield utils_1.fileExists(vscode.Uri.file(modUri.fsPath + ".rs")))) {
                    const err = `The mod "${modName}" already exists.`;
                    vscode.window.showErrorMessage(err);
                    throw new Error("");
                }
                modUri = yield createModule(modUri, true);
            }
            return { modName: path.basename(modName, ".rs"), modUri: modUri };
        }));
    });
}
exports.getModName = getModName;
function createModule(uri, isDir = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isDir) {
            // Create the directory.
            fs.mkdirSync(uri.fsPath);
            uri = vscode.Uri.joinPath(uri, "mod.rs");
        }
        // Create the file.
        (yield fs.promises.open(uri.fsPath, "w")).close();
        return uri;
    });
}
//# sourceMappingURL=createModule.js.map