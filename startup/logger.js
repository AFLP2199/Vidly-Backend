const { createLogger, transports, format } = require("winston");
require("winston-mongodb");

const logger = createLogger({
    transports: [
        new transports.File({
            level: "info",
            filename: "logfile.log",
            format: format.combine(format.timestamp(), format.simple()),
        }),
        new transports.MongoDB({
            level: "error", //only save to database on error
            db: "mongodb://localhost/vidly",
            options: { useUnifiedTopology: true },
            format: format.combine(format.timestamp(), format.simple()),
        }),
    ],
});

module.exports = logger;
