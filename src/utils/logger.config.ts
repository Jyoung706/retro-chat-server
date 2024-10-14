import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';
import * as path from 'path';

const isProduction = process.env['NODE_ENV'] === 'production';
const logDir = '/var/log/retro-chat-log/';

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(logDir, level),
    filename: `%DATE%.${level}.log`,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };
};

export const winstonLoggerOption: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      level: isProduction ? 'info' : 'debug',
      format: isProduction
        ? winston.format.simple()
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('RetroChat', {
              colors: true,
              prettyPrint: true,
            }),
          ),
    }),
    new DailyRotateFile(dailyOptions('info')),
    new DailyRotateFile(dailyOptions('warn')),
    new DailyRotateFile(dailyOptions('error')),
  ],
};
