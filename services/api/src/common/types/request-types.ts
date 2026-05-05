import { User } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenPayload } from './access-token';

export interface RequestWithUser extends Request {
  user: User;
}

export interface RequestWithJwtUser extends Request {
  user: AccessTokenPayload;
}
