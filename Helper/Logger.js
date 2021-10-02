const path = require("path")
const { createLogger, format, transports  } = require('winston');
const { combine, ms, prettyPrint, timestamp } = format;
const moment = require('moment');
const tsFormat = () => moment().format('ddd YYYY-MM-DD HH:mm:ss').trim();

const logger = createLogger({
      transports: [
            new transports.Console(),
            new transports.File({ filename: path.join(__dirname, "/Logs/combined.log")})
      ],
      format: combine(
            timestamp({format: tsFormat}),
            ms(),
            prettyPrint(),
            
      )
});
module.exports = logger;