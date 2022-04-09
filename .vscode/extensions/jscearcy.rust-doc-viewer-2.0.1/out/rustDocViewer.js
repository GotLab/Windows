"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustDocViewer = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const postMessageService_1 = require("./postMessageService");
const utilities_1 = require("./utilities");
const option_1 = require("./option");
class RustDocViewer {
    constructor(config, context, disposeFn) {
        this.config = config;
        this.context = context;
        this.postMessageHandler = option_1.Option.lift();
        this.rustDocSrc = option_1.Option.lift();
        this.currentPanel = vscode.window.createWebviewPanel('rustDocViewer', `${this.config.getWorkspaceName()} Docs`, vscode.ViewColumn.One, {
            enableScripts: true
        });
        this.rustDocSrc = this.config.getUriToDocs();
        this.rustDocSrc.map((uri) => {
            this.postMessageHandler = option_1.Option.lift(new postMessageService_1.PostMessageHandler(uri, context.workspaceState));
            return uri;
        });
        this.onDispose(disposeFn);
    }
    init() {
        if (option_1.Option.isValue(this.rustDocSrc)) {
            const uri = this.rustDocSrc.unwrap();
            this.render(uri);
            this.currentPanel.webview.onDidReceiveMessage((msg) => this.handleMessage(msg));
        }
        else {
            this.showError('No workspace defined to display docs from, please open a folder in the workspace');
        }
    }
    handleMessage(message) {
        if (option_1.Option.isValue(this.postMessageHandler)) {
            const postMessageHandler = this.postMessageHandler.unwrap();
            const response = postMessageHandler.handleMessage(message);
            if (response && (response.el || response.state)) {
                this.currentPanel.webview.postMessage(response);
            }
            else if (response && response.page) {
                this.render(response.page);
            }
            else {
                this.showError('Could not parse message from the docs page');
            }
        }
        else {
            this.showError('No workspace defined to display docs from, please open a folder in the workspace');
        }
    }
    render(src) {
        this.getCurrentView(src, this.context.extensionPath)
            .then((pageData) => this.currentPanel.webview.html = pageData)
            .catch(_ => this.showError(`Could not open the Rust Docs from: ${src.fsPath}`));
    }
    pullToFront() {
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        this.currentPanel.reveal(columnToShowIn);
    }
    onDispose(disposeFn) {
        this.currentPanel.onDidDispose(disposeFn, null, this.context.subscriptions);
    }
    getCurrentView(src, extensionPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(src.fsPath, (err, data) => {
                if (err) {
                    reject(err);
                }
                const dataString = data.toString('utf8');
                const updatedHrefData = utilities_1.Utilities.hrefReplacer(dataString, src);
                const updatedSrcData = utilities_1.Utilities.srcReplacer(updatedHrefData, src);
                const localScriptUri = vscode.Uri.file(path.join(extensionPath, 'out', 'vscodeSanitizer.js'))
                    .with({ scheme: 'vscode-resource' }).toString();
                const [removePushStateSpotBefore, removePushStateSpotAfter] = updatedSrcData
                    .split('<body>');
                const noPushStateStr = [
                    removePushStateSpotBefore,
                    `<body><script>window.history.pushState=null</script>`,
                    removePushStateSpotAfter
                ].join('');
                const [rustScriptSpotBefore, rustScriptSpotAfter] = noPushStateStr
                    .split('</body>');
                const formattedDocument = [
                    rustScriptSpotBefore,
                    `<script src="${localScriptUri}"></script></body>`,
                    rustScriptSpotAfter
                ].join('');
                resolve(formattedDocument);
            });
        });
    }
    showError(message) {
        vscode.window.showErrorMessage(`Rust: Docs Viewer: ${message}`);
    }
}
exports.RustDocViewer = RustDocViewer;
//# sourceMappingURL=rustDocViewer.js.map