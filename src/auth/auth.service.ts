import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/user/repository/user.repository';
import { RegistUserDto } from './dto/regist-user.dto';
import { UserModel } from 'src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import {
  TokenPayload,
  TokenResponse,
} from 'src/common/interfaces/token.interface';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  private createToken(
    user: Omit<UserModel, 'password'>,
    isRefresh?: boolean,
  ): TokenResponse {
    const payload: Omit<TokenPayload, 'iat'> = {
      sub: user._id.toString(),
      nickname: user.nickname,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });

    if (isRefresh) {
      return {
        access_token: accessToken,
      };
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async registUser(registUserDto: RegistUserDto): Promise<UserModel> {
    const existingUser = await this.userRepository.findUserbyAccount(
      registUserDto.account,
    );

    if (existingUser) {
      throw new BadRequestException('Already existing user account');
    }

    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(registUserDto.password, saltRound);

    const newUser = await this.userRepository.createUser({
      ...registUserDto,
      password: hashedPassword,
    });

    const tokens = this.createToken(newUser);

    await this.userRepository.updateUserRefreshToken(
      newUser._id.toString(),
      tokens.refresh_token,
    );

    return { ...newUser, ...tokens };
  }

  async validateUser(
    account: string,
    password: string,
  ): Promise<Omit<UserModel, 'password'> | null> {
    const user = await this.userRepository.findUserbyAccount(account);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(
    user: Omit<UserModel, 'password'>,
  ): Pick<UserModel, '_id' | 'nickname'> & TokenResponse {
    const tokens = this.createToken(user);

    this.userRepository.updateUserRefreshToken(
      user._id.toString(),
      tokens.refresh_token,
    );

    return {
      ...user,
      ...tokens,
    };
  }

  async accessTokenRefresh(
    refreshToken: string,
  ): Promise<Pick<TokenResponse, 'access_token'>> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const userId = payload.sub;
      const userData = await this.userRepository.findUserbyObjectId(userId);

      if (refreshToken !== userData.refresh_token) {
        this.userRepository.updateRefreshTokenForExpire(userId);
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.createToken(userData, true);

      return accessToken;
    } catch (error) {
      const payload = this.jwtService.decode(refreshToken);
      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }
      await this.userRepository.updateRefreshTokenForExpire(payload.userId);
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('refresh token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }

      throw new UnauthorizedException('Authentication faild try new login');
    }
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }

      if (e instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
