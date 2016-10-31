import * as configurator from "../core/configurator";
import {fileExists} from "../helpers/fs";
import {or} from "../helpers/promise";
import * as path from "path";
import {logger} from "../core/logger";

const config = configurator.get();

export function resolveFile(location: string) {
    const filePath = path.join(config.basePath, location);

    return fileExists(filePath)
        .then(exists => {
            if(exists) {
                logger.log("FOUND " + filePath);
                return location;
            }
            else {
                logger.log(filePath);
                return "";
            }
        })
        .catch(err => {
            logger.log("ERROR " + err.message);
            throw err;
        });
}

export function resolveWithExtensions(location: string, extensions: string[]) {
    extensions = extensions || config.defaultExtensions;

    const funcs = [];

    for(let ext of extensions) {
        let locationWithExt = location + (ext ? ("." + ext) : "");
        funcs.push(() => resolveFile(locationWithExt));
    }

    return or(funcs);
}

export function resolveFiles(locations: string[]) {
    const funcs = [];

    for(let location of locations) {
        funcs.push(() => resolveWithExtensions(location, config.defaultExtensions));
    }

    return or(funcs);
}
