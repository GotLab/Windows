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
exports.Configuration = void 0;
const vscode = require("vscode");
const path = require("path");
const option_1 = require("./option");
const fs_1 = require("fs");
const toml_1 = require("toml");
const utilities_1 = require("./utilities");
class Configuration {
    constructor(workspaceName, workspacePath) {
        this.workspaceName = workspaceName;
        this.fsPathToDocs = workspacePath;
    }
    static createConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            if (vscode.workspace.workspaceFolders) {
                const [subDirectories, packageNames] = yield this.getRustDirectories(vscode.workspace.workspaceFolders);
                let quickPickSelection;
                if (subDirectories && subDirectories.length === 1) {
                    quickPickSelection = subDirectories[0];
                }
                else if (subDirectories && subDirectories.length > 0) {
                    const quickPickOptions = {
                        placeHolder: 'Select project to display',
                    };
                    const quickPickSelectionOpt = yield vscode.window.showQuickPick(subDirectories, quickPickOptions);
                    if (quickPickSelectionOpt) {
                        quickPickSelection = quickPickSelectionOpt;
                    }
                }
                if (quickPickSelection) {
                    const [packageName, packagePath] = yield this.getCargoPackagePath(quickPickSelection, packageNames);
                    return Promise.resolve(new Configuration(packageName, packagePath));
                }
                else {
                    return this.rejectInstantiation('Please select a folder to display');
                }
            }
            return this.rejectInstantiation('Could not find a valid folder within the workspace/selected workspace folder');
        });
    }
    getUriToDocs() {
        if (this.fsPathToDocs !== '') {
            return option_1.Option.lift(vscode.Uri.file(this.fsPathToDocs).with({ scheme: 'vscode-resource' }));
        }
        else {
            return option_1.Option.lift();
        }
    }
    getWorkspaceName() {
        return this.workspaceName;
    }
    static getCargoPackagePath(projectFolderPath, packageNames) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageTargetPath = path.join(projectFolderPath, 'target', 'doc');
            const readDirs = fs_1.readdirSync(packageTargetPath)
                .reduce((docDirectories, readdirItem) => {
                const stats = fs_1.statSync(path.join(packageTargetPath, readdirItem));
                if (stats.isDirectory() &&
                    packageNames.some(item => item === readdirItem)) {
                    docDirectories.push(readdirItem);
                }
                return docDirectories;
            }, []);
            if (readDirs.length > 1) {
                const quickPickOptions = {
                    placeHolder: 'Select package from the workspace to display',
                };
                const packagePathOpt = yield vscode.window.showQuickPick(readDirs, quickPickOptions);
                if (packagePathOpt) {
                    const packageName = this.formatPackageName(packagePathOpt);
                    const packagePath = this.getPackagePath(projectFolderPath, packageName);
                    return [packageName, packagePath];
                }
            }
            else if (readDirs.length === 1) {
                const packageName = this.formatPackageName(readDirs[0]);
                const packagePath = this.getPackagePath(projectFolderPath, packageName);
                return [packageName, packagePath];
            }
            return ['', ''];
        });
    }
    static formatPackageName(packageName) {
        return packageName.split('-').join('_');
    }
    static getRustDirectories(workspaceFolders) {
        return __awaiter(this, void 0, void 0, function* () {
            const rustDirectories = new Set();
            const rustPackages = new Set();
            for (let i = 0; i < workspaceFolders.length; i++) {
                const workspaceFolder = workspaceFolders[i];
                const [subDirectories, packages] = yield this.getRustSubDirectories(workspaceFolder);
                subDirectories.forEach(dir => rustDirectories.add(dir));
                packages.forEach((val) => rustPackages.add(this.formatPackageName(val)));
            }
            return [Array.from(rustDirectories), Array.from(rustPackages)];
        });
    }
    static getRustSubDirectories(workspaceFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            const readDirPromise = utilities_1.Utilities.toPromise(fs_1.readdir);
            const readFilePromise = utilities_1.Utilities.toPromise(fs_1.readFile);
            const targetDirectories = new Set();
            const packageNames = new Set();
            const subDirQueue = new utilities_1.Queue();
            subDirQueue.enqueue(workspaceFolder.uri.fsPath);
            while (!subDirQueue.isEmpty()) {
                const folderToSearch = subDirQueue.dequeue();
                const folderChildren = yield readDirPromise(folderToSearch).catch(() => []);
                if (folderChildren.indexOf('target') >= 0) {
                    targetDirectories.add(folderToSearch);
                }
                if (folderChildren.indexOf('Cargo.toml') >= 0) {
                    const cargoPath = path.join(folderToSearch, 'Cargo.toml');
                    const cargoFile = yield readFilePromise(cargoPath, { encoding: 'utf8' });
                    const cargoFileDeserialized = toml_1.parse(cargoFile);
                    if (cargoFileDeserialized && cargoFileDeserialized.package) {
                        packageNames.add(cargoFileDeserialized.package.name);
                    }
                }
                const visibleChildren = folderChildren
                    .filter(folder => !(/(^|\/)\.[^\/\.]/g).test(folder))
                    .map(folder => path.join(folderToSearch, folder));
                subDirQueue.enqueueMany(visibleChildren);
            }
            return [Array.from(targetDirectories), Array.from(packageNames)];
        });
    }
    static getPackagePath(projectFolderPath, packageName) {
        return path.join(projectFolderPath, 'target', 'doc', packageName, 'index.html');
    }
    static rejectInstantiation(message) {
        return Promise.reject(`Configuration creation failed: ${message}`);
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map