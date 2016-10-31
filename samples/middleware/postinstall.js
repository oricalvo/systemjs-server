const shelljs = require("shelljs");
const open = require("open");

run("typings install");
run("tsc");
open("http://localhost:3000/index.html");
run("node ./server/app");

function run(command) {
    console.log("Executing \"" + command + "\"");

    const code = shelljs.exec(command).code;
    if(code) {
        console.log("Command \"" + command + "\" failed with exit code: " + code);
    }
}
