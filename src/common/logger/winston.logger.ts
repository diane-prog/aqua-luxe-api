import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const createWinstonLogger = () =>
  WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, context }) => {
            return `[${timestamp}] ${level}: ${context ? `[${context}] ` : ''}${message}`;
          }),
        ),
      }),
    ],
  });
