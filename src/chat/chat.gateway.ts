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

@WebSocketGateway({
  namespace: 'chats',
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
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
    } catch (e) {
      socket.disconnect();
      throw new WsException('Invalid Token');
    }
  }

  @SubscribeMessage('send_message')
  sendMessage(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket & { user: TokenPayload },
  ) {
    console.log(data);
  }
}
