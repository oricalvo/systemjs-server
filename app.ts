const path = require("path");
const express = require("express");
const systemjsMiddleware = require("systemjs-middleware");

const basePath = process.cwd();
const port = 3000;

console.log("systemjs-server");
console.log("    basePath: " + basePath);
console.log("    port: " + port);
return;

const app = express();

systemjsMiddleware.config({
    basePath: basePath
});
systemjsMiddleware.setup(app);

app.use(express.static(basePath));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
