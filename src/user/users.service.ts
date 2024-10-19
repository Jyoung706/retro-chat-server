import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserModel } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

  async findUserByAccount(account: string): Promise<UserModel> {
    return this.usersRepository.findUserbyAccount(account);
  }
}
