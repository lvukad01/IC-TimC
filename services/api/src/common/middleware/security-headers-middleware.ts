import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const contentType = req.headers['content-type'];

    const userAgent = req.headers['user-agent'];

    const allowedContentTypes = ['application/json'];

    if (contentType && !allowedContentTypes.some((type) => contentType.startsWith(type)))
      throw new BadRequestException('Content-Type must be application/json');

    if (!userAgent || userAgent.length < 5)
      throw new BadRequestException('Missing or invalid User-Agent header');

    const allowedUserAgents = [/Mozilla/i, /Postman/i];
    if (!allowedUserAgents.some((regex) => regex.test(userAgent)))
      throw new BadRequestException(`Blocked User-Agent: ${userAgent}`);

    next();
  }
}
