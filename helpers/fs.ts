const fs = require('fs');

export function fileExists(filePath) {
    return new Promise(function (resolve, reject) {
        fs.stat(filePath, function (err, stats) {
            if (err) {
                if (err.code == "ENOENT") {
                    resolve(false);
                }
                else {
                    reject(err);
                }
            }
            else {
                resolve(stats.isFile());
            }
        });
    });
}

export function dirExists(filePath) {
    return new Promise(function (resolve, reject) {
        fs.stat(filePath, function (err, stats) {
            if (err) {
                if (err.code == "ENOENT") {
                    resolve(false);
                }
                else {
                    reject(err);
                }
            }
            else {
                resolve(stats.isDirectory());
            }
        });
    });
}

export function getFile(file) {
    return fileExists(file).then(exists => {
        if(!exists) {
            throw new Error("File: " + file + " was not found");
        }

        return file;
    });
}

export function findFirst(files) {
    return new Promise(function(resolve, reject) {
        let index = -1;

        function next() {
            if (++index == files.length) {
                resolve(null);
            }

            const file = files[index];
            fileExists(file).then(exists=> {
                if(exists) {
                    resolve(file);
                }
                else {
                    next();
                }
            }).catch(err => {
                reject(err);
            });
        }

        next();
    });
}

export function readJson(filePath): Promise<any> {
    return new Promise(function(resolve, reject) {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if(err) {
                reject(err);
                return;
            }

            resolve(JSON.parse(data));
        });
    });
}

export function readFileContent(filePath): Promise<string> {
    return new Promise(function(resolve, reject) {
        fs.readFile(filePath, 'utf8', function (err, content) {
            if(err) {
                reject(err);
                return;
            }

            resolve(content);
        });
    });
}
