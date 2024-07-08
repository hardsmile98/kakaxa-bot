import { Module } from '@nestjs/common';
import { TelegamController } from './telegam.controller';
import { TelegamService } from './telegam.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TelegamController],
  providers: [TelegamService],
})
export class TelegamModule {}
