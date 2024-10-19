import { PickType } from '@nestjs/mapped-types';
import { UserModel } from 'src/schemas/user.schema';

export class RegistUserDto extends PickType(UserModel, [
  'account',
  'nickname',
  'password',
]) {}
