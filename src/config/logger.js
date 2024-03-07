import winston from 'winston'
import dotenv from 'dotenv'
import __dirname from '../utils.js'
import path from 'path'
dotenv.config()

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'red',
    error: 'orange',
    warn: 'yellow',
    info: 'blue',
    http: 'green',
    debug: 'white',
  },
}

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [new winston.transports.Console({ level: 'debug' })],
})

const prodLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({
      filename: path.join(__dirname, '/logs/errores.log'),
      level: 'info',
    }),
  ],
})

const currentEnv = process.env.NODE_ENV || 'development'

export const addLogger = (req, res, next) => {
  req.logger = currentEnv === 'production' ? prodLogger : devLogger

  if (req.logger === prodLogger) {
    req.logger.info(`${req.url} - method: ${req.method}`)
  } else {
    req.logger.debug(`${req.url} - method: ${req.method}`)
  }
  
  next()
}