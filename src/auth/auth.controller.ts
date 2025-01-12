import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistUserDto } from './dto/regist-user.dto';
import { UserModel } from 'src/schemas/user.schema';
import { LocalAuthGuard } from './guard/local.guard';
import { User as UserDecorator } from '../common/decorators/user.decorator';
import { Request, Response } from 'express';
import { cookieOption } from 'src/utils/cookie-option';

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

    response.cookie('rt', refresh_token, cookieOption);

    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @UserDecorator() user: Omit<UserModel, 'password'>,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData = this.authService.login(user);

    response.cookie('rt', userData.refresh_token, cookieOption);

    return userData;
  }

  @Post('refresh')
  accessTokenRefresh(@Req() request: Request) {
    const refreshToken = request.cookies['rt'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const accessToken = this.authService.accessTokenRefresh(refreshToken);

    return accessToken;
  }
}
