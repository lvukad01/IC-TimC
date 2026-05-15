import { Users } from '@prisma/client';
import type { Request } from 'express';
import { AccessTokenPayload } from './access-token';

export interface RequestWithUser extends Request {
  user: Users;
}

export interface RequestWithJwtUser extends Request {
  user: AccessTokenPayload;
}

export interface RequestWithOptionalUser extends Request {
  user?: AccessTokenPayload;
}
