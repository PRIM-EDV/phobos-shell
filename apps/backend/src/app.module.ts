import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { FederationController } from './api/federation.controller';
import { WinstonLoggerModule } from './infrastructure/logger/winston/winston.logger.module';
import { DiscoveryService } from './infrastructure/discovery/discovery.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/federation.manifest.json'],
    }),
    WinstonLoggerModule
  ],
  controllers: [FederationController],
  providers: [DiscoveryService],
})
export class AppModule {}
