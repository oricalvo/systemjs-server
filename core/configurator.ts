import * as fsHelpers from "../helpers/fs";
import {logger} from "./logger";
import * as path from "path";

export interface Configuration {
    basePath: string,
    defaultExtensions: string[],
    port: number;
    systemJSLocation: string,
    systemJSConfigLocation: string,
    mainLocation: string,
    indexHtmlLocation: string,
}

const config: Configuration = {
    basePath: process.cwd(),
    defaultExtensions: ["", "js"],
    port: 3000,
    systemJSLocation: null,
    systemJSConfigLocation: null,
    mainLocation: null,
    indexHtmlLocation: null,
};

export function reload(): Promise<Configuration> {
    logger.log("Reloading configuration");

    function getSystemJSSrcLocation() {
        return fsHelpers.findFirst([
            "node_modules/systemjs/dist/system.src.js",
            "node_modules/systemjs-server/node_modules/systemjs/dist/system.src.js"
        ]);
    }

    function getSystemJSConfigLocation() {
        return fsHelpers.findFirst([
            "systemjs.config.js",
            "system.config.js"
        ]);
    }

    function getMainLocation() {
        return fsHelpers.findFiles(config.basePath, [
            "main",
            "app/main"
        ], config.defaultExtensions);
    }

    function getIndexHtmlLocation() {
        return fsHelpers.findFirst([
            "index.html",
        ]);
    }

    return Promise.all([
        getSystemJSSrcLocation(),
        getSystemJSConfigLocation(),
        getMainLocation(),
        getIndexHtmlLocation(),
    ]).then(values => {
        config.systemJSLocation = values[0];
        config.systemJSConfigLocation = values[1];
        config.mainLocation = values[2];
        config.indexHtmlLocation = values[3];
        console.log("");

        dump();

        return config;
    });
}

export function get() : Configuration {
    return config;
}

export function set(c: Configuration) {
    for(let key in config) {
        if(c.hasOwnProperty(key)) {
            config[key] = c[key];
        }
    }

    return config;
}

export function dump() {
    logger.log("Configuration");
    logger.log("    basePath: " + config.basePath);
    logger.log("    port: " + config.port);
    logger.log("    defaultExtensions: " + config.defaultExtensions);
    logger.log("    indexHtmlLocation: " + config.indexHtmlLocation);
    logger.log("    mainLocation: " + config.mainLocation);
    logger.log("    systemJSLocation: " + config.systemJSLocation);
    logger.log("    systemJSConfigLocation: " + config.systemJSConfigLocation);
    logger.log("");
}

export function fullPath(relPath) {
    return path.join(config.basePath, relPath);
}
