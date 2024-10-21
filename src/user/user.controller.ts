import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/common/decorators/user.decorator';
import { TokenPayload } from 'src/common/interfaces/token.interface';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/id')
  @UseGuards(JwtAuthGuard)
  async getUserbyId(@User() user: TokenPayload) {
    return await this.userService.findUserbyObjectId(user.sub);
  }
}
