import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from 'src/schemas/user.schema';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

  async findUserAccount(account: string): Promise<boolean> {
    return this.usersRepository.findUserbyAccount(account);
  }

  async createAccount(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(
      createUserDto.password,
      saltRounds,
    );
    return this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}
