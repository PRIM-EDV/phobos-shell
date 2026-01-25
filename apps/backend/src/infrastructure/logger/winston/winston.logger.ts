import { Injectable, LoggerService, LogLevel, Scope } from '@nestjs/common';


import { WinstonLoggerService } from './winston.logger.service';


@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger implements LoggerService {
    private context: string = '';
    private levels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'];

    constructor(private logger: WinstonLoggerService) {}

    public log(message: any, ...optionalParams: any[]) {
        const context = optionalParams[0] || this.context;
        if (this.levels.includes('log')) this.logger.info(message, context);
    }

    public warn(message: any, ...optionalParams: any[]) {
        const context = optionalParams[0] || this.context;
        if (this.levels.includes('warn')) this.logger.warn(message, context);
    }

    public error(message: any, ...optionalParams: any[]) {
        const context = optionalParams[0] || this.context;
        if (this.levels.includes('error')) this.logger.error(message, context);
    }

    public verbose?(message: any, ...optionalParams: any[]) {
        throw new Error('Method not implemented.');
    }

    public fatal?(message: any, ...optionalParams: any[]) {
        throw new Error('Method not implemented.');
    }

    public debug(msg: string, ...optionalParams: any[]) {
        const context = optionalParams[0] || this.context;
        if (this.levels.includes('debug')) this.logger.debug(msg, context);
    }

    setContext?(context: string) {
        this.context = context;
    }

    setLogLevels?(levels: LogLevel[]) {
        this.levels = levels;
    }
}