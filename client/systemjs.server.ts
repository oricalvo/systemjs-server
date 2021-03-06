(function() {
    "use strict";

    const head = document.querySelector("head");
    if(!head) {
        throw new Error("head element was not found");
    }

    function loadScript(src): Promise<any> {
        if(!src) {
            return Promise.resolve();
        }

        return new Promise(function(resolve, reject) {
            const script = document.createElement("script");
            script.src = src;

            script.onload = function () {
                resolve();
            }

            script.onerror = function (err) {
                reject(err);
            }

            head.appendChild(script);
        });
    }

    function sequence(factories) {
        return new Promise(function(resolve, reject) {
            let index = -1;

            function next(prevValue?) {
                if (++index == factories.length) {
                    resolve();
                    return;
                }

                const promise = factories[index](prevValue);
                if(promise && promise.then) {
                    promise.then(function (value) {
                        next(value);
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    next(promise);
                }
            }

            next();
        });

    }

    function loadMiddlewareConfig() {
        return fetch("systemjs/init")
            .then(res => res.json());
    }

    function loadSystemJSConfig(location) {
        return Promise.resolve().then(function() {
            if(location) {
                return loadScript(location);
            }
        });
    }

    function importMain(main) {
        if(!main) {
            console.log();
            console.log("systemjs-server failed to detect main file to import. The following locations were considered:");
            console.log("    ~/main.ts");
            console.log("    ~/app/main.ts");
            return;
        }

        return SystemJS.import(main);
    }

    function init() {
        let config = window["SystemJServerConfig"];
        if(!config) {
            console.error("systemjs-server configuration was not found");
            return;
        }

        if(!config.systemJSLocation) {
            console.error("system.src.js was not found");
            return;
        }

        return sequence([
            //() => loadMiddlewareConfig(),
            //(_config) => config = _config,
            () => loadScript(config.systemJSLocation),
            () => loadSystemJSConfig(config.systemJSConfigLocation),
            () => loadScript("node_modules/systemjs-server/client/systemjs.middleware.js"),
            () => importMain(config.mainLocation),
        ]);
    }

    init();
})();

declare function fetch(url: string): Promise<any>;