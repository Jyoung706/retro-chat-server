import { Document, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, Length } from 'class-validator';

export type UserDocument = UserModel & Document;

@Schema({ versionKey: false, timestamps: true })
export class UserModel {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @IsString({ message: 'account must be a string' })
  @Length(2, 10, { message: 'account must be between 2 and 10 characters' })
  @Prop({ required: true, unique: true })
  account: string;

  @IsString({ message: 'nickname must be a string' })
  @Length(2, 10, { message: 'nickname must be between 2 and 10 characters' })
  @Prop({ required: true })
  nickname: string;

  @IsString({ message: 'password must be a string' })
  @Prop({ required: true })
  password: string;

  @IsString({ message: 'refresh token must be a string' })
  @Prop()
  refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
