import { Document, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNumber, MaxLength, MinLength } from 'class-validator';

export type ChatRoomDocument = ChatRoom & Document;

@Schema({ versionKey: false, timestamps: true })
export class ChatRoom {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  creator_id: Types.ObjectId;

  @MaxLength(20)
  @MinLength(1)
  @Prop({ required: true })
  room_name: string;

  @IsNumber()
  @Prop({ required: true })
  participants: number;

  @IsBoolean()
  @Prop({ required: true, default: false })
  isPublic: boolean;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
