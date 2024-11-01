import { Socket } from 'socket.io';
import { TokenPayload } from './token.interface';

export interface AuthenticatedSocket extends Socket {
  data: {
    user: TokenPayload;
  };
}
