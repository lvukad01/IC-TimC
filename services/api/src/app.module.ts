import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { SalonsModule } from './modules/salons/salons.module';
import { AuthModule } from '@auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, SalonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
