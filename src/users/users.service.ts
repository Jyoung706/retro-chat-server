import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

  async findUserByAccount(account: string): Promise<User> {
    return this.usersRepository.findUserbyAccount(account);
  }

  // async createAccount(createUserDto: CreateUserDto): Promise<User> {
  //   const saltRounds = 10;
  //   const hashedPassword = await bcryptjs.hash(
  //     createUserDto.password,
  //     saltRounds,
  //   );
  //   return this.usersRepository.create({
  //     ...createUserDto,
  //     password: hashedPassword,
  //   });
  // }
}
