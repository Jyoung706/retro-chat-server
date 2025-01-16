import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guard/jwt.guard';
import { User } from './common/decorators/user.decorator';
import { UserModel } from './schemas/user.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  healthCheck() {
    return { status: 'OK', message: 'Service is healthy' };
  }
}
