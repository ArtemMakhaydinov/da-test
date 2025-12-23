import { createLogger, format, Logform, transports } from 'winston';
import path from 'path';
import fs from 'fs';

const colorize = format.colorize({
  all: true,
  colors: {
    info: 'bold blue',
    warn: 'italic yellow',
    error: 'bold red',
    debug: 'green',
  },
});

const defaultFormat = format.combine(
    format.timestamp({
      format: 'YY-MM-DD HH:mm:ss.SSS',
    }),
    format.printf((info: Logform.TransformableInfo) => {
      const { level, timestamp, message, ...rest } = info;
      const formattedRest = rest ? ` ${JSON.stringify(rest)}` : '';
      return `[${timestamp}  [${level}]:  ${message}  ${formattedRest}`;
    }),
  );

const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(colorize, defaultFormat),
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs/info.log'),
      maxsize: 10485760,
      level: 'info',
      format: format.combine(defaultFormat),
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      maxsize: 10485760,
      level: 'error',
      format: format.combine(defaultFormat),
    }),
  ],
});

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export default logger;

