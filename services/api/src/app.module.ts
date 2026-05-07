import { ResponseInterceptor } from '@interceptors/response.interceptor';
import { LoggerMiddleware } from '@middleware/logger.middleware';
import { SecurityHeadersMiddleware } from '@middleware/security-headers-middleware';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from '@users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    UsersModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: seconds(60),
          limit: 30,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ResponseInterceptor],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, SecurityHeadersMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
