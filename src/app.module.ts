import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOption } from './utils/logger.config';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
@Module({
  imports: [
    WinstonModule.forRoot(winstonLoggerOption),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
