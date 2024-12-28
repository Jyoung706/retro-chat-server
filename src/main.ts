import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { validationOption } from './common/options/validation-pipe.option';
import { ResponseInterCeptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/exception-filter/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe(validationOption));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalInterceptors(new ResponseInterCeptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();
