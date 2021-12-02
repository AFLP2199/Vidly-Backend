const logger = require("./startup/logger");
const express = require("express");
const config = require("config");
const cors = require("cors");
const app = express();

require("express-async-errors");
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

process.on("uncaughtException", (ex) => {
    logger.error(ex.message);
    process.exit(1);
});

process.on("unhandledException", (ex) => {
    logger.error(ex.message);
    process.exit(1);
});

// PORT
const port = process.env.PORT || config.get("port");
const stringToLog = `Server up and running on PORT : ${port}`;
const server = app.listen(port, () => {
    console.log(stringToLog), logger.info(stringToLog);
});

module.exports = server;
