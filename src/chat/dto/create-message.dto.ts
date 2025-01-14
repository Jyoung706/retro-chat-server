import { MessageModel } from 'src/schemas/message.schema';
import { PickType } from '@nestjs/mapped-types';

export class CreateMessageDto extends PickType(MessageModel, [
  'room_id',
  'message',
  'isSystem',
]) {}
