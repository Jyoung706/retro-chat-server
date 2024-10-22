import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { TokenPayload } from 'src/common/interfaces/token.interface';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async createChatRoom(
    @User() user: TokenPayload,
    @Body() chatRoomData: CreateChatDto,
  ) {
    return await this.chatService.createChatRoom(user.sub, chatRoomData);
  }
}
