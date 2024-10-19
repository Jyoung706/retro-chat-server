import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/schemas/user.schema';
import { UserRepository } from 'src/user/repository/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  exports: [UserRepository],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
