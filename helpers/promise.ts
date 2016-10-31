//
//  Returns the first truthy resolved value
//
export function or(factories) {
    return new Promise(function (resolve, reject) {
        let index = 0;

        function next() {
            if (++index == factories.length) {
                resolve(false);
            }
            else {
                run();
            }
        }

        function run() {
            let promise = factories[index]();
            promise.then(function (val) {
                if(val) {
                    resolve(val);
                }
                else {
                    next();
                }
            }).catch(function (err) {
                reject(err);
            });
        }

        run();
    });
}
