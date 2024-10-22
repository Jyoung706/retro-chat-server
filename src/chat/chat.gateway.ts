import {
  WebSocketGateway,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chats',
})
export class ChatGateway implements OnGatewayConnection {
  constructor(private readonly chatService: ChatService) {}
  handleConnection(socket: Socket) {
    console.log(`on connect called : ${socket.id}`);
  }

  @SubscribeMessage('send_message')
  sendMessage(@MessageBody() data: string) {
    console.log(data);
  }
}
