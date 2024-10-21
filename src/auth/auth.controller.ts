import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistUserDto } from './dto/regist-user.dto';
import { UserModel } from 'src/schemas/user.schema';
import { LocalAuthGuard } from './guard/local.guard';
import { User as UserDecorator } from '../common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('regist')
  async registUser(
    @Body() registUserDto: RegistUserDto,
  ): Promise<Partial<UserModel>> {
    const newUser = await this.authService.registUser(registUserDto);

    const { password, account, ...user } = newUser;
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@UserDecorator() user: Omit<UserModel, 'password'>) {
    return this.authService.login(user);
  }

  @Post('refresh')
  accessTokenRefresh(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const refreshToken = authHeader.split(' ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const accessToken = this.authService.accessTokenRefresh(refreshToken);

    return accessToken;
  }
}
