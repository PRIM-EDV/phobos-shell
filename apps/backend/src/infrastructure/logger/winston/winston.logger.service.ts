import { Injectable } from "@nestjs/common";

import { winstonConfig } from "./config/winston.config";

import * as Winston from 'winston';

@Injectable()
export class WinstonLoggerService {
    private logger: Winston.Logger = Winston.createLogger(winstonConfig);

    public info(message: string, context: string) {
        this.logger.info(message,  { context: context });
    }

    public error(message: string, context: string) {
        this.logger.error(message, { context: context });
    }

    public debug(message: string, context: string) {
        this.logger.debug(message, { context: context });
    }

    public warn(message: string, context: string) {
        this.logger.warn(message, { context: context });
    }
}