import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { Message, SendToBot } from './models';
import { commands, messages } from './constants';

interface EnvironmentVariables {
  TELEGRAM_TOKEN: string;
  API_URL: string;
}

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly tgToken: string;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {
    this.apiUrl = this.configService.get('API_URL');
    this.tgToken = this.configService.get('TELEGRAM_TOKEN');
  }

  async onModuleInit() {
    try {
      const data = await this.setWebhook();

      if (data.ok) {
        console.log(data.description);
      } else {
        throw Error('unknow error');
      }
    } catch (e) {
      console.log('Error set webhook: ', e.message);
    }
  }

  async setWebhook() {
    const data = await lastValueFrom(
      this.httpService
        .get(
          `https://api.telegram.org/bot${this.tgToken}/setWebhook?url=${this.apiUrl}/bot/telegram/updates/${this.tgToken}`,
        )
        .pipe(map((res) => res.data)),
    );

    return data;
  }

  async sendRequest({ url, body }: { url: string; body: unknown }) {
    const data = await lastValueFrom(
      this.httpService
        .post(`https://api.telegram.org/bot${this.tgToken}/${url}`, body)
        .pipe(map((res) => res.data)),
    );

    return data;
  }

  async createRequest({ action, data }) {
    switch (action) {
      case 'sendMessage': {
        const body = {
          chat_id: data.chatId,
          text: data.message,
          parse_mode: 'HTML',
          reply_markup:
            data.keyboard &&
            JSON.stringify({
              keyboard: data.keyboard,
              resize_keyboard: true,
            }),
        };

        const response = this.sendRequest({ url: 'sendMessage', body });

        return response;
      }

      case 'setMyCommands': {
        const body = {
          commands: data.commands,
        };

        const response = this.sendRequest({ url: 'setMyCommands', body });

        return response;
      }

      case 'sendPhoto': {
        const body = {
          chat_id: data.chatId,
          photo: data.photo,
          caption: data.caption,
          reply_markup:
            data.keyboard &&
            JSON.stringify({
              inline_keyboard: data.keyboard,
              resize_keyboard: true,
            }),
        };
        const response = this.sendRequest({ url: 'sendPhoto', body });

        return response;
      }

      default:
        return null;
    }
  }

  async updates(token: string, body) {
    if (token !== this.tgToken) {
      throw new BadRequestException('Error request');
    }

    try {
      if (body.message) {
        await this.processMessage(body);

        return true;
      }

      return true;
    } catch (e) {
      console.log('Error in updates: ', e.message);

      return true;
    }
  }

  async processMessage(body: Message) {
    const messageText = body.message.text;

    if (messageText === commands.start.value) {
      await this.createRequest({
        action: 'setMyCommands',
        data: {
          commands: [
            {
              command: commands.start.value,
              description: commands.start.description,
            },
          ],
        },
      });

      await this.createRequest({
        action: 'sendPhoto',
        data: {
          chatId: body.message.chat.id,
          ...messages.greetings,
        },
      });
    }
  }

  async sendToBot(token: string, body: SendToBot) {
    if (token !== this.configService.get('TELEGRAM_TOKEN')) {
      console.log(token, this.tgToken);
      throw new BadRequestException('Error request');
    }

    if (!body?.action || body?.ids?.length === 0 || !body.data) {
      throw new BadRequestException('Error request');
    }

    try {
      await Promise.all(
        body.ids.map(async (id) => {
          try {
            await this.createRequest({
              action: body.action,
              data: {
                chatId: id,
                ...body.data,
              },
            });
          } catch (e) {
            console.log(`Error send to user: ${id}, e: ${e.message}`);
          }
        }),
      );

      return true;
    } catch (e) {
      return false;
    }
  }
}
