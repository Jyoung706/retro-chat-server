import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUserbyAccount(account: string): Promise<User> {
    const user = await this.userModel.findOne({ account }).lean();
    return user;
  }

  async createUser(user: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(user);
    return (await createdUser.save()).toObject();
  }

  async updateUserRefreshToken(id: string, token: string): Promise<User> {
    return await this.userModel.findByIdAndUpdate(
      id,
      { refresh_token: token },
      { new: true, lean: true },
    );
  }
}
