const path = require("path");
const express = require("express");
const systemjsMiddleware = require("systemjs-middleware");

const basePath = path.join(__dirname, "..");
const app = express();

systemjsMiddleware.config({
    basePath: basePath
});
systemjsMiddleware.setup(app);

app.use(express.static(basePath));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
