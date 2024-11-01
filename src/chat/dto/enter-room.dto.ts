import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { Types } from 'mongoose';
import { ChatRoomModel } from 'src/schemas/chat-room.schema';

export class EnterRoomDto extends PickType(ChatRoomModel, ['_id', 'password']) {
  @IsString()
  @Expose({ name: 'roomId' })
  _id: Types.ObjectId;

  @ValidateIf((o) => o.isPublic === false)
  @IsString()
  @IsOptional()
  password?: string;
}
