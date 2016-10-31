const debug = require("debug");
const log = debug("sjs:log");
const error = debug("sjs:error");

export const logger = {
    log: log,
    error: error,
};
