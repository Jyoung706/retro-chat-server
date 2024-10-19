import { PickType } from '@nestjs/mapped-types';
import { User } from 'src/schemas/user.schema';

export class RegistUserDto extends PickType(User, [
  'account',
  'nickname',
  'password',
]) {}
