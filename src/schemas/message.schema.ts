import { Document, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsString } from 'class-validator';
import { ValidationMessages } from 'src/utils/validation.message';
import { Optional } from '@nestjs/common';

export type MessageDocument = MessageModel & Document;

@Schema({ collection: 'Messages', versionKey: false, timestamps: true })
export class MessageModel {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @IsString()
  @Prop({ required: true, ref: 'ChatRooms' })
  room_id: Types.ObjectId;

  @IsString()
  @Prop({
    type: SchemaTypes.Mixed,
    ref: 'User',
    required: true,
  })
  @Optional()
  sender_id: Types.ObjectId | 'System';

  @IsString({ message: ValidationMessages.lengthMessage })
  @Prop({ required: true })
  message: string;

  @IsBoolean({ message: ValidationMessages.booleanMessage })
  @Prop({ required: true, default: false })
  isSystem: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(MessageModel);
