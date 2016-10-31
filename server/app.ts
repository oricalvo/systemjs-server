import * as path from "path";
import * as express from "express";
import * as systemjsMiddleware from "./middleware";
import * as configurator from "../core/configurator";
import {logger} from "../core/logger";

const config = configurator.get();

export function configure(options?) {
    Object.assign(config, options);

    return config;
}

export function run() {
    logger.log("systemjs-server");
    logger.log("    basePath: " + config.basePath);
    logger.log("    port: " + config.port);

    const app = express();

    systemjsMiddleware.config({
        basePath: config.basePath
    });
    systemjsMiddleware.setup(app);

    app.use(express.static(config.basePath));

    app.listen(config.port, function () {
        logger.log('Example app listening on port 3000!');
    });
}
