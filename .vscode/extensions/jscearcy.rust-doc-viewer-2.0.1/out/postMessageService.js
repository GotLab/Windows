"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostMessageHandler = void 0;
const vscode = require("vscode");
const models_1 = require("./models");
const utilities_1 = require("./utilities");
class PostMessageHandler {
    constructor(rustDocSrc, workspaceState) {
        this.rustDocSrc = rustDocSrc;
        this.workspaceState = workspaceState;
    }
    handleMessage(message) {
        switch (message.command) {
            case models_1.Command.getUrl:
                if (message.el) {
                    const updatedHref = utilities_1.Utilities.hrefReplacer(message.el, this.rustDocSrc);
                    return { el: updatedHref, elId: message.elId };
                }
                return { elId: message.elId };
            case models_1.Command.newPage:
                if (message.path) {
                    const path = decodeURIComponent(message.path);
                    if (!path.includes('../')) {
                        const newSrc = vscode.Uri.parse(path);
                        this.rustDocSrc = newSrc;
                        return { page: newSrc, elId: message.elId };
                    }
                }
                else if (message.el) {
                    const relativePathArr = message.el.match(/href=["']([a-zA-Z0-9_\-#\.\/]+)["']/);
                    if (relativePathArr) {
                        const relativePath = relativePathArr[1];
                        if (relativePath) {
                            const pathToLoad = utilities_1.Utilities.pathFromRelative(relativePath, this.rustDocSrc);
                            this.rustDocSrc = pathToLoad;
                            return { page: pathToLoad, elId: message.elId };
                        }
                    }
                }
                return { elId: message.elId };
            case models_1.Command.setState:
                if (message.state) {
                    this.workspaceState.update('rustDocViewer', JSON.stringify(message.state));
                }
                return { elId: models_1.Command.setState.toString(), state: message.state };
            case models_1.Command.getState:
                let state = this.workspaceState.get('rustDocViewer', '{}');
                return { elId: models_1.Command.getState.toString(), state };
        }
        return null;
    }
}
exports.PostMessageHandler = PostMessageHandler;
//# sourceMappingURL=postMessageService.js.map