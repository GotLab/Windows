"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = exports.Utilities = void 0;
const vscode = require("vscode");
const path = require("path");
class Utilities {
    static hrefReplacer(data, srcPath) {
        const linkMatcher = /href=["']([a-zA-Z0-9_\-#\.\/]+)["']/g;
        const webviewLinkMatcher = /href=["']vscode-webview-resource:\/\/[\d\w-]+\/file\/\/([a-zA-Z0-9_\-#\.\/:]+).html["']/g;
        if (webviewLinkMatcher.test(data)) {
            return data.replace(webviewLinkMatcher, (_, pathMatch) => {
                const path = vscode.Uri.file(`${pathMatch}.html`)
                    .with({ scheme: 'vscode-resource' })
                    .toString(true);
                return `href="${path}"`;
            });
        }
        else {
            return Utilities.pathReplacer(linkMatcher, data, srcPath, (newPath) => `href="${newPath}"`);
        }
    }
    static srcReplacer(data, srcPath) {
        const srcMatcher = /src=["']([a-zA-Z0-9-\.\/]+)["']/g;
        return Utilities.pathReplacer(srcMatcher, data, srcPath, (newPath) => `src="${newPath}"`);
    }
    static pathReplacer(matcher, data, srcPath, builder) {
        return data.replace(matcher, (_, pathMatch) => {
            const newVsPath = Utilities.pathFromRelative(pathMatch, srcPath).with({ scheme: 'vscode-resource' }).toString(true);
            return builder(newVsPath);
        });
    }
    static pathFromRelative(relPath, srcPath) {
        const newPath = path.join(srcPath.fsPath, '../', relPath);
        return vscode.Uri.file(newPath);
    }
    static toPromise(fn) {
        return (...args) => {
            return new Promise((resolve, reject) => {
                fn(...args, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        };
    }
}
exports.Utilities = Utilities;
class Queue {
    constructor() {
        this.line = [];
    }
    enqueue(item) {
        this.line = [...this.line, item];
    }
    enqueueMany(items) {
        this.line = [...this.line, ...items];
    }
    dequeue() {
        if (this.isEmpty()) {
            throw Error('Queue is empty');
        }
        return this.line.shift();
    }
    isEmpty() {
        return this.line.length === 0;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=utilities.js.map