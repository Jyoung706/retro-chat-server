import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
  ) {}

  async findUserbyAccount(account: string): Promise<UserModel> {
    const user = await this.userModel.findOne({ account }).lean();
    return user;
  }

  async findUserbyObjectId(id: string): Promise<UserModel> {
    const user = await this.userModel.findById(id).lean();
    return user;
  }

  async createUser(user: Partial<UserModel>): Promise<UserModel> {
    const createdUser = new this.userModel(user);
    return (await createdUser.save()).toObject();
  }

  async updateUserRefreshToken(id: string, token: string): Promise<UserModel> {
    return await this.userModel.findByIdAndUpdate(
      id,
      { refresh_token: token },
      { new: true, lean: true },
    );
  }

  async updateRefreshTokenForExpire(id: string) {
    await this.userModel.findByIdAndUpdate(id, { refresh_token: '' });
  }
}
