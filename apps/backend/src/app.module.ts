import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { FederationController } from './api/federation.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/federation.manifest.json'],
    }),
  ],
  controllers: [FederationController],
  providers: [],
})
export class AppModule {}
