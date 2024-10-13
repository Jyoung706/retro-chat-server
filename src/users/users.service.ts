import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from 'src/schemas/user.schema';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

  async findUserAccount(account: string): Promise<boolean> {
    return this.usersRepository.findUserbyAccount(account);
  }

  async createAccount(
    account: string,
    nickname: string,
    password: string,
  ): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    return this.usersRepository.create({
      account,
      nickname,
      password: hashedPassword,
    });
  }
}
