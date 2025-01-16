import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

const isProduction = process.env['NODE_ENV'] === 'production';

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
  ],
};
