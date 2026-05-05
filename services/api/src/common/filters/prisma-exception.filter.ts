import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Request, Response } from 'express';

const errorMap: Record<
  string,
  { status: number; message: string } | undefined
> = {
  P2000: { status: HttpStatus.BAD_REQUEST, message: 'Invalid data provided' },
  P2002: { status: HttpStatus.CONFLICT, message: 'Resource already exists' },
  P2025: { status: HttpStatus.NOT_FOUND, message: 'Resource not found' },
};

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { code } = exception;

    const { status, message } = errorMap[code] ?? {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };

    response.status(status).json({
      statusCode: status,
      path: request.url,
      message,
      data: null,
    });
  }
}
