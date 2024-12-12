import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ResponseFormat } from '../interfaces/response.interface';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterCeptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: null,
        error: null,
      })),
    );
  }
}
