import {
  WebSocketGateway,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { TokenPayload } from 'src/common/interfaces/token.interface';
import { AuthService } from 'src/auth/auth.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Inject, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { SocketExceptionFilter } from 'src/common/exception-filter/socket-exception.filter';
import { validationOption } from 'src/common/options/validation-pipe.option';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EnterRoomDto } from './dto/enter-room.dto';
import { AuthenticatedSocket } from 'src/common/interfaces/socket.interface';

@UsePipes(new ValidationPipe(validationOption))
@UseFilters(SocketExceptionFilter)
@WebSocketGateway({
  namespace: 'chats',
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const headers = socket.handshake.headers;

    const rawToken = headers['authorization'];

    if (!rawToken) {
      throw new WsException('There is no token');
    }

    try {
      const accessToken = rawToken.split(' ')[1];
      const payload = await this.authService.verifyToken(accessToken);

      socket.data.user = payload;
      await this.cacheManager.set(payload.sub, socket.id);
    } catch (e) {
      socket.disconnect();
      throw new WsException('Invalid Token');
    }
  }

  async handleDisconnect(socket: AuthenticatedSocket) {
    if (socket.data.user) {
      const userId = socket.data.user.sub;
      await this.cacheManager.del(userId);

      const room = await this.chatService.findUserRooms(userId);
      await this.chatService.leaveRoom(userId, room._id.toString());
    }
  }

  async getSocketId(userId: string): Promise<string> {
    return await this.cacheManager.get(userId);
  }

  async handleRoomJoin(user: TokenPayload, roomId: string) {
    const socketId = await this.getSocketId(user.sub);
    this.server.in(socketId).socketsJoin(roomId);
    const systemMessage = {
      roomId,
      senderId: 'System',
      message: `${user.nickname} 님이 채팅방에 참가했습니다.`,
      isSystem: true,
    };
    this.server.to(roomId).emit('send_message', systemMessage);
    return {
      success: true,
      message: 'room created',
    };
  }

  @SubscribeMessage('enter_room')
  async enterRoom(
    @MessageBody() enterRoomDto: EnterRoomDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const room = await this.chatService.enterRoom(
      socket.data.user.sub,
      enterRoomDto,
    );
    socket.join(room._id.toString());
    const systemMessage = {
      roomId: enterRoomDto._id.toString(),
      senderId: 'System',
      message: `${socket.data.user.nickname}님이 채팅방에 참가했습니다.`,
      isSystem: true,
    };
    this.server.to(room._id.toString()).emit('send_message', systemMessage);
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    // await this.chatService.createMessage(
    //   createMessageDto,
    //   createMessageDto.sender_id,
    // );

    socket
      .to(createMessageDto.room_id.toString())
      .emit('send_message', createMessageDto.message);

    return {
      success: true,
      data: createMessageDto,
    };
  }
}
