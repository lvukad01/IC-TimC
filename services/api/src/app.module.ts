import { AuthModule } from '@auth/auth.module';
import configuration from '@config/configuration';
import { GeocodingModule } from '@geocoding/geocoding.module';
import { UserThrottlerGuard } from '@guards/user-throttler.guard';
import { ResponseInterceptor } from '@interceptors/response.interceptor';
import { MailsService } from '@mails/mails.service';
import { LoggerMiddleware } from '@middleware/logger.middleware';
import { SecurityHeadersMiddleware } from '@middleware/security-headers-middleware';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '@prisma/prisma.module';
import { S3Module } from '@s3/s3.module';
import { SalonsModule } from '@salons/salons.module';
import { UsersModule } from '@users/users.module';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './modules/employees/employees.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { FilesController } from './modules/files/files.controller';
import { FilesModule } from './modules/files/files.module';
import { FilesService } from './modules/files/files.service';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PaymentsService } from './modules/payments/payments.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: seconds(60),
          limit: 30,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['services/api/.env', '.env'],
    }),
    GeocodingModule,
    PaymentsModule,
    FilesModule,
    S3Module,
    FavoritesModule,
    NotificationsModule,
    EmployeesModule,
    SalonsModule,
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'web', 'dist'),
    }),
  ],
  controllers: [AppController, FilesController],
  providers: [
    ResponseInterceptor,
    PaymentsService,
    FilesService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: UserThrottlerGuard,
    },
    MailsService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, SecurityHeadersMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
