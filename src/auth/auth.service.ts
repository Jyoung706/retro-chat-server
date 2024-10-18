import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/repository/user.repository';
import { RegistUserDto } from './dto/regist-user.dto';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import {
  TokenPayload,
  TokenResponse,
} from 'src/common/interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  createToken(user: Partial<User>, isRefresh?: boolean) {
    const payload: Omit<TokenPayload, 'iat'> = {
      sub: user._id.toString(),
      nickname: user.nickname,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
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

  async registUser(registUserDto: RegistUserDto): Promise<User> {
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

    return newUser;
  }

  async validateUser(
    account: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findUserbyAccount(account);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: Omit<User, 'password'>): TokenResponse {
    const payload = { nickname: user.nickname, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
