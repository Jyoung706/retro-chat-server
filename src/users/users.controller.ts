import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  async signup(
    @Body('account') account: string,
    @Body('nickname') nickname: string,
    @Body('password') password: string,
  ) {
    const existingUser = await this.userService.findUserAccount(account);

    if (existingUser) {
      throw new BadRequestException('Already exist account');
    }

    const user = await this.userService.createAccount(
      account,
      nickname,
      password,
    );
    return { message: 'User created.', userId: user._id };
  }
}
