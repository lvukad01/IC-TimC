import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalTokenGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    try {
      await super.canActivate(context);
    } catch (err) {
      if (err.name !== 'UnauthorizedError') throw err;
    } finally {
      return true;
    }
  }
}
