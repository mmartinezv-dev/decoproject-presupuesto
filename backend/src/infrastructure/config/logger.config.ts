import * as winston from 'winston';
import { WinstonModule, utilities as nestWinstonUtils } from 'nest-winston';

const isProduction = process.env.NODE_ENV === 'production';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: isProduction
      ? winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        )
      : winston.format.combine(
          winston.format.timestamp(),
          nestWinstonUtils.format.nestLike('DecoProject', {
            prettyPrint: true,
            colors: true,
          }),
        ),
  }),
];

if (isProduction) {
  transports.push(
    new winston.transports.File({
      filename: '/var/log/decoproject/error.log',
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: '/var/log/decoproject/combined.log',
      maxsize: 20 * 1024 * 1024, // 20 MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  );
}

export function createWinstonLogger() {
  return WinstonModule.createLogger({
    level: isProduction ? 'info' : 'debug',
    transports,
  });
}
