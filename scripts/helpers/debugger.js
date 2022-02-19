import { C } from "./bundler.js";
const XDebugger = (type, message, ...content) => {
    if (C.isDebugging) {
        const styleLine = Object.entries({
            ...STYLES.base,
            ...STYLES[type] ?? {}
        }).map(([prop, val]) => `${prop}: ${val};`).join(" ");
        switch (type) {
            case "group":
                console.groupCollapsed(`%c${message}`, styleLine);
                break;
            case "groupEnd":
                console.groupEnd();
                break;
            default: {
                console.groupCollapsed(`%c${message}`, styleLine, ...content);
                console.trace();
                console.groupEnd();
                break;
            }
        }
    }
};
const STYLES = {
    base: {
        "background": "#000000",
        "color": "#EDB620",
        "font-family": "Pragmata Pro",
        "padding": "0 25px"
    },
    display: {
        "color": "#EDB620",
        "font-family": "AlverataInformalW01-Regular",
        "font-size": "16px",
        "margin-left": "-100px",
        "padding": "0 100px"
    },
    error: {
        "color": "#FF0000",
        "background": "#950A0F",
        "font-weight": "bold"
    },
    group: {
        "background": "#EDB620",
        "color": "black",
        "font-weight": "bold",
        "text-transform": "uppercase"
    },
    groupEnd: {}
};
const DB = {
    group: (label) => XDebugger("group", label),
    groupEnd: () => XDebugger("groupEnd", ""),
    display: (message, ...content) => XDebugger("display", message, ...content),
    log: (message, ...content) => XDebugger("base", message, ...content),
    error: (message, ...content) => XDebugger("error", message, ...content)
};
export default DB;