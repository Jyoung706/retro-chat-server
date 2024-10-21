import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserModel } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUserByAccount(account: string): Promise<UserModel> {
    return this.userRepository.findUserbyAccount(account);
  }

  async findUserbyObjectId(id: string): Promise<UserModel> {
    return this.userRepository.findUserbyObjectId(id);
  }
}
