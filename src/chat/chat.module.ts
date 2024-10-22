import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomModel, ChatRoomSchema } from 'src/schemas/chat-room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoomModel.name, schema: ChatRoomSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
