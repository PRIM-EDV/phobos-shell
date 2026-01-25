import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLogger } from './infrastructure/logger/winston/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = await app.resolve(WinstonLogger);

  app.useLogger(logger);
  
  await app.listen(3001);
}
bootstrap();
