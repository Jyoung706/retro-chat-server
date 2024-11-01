import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { TokenPayload } from 'src/common/interfaces/token.interface';
import { CreateChatDto } from './dto/create-room.dto';
import { EnterRoomDto } from './dto/enter-room.dto';
import { ChatGateway } from './chat.gateway';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post('new')
  async createChatRoom(
    @User() user: TokenPayload,
    @Body() chatRoomData: CreateChatDto,
  ) {
    const room = await this.chatService.createChatRoom(user.sub, chatRoomData);
    await this.chatGateway.handleRoomJoin(user, room._id.toString());
    return room;
  }

  @Get('room/list')
  async chatRoomList(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.chatService.getChatRoomList(page, limit);
  }
}
