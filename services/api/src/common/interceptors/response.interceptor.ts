import { RESPONSE_MESSAGE_KEY } from '@decorators/response-message.decorator';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    const message = this.reflector.get<string>(
      RESPONSE_MESSAGE_KEY,
      context.getHandler() || 'Success',
    );
    return next.handle().pipe(map((data) => ({ statusCode, message, data })));
  }
}
