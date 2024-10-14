import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findUserAccount(
      createUserDto.account,
    );

    if (existingUser) {
      throw new BadRequestException('Already exist account');
    }

    const user = await this.userService.createAccount(createUserDto);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return { message: 'User created.', user: userWithoutPassword };
  }
}
