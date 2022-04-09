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
const vscode = require("vscode");
const rustDocViewer_1 = require("./rustDocViewer");
const configuration_1 = require("./configuration");
function activate(context) {
    let rustDocViewers = new Map();
    console.log('"rust-doc-viewer" is now active');
    let disposable = vscode.commands.registerCommand('extension.rustDocViewer', () => __awaiter(this, void 0, void 0, function* () {
        yield configuration_1.Configuration.createConfiguration()
            .then(config => {
            const existingRustDocViewer = rustDocViewers.get(config.getWorkspaceName());
            if (existingRustDocViewer) {
                existingRustDocViewer.pullToFront();
            }
            else {
                const newRustDocViewer = new rustDocViewer_1.RustDocViewer(config, context, () => rustDocViewers.delete(config.getWorkspaceName()));
                newRustDocViewer.init();
                rustDocViewers.set(config.getWorkspaceName(), newRustDocViewer);
            }
        })
            .catch(err => {
            vscode.window.showErrorMessage(`Rust: Docs Viewer: ${err}`);
        });
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map