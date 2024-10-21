import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();
