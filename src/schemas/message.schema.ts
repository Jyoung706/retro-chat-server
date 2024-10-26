import { Document, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { ValidationMessages } from 'src/utils/validation.message';

export type MessageDocument = MessageModel & Document;

@Schema({ collection: 'Messages', versionKey: false, timestamps: true })
export class MessageModel {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, ref: 'ChatRooms' })
  room_id: Types.ObjectId;

  @Prop({ required: true })
  sender_id: Types.ObjectId;

  @IsString({ message: ValidationMessages.lengthMessage })
  @Prop({ required: true })
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(MessageModel);
