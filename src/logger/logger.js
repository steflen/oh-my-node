const path = require('path')
const winston = require('winston')
require('winston-daily-rotate-file')

module.exports = ({ config, name }) => {
  const outFormat = winston.format.printf(
    info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
  )

  const prettyPint = winston.format.printf(info => {
    if (info.message) {
      if (info.message.constructor === Object) {
        info.message = JSON.stringify(info.message, null, 4)
      }
      return `${info.level}: ${info.message}}`
    }
    return info
  })

  const consoleTransport = new winston.transports.Console({
    level: config.log.severity,
    // stderr levels will be  available inside visual studio codes "debug console"
    stderrLevels: ['error', 'debug', 'info'],
    silent: process.env.NODE_ENV === 'test', // silent if unit testing
  })

  const fileTransport = new winston.transports.DailyRotateFile({
    filename: `${name}-%DATE%.log`,
    dirname: path.join(process.cwd(), `${config.log.directory}`),
    datePattern: config.log.datePattern, //'YYYY-MM-DD', // -HH', // the last determines the rotation time
    zippedArchive: config.log.zip,
    stream: null,
    maxSize: config.log.maxSize,
    maxFiles: null, // '14d',
    // json: true,
    level: config.log.severity,
    silent: process.env.NODE_ENV === 'test', // silent if unit testing
  })

  winston.loggers.add(name, {
    emitErrs: false,
    format: winston.format.combine(
      winston.format.label({
        label: name,
      }),
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.simple(),
      // winston.format.json(),
      prettyPint,
      outFormat
    ),
    transports: [consoleTransport, fileTransport],
  })

  return winston.loggers.get(name)
}
