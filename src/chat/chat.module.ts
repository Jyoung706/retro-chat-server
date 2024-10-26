import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomModel, ChatRoomSchema } from 'src/schemas/chat-room.schema';
import { MessageModel, MessageSchema } from 'src/schemas/message.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoomModel.name, schema: ChatRoomSchema },
      { name: MessageModel.name, schema: MessageSchema },
    ]),
    AuthModule,
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
