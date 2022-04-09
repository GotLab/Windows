"use strict";
var Command;
(function (Command) {
    Command["getUrl"] = "getUrl";
    Command["newPage"] = "newPage";
    Command["setState"] = "setState";
    Command["getState"] = "getState";
})(Command || (Command = {}));
const vscode = acquireVsCodeApi();
class CookieShim {
    static set(newState) {
        CookieShim.cookieShimWindowExtensions.updateLocalStorage('rustdoc-theme', newState['rustdoc-theme']);
    }
    static switch() {
        const currentTheme = document.getElementById("themeStyle");
        const mainTheme = document.getElementById("mainThemeStyle");
        switchTheme(currentTheme, mainTheme, CookieShim.cookieShimWindowExtensions.getCurrentValue('rustdoc-theme'));
    }
}
CookieShim.cookieShimWindowExtensions = Object.assign(window, {
    usableLocalStorage: () => true,
    updateLocalStorage: (name, value) => {
        const state = { [name]: value };
        vscode.setState(state);
        vscode.postMessage({
            elId: Command.setState,
            command: Command.setState,
            state,
        });
    },
    getCurrentValue: (name) => {
        const state = vscode.getState();
        return state && state[name] || 'light';
    }
});
(function (vscode, window) {
    setTimeout(() => {
        const hrefs = Array.from(document.querySelectorAll('[href]'))
            .filter(el => el.href !== '');
        hrefs.forEach((el, idx) => {
            const elId = idx.toString();
            if (!el.href.includes('#')) {
                el.id = elId;
                vscode.postMessage({
                    elId: elId,
                    command: Command.getUrl,
                    el: el.outerHTML,
                });
            }
        });
    }, 100);
    window.addEventListener('message', (e) => {
        const message = e.data;
        if (message.elId === Command.getState.toString()) {
            const state = JSON.parse(message.state);
            CookieShim.set(state);
            CookieShim.switch();
        }
        else {
            const elToUpdate = document.getElementById(message.elId);
            if (elToUpdate) {
                elToUpdate.outerHTML = message.el;
            }
        }
    });
    document.addEventListener('click', (e) => {
        e.preventDefault();
        const element = e.srcElement;
        if (element && validNavigableEl(element)) {
            const el = element;
            const href = decodeURIComponent(el.href);
            if (href === '') {
                vscode.postMessage({
                    elId: el.id,
                    command: Command.newPage,
                    el: el.outerHTML,
                });
            }
            else if (href.includes('#')) {
                const id = href.split('#')[1];
                const elToScrollTo = document.getElementById(id);
                if (elToScrollTo) {
                    elToScrollTo.scrollIntoView();
                }
            }
            else {
                vscode.postMessage({
                    elId: el.id,
                    command: Command.newPage,
                    path: el.href
                });
                window.scroll(0, 0);
            }
        }
        else if (element &&
            (element.tagName === "SPAN" || element.tagName === "P")) {
            const parentA = element.parentElement;
            if (parentA && parentA.tagName === "A") {
                if (parentA.href !== '') {
                    vscode.postMessage({
                        elId: parentA.id,
                        command: Command.newPage,
                        path: parentA.href
                    });
                }
                else {
                    vscode.postMessage({
                        elId: parentA.id,
                        command: Command.newPage,
                        el: parentA.outerHTML,
                    });
                }
            }
        }
        return false;
    });
    function validNavigableEl(element) {
        return element.classList.contains('crate')
            || element.tagName === 'A';
    }
    vscode.postMessage({
        elId: Command.getState,
        command: Command.getState,
    });
})(vscode, window);
//# sourceMappingURL=vscodeSanitizer.js.map