import {logger} from "../core/logger";
const fs = require("fs");
import {
    ResolverCollection, ResolverUnderNpmPackageDistFolder, ResolverNpmPackage,
    ResolverSystemJSPlugin, ResolverDefaultExtensions, ResolverNull, ResolverUnderNodeModulesFolder
} from "../resolvers/index";
import * as configurator from "../core/configurator";
import * as fsHelpers from "../helpers/fs";
import * as cheerio from "cheerio";

export const resolvers = new ResolverCollection("global", [
    //
    //  app/main ==> app/main.js
    //
    new ResolverDefaultExtensions(),

    //
    //  rxjs/Subject ==> node_module/rxjs/Subject.js
    //
    new ResolverUnderNodeModulesFolder(),

    //
    //  jquery ==> node_modules/jquery/dist/jquery.js
    //
    new ResolverUnderNpmPackageDistFolder(),

    //
    //  redux ==> node_modules/redux/package.json ==> node_modules/redux/index.js
    //
    new ResolverNpmPackage(),

    //
    //  text ==> node_modules/systemjs-plugin-text
    //
    new ResolverSystemJSPlugin(),

    //
    //  XXX ==> XXX
    //
    new ResolverNull(),
]);

function nodeStyleToPromise(func, arg) {
    return new Promise(function(resolve, reject) {
        func(arg, function(value, err) {
            if(err) {
                reject(err);
            }

            resolve(value);
        });
    });
}

export function setup(app) {
    if(!app) {
        throw new Error("SystemJS middleware setup must receive a reference to an express application instance");
    }

    logger.log("The following resolvers are installed");
    for(let resolver of resolvers.resolvers) {
        logger.log("    " + resolver.name);
    }

    app.get("/", (req, res)=> {
        getRunDetails().then(details => {
            fsHelpers.readFileContent(details.indexHtmlLocation).then(content => {
                const detailsJSON = JSON.stringify(details);
                const $ = cheerio.load(content);
                // $("body").append(`<script src="${details.systemJSLocation}"></script>`);
                // $("body").append("\n");
                // if(details.systemJSConfigLocation) {
                //     $("body").append(`<script src="${details.systemJSConfigLocation}"></script>`);
                //     $("body").append("\n");
                // }
                // $("body").append(`<script src="node_modules/systemjs-server/client/systemjs.middleware.js"></script>`);
                // $("body").append("\n");
                $("body").append(`<script>var SystemJServerConfig = ${detailsJSON};</script>\n`);
                $("body").append(`<script src="node_modules/systemjs-server/client/systemjs.server.js"></script>\n`);
                res.write($.html());
                res.end();
            });
        });
    });

    app.get('/systemjs/locate', function(req, res) {
        const path = req.query.path;

        resolvers.resolve(path)
            .then(path => {
                res.json({
                    path: path,
                }).end();
            })
            .catch(function(err) {
                console.error(err);

                res.json({
                    err: err,
                }).end();
            });
    });

    interface RunDetails {
        systemJSLocation: string,
        systemJSConfigLocation: string,
        mainLocation: string,
        indexHtmlLocation: string,
    }

    function getRunDetails(): Promise<RunDetails> {
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
            return fsHelpers.findFirst([
                "main.js",
                "app/main.js"
            ]);
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
            return {
                systemJSLocation: values[0],
                systemJSConfigLocation: values[1],
                mainLocation: values[2],
                indexHtmlLocation: values[3],
            };
        });
    }

    app.get('/systemjs/init', function(req, res) {
        getRunDetails().then(details => {
            res.json(details);
        });
    });
}

export function config(c) {
    configurator.set(c);
}
