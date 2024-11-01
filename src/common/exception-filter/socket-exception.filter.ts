import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch(HttpException)
export class SocketExceptionFilter extends BaseWsExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const socket = host.switchToWs().getClient();

    socket.emit('exception', exception.getResponse());
  }
}
