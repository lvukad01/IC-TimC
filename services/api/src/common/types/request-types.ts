import { Request } from 'express';
import { Users } from 'generated/prisma';
import { AccessTokenPayload } from './access-token';

export interface RequestWithUser extends Request {
  user: Users;
}

export interface RequestWithJwtUser extends Request {
  user: AccessTokenPayload;
}
