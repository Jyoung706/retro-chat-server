import { Document, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { ValidationMessages } from 'src/utils/validation.message';

export type ChatRoomDocument = ChatRoomModel & Document;

@Schema({ collection: 'Chat_rooms', versionKey: false, timestamps: true })
export class ChatRoomModel {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  creator_id: Types.ObjectId;

  @Length(1, 20, { message: ValidationMessages.lengthMessage })
  @Prop({ required: true })
  room_name: string;

  @Prop([
    {
      _id: false,
      user: { type: SchemaTypes.ObjectId, ref: 'User' },
      joinedAt: { type: Date, default: Date.now },
    },
  ])
  participants: { user: Types.ObjectId; joinedAt: Date }[];

  @IsBoolean()
  @Prop({ required: true, default: false })
  isPublic: boolean;

  @IsOptional()
  @ValidateIf((o) => o.isPublic === true)
  @IsString({ message: ValidationMessages.stringMessage })
  @Prop()
  password?: string;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoomModel);

ChatRoomSchema.pre('validate', function (next) {
  if (this.isPublic && !this.password) {
    this.invalidate('password', 'Password is required for public rooms');
  }
  next();
});
