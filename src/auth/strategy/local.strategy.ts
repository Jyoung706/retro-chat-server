import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'account' });
  }

  async validate(account: string, password: string) {
    const user = await this.authService.validateUser(account, password);

    if (!user) {
      throw new UnauthorizedException('User Unauthorized');
    }

    return user;
  }
}
