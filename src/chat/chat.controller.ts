import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { TokenPayload } from 'src/common/interfaces/token.interface';
import { CreateChatDto } from './dto/create-room.dto';
import { EnterRoomDto } from './dto/enter-room.dto';
import { ChatGateway } from './chat.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('new')
  async createChatRoom(
    @User() user: TokenPayload,
    @Body() chatRoomData: CreateChatDto,
  ) {
    const room = await this.chatService.createChatRoom(user.sub, chatRoomData);
    this.eventEmitter.emit('room_created', room);
    return room;
  }

  @Get('room/list')
  async chatRoomList(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.chatService.getChatRoomList(page, limit);
  }

  @Get('room/detail/:roomId')
  async roomDetail(@Param('roomId') roomId: string) {
    return await this.chatService.roomDetail(roomId);
  }

  @Post('room/enter')
  async enterRoom(
    @User() user: TokenPayload,
    @Body() enterRoomDto: EnterRoomDto,
  ) {
    const enterRoom = await this.chatService.enterRoom(user.sub, enterRoomDto);
    return enterRoom;
  }
}
