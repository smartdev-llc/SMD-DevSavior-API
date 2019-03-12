
var path = require("path");
var winston = require("winston");
require("winston-daily-rotate-file");
const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] : ${message}`;
});
var customLogger = winston.createLogger({
  level: "debug",
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.DailyRotateFile({
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.timestamp(),
        myFormat
      ),
      filename: path.resolve(process.env.JUNIORVIEC_LOG_DIR || "./", "juniorviec-%DATE%.log"),
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    })
  ]
});
if(process.env.ENV !== "production"){
  customLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
module.exports.log = {
  custom: customLogger,
  level: "debug",
  inspect: true
};
