import { Body, Controller, Param, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { SendToBot } from './models';

@Controller('telegram')
export class TelegramController {
  constructor(private telegramService: TelegramService) {}

  @Post('/updates/:token')
  updates(@Body() body, @Param('token') token: string) {
    return this.telegramService.updates(token, body);
  }

  @Post('/send/:token')
  sendToBot(@Body() body: SendToBot, @Param('token') token: string) {
    return this.telegramService.sendToBot(token, body);
  }
}
