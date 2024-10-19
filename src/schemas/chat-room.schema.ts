import { Document, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNumber, Length } from 'class-validator';
import { ValidationMessages } from 'src/utils/validation.message';

export type ChatRoomDocument = ChatRoom & Document;

@Schema({ versionKey: false, timestamps: true })
export class ChatRoom {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  creator_id: Types.ObjectId;

  @Length(1, 20, { message: ValidationMessages.lengthMessage })
  @Prop({ required: true })
  room_name: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: ValidationMessages.numberMessage },
  )
  @Prop({ required: true })
  participants: number;

  @IsBoolean()
  @Prop({ required: true, default: false })
  isPublic: boolean;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
