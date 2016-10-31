#!/usr/bin/env node

import * as configurator from "../core/configurator";
const open = require("open");
import * as app from "../server/app";
import {dirExists} from "../helpers/fs";
const debug = require("debug");
const log = debug("sjs:log");
const error = debug("sjs:error");

validate()
    .then(runServer)
    .then(openBrowser)
    .catch(err => {
        error(err.message);
    });

function validate() {
    return dirExists("node_modules/systemjs-server").then(exists => {
        if (!exists) {
            throw new Error("Local systemjs-server was not found. Please run 'npm install systemjs-server'");
        }
    });
}

function runServer() {
    const config = app.configure();
    app.run();
}

function openBrowser() {
    const config = configurator.get();
    open("http://localhost:" + config.port);
}
