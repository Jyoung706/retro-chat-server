import { Document, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, Length } from 'class-validator';
import { ValidationMessages } from 'src/utils/validation.message';

export type UserDocument = UserModel & Document;

@Schema({ collection: 'Users', versionKey: false, timestamps: true })
export class UserModel {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @IsString({ message: ValidationMessages.stringMessage })
  @Length(2, 10, { message: ValidationMessages.lengthMessage })
  @Prop({ required: true, unique: true })
  account: string;

  @IsString({ message: ValidationMessages.stringMessage })
  @Length(2, 10, { message: ValidationMessages.lengthMessage })
  @Prop({ required: true })
  nickname: string;

  @IsString({ message: ValidationMessages.stringMessage })
  @Prop({ required: true })
  password: string;

  @IsString({ message: ValidationMessages.stringMessage })
  @Prop()
  refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
