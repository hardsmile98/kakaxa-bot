import { Body, Controller, Param, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private telegramService: TelegramService) {}

  @Post('/updates/:token')
  updates(@Body() body, @Param('token') token: string) {
    return this.telegramService.updates(token, body);
  }
}
