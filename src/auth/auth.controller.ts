import {
  Body,
  Controller,
  Headers,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistUserDto } from './dto/regist-user.dto';
import { UserModel } from 'src/schemas/user.schema';
import { LocalAuthGuard } from './guard/local.guard';
import { User as UserDecorator } from '../common/decorators/user.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('regist')
  async registUser(
    @Body() registUserDto: RegistUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Partial<UserModel>> {
    const newUser = await this.authService.registUser(registUserDto);

    const { password, account, refresh_token, ...user } = newUser;

    response.cookie('rt', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

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
