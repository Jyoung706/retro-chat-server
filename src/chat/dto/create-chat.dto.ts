import { PickType } from '@nestjs/mapped-types';
import { ChatRoomModel } from 'src/schemas/chat-room.schema';

export class CreateChatDto extends PickType(ChatRoomModel, [
  'isPublic',
  'password',
  'room_name',
]) {}
