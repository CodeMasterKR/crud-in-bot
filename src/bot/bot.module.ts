import { Module } from '@nestjs/common';
import { TelegramService } from './bot.service';
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule], 
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}