const path = require("path");

export interface Configuration {
    basePath: string,
    defaultExtensions: string[],
    port: number;
}

const config: Configuration = {
    basePath: process.cwd(),
    defaultExtensions: ["", "js"],
    port: 3000,
};

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
