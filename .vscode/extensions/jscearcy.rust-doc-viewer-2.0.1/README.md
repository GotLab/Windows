# rust-doc-viewer

This extension will take your locally generated project docs and display them in a new window for easier reference.

## Use

* Create the documentation using `cargo doc` inside of your project folder
* Open the folder in VS Code
* Open the Command Palette `Ctrl+Shift+P` or `Cmd+Shift+P`
* Search and activate `Rust: Doc Viewer`

## Features

Open your rust docs and view them in another tab on VS Code

![Rust Doc Viewer Demo](https://github.com/JScearcy/rust-doc-viewer/raw/master/images/rust-doc-viewer-demo.gif)

## Known Issues

    1.) No easy navigation

    2.) Requires documentation to be in the standard output from `cargo docs` 

    3.) Testing and build automation

## Release Notes

## 2.0.1

* Fix bug preventing anchor tags from being modified if the element contains a `#` char

## 2.0.0

* Update dependencies to latest
* Add additional doc path handling to cover `vscode-webview-resource` html files
* Reduce wait time in webview script to fix dynamic anchor elements

### 1.0.11

* Discover all rust packages in workspace

### 1.0.10

* Rollback 1.0.9

### 1.0.9

* Fix bug discovering docs with various supported workspace configurations
* Remove dependency on `toml`

### 1.0.8

* Fix bug discovering docs with package that uses hyphens `-`, since rust replaces with them with an underscore `_`

### 1.0.7

* Fix bug improperly discovering docs in a Rust workspace (Not VS Code workspace)

### 1.0.6

* List rust folders with rust standard structure
* Open multiple Rust docs per workspace (i.e. a workspace with multiple Rust projects)

### 1.0.5

* `vscode` dependencies contained a vulnerability. Updated package to latest with no gulp dependency
* `js-yaml` contained vulnerabilities. Updated via `npm audit fix`
* Add ability to handle untitled workspaces

### 1.0.4

* Add icon and update banner

### 1.0.3

* Remove configuration until it can be used and is fully functional
* Fix nested navigation path resolution

### 1.0.2

* Update README with more setup information

### 1.0.1

* Fix issue finding generated docs

### 1.0.0

* Initial release of Rust Doc Viewer
