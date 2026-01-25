import { Module } from '@nestjs/common';
import { WinstonLogger } from './winston.logger';
import { WinstonLoggerService } from './winston.logger.service';

@Module({
    exports: [
        WinstonLogger
    ],
    providers: [
        WinstonLogger,
        WinstonLoggerService
    ]
})
export class WinstonLoggerModule {}
