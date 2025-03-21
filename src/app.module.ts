import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './bot/bot.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TelegramModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}