import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';

interface EnvironmentVariables {
  TELEGRAM_TOKEN: string;
  API_URL: string;
}

@Injectable()
export class TelegamService implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async onModuleInit() {
    try {
      const data = await this.setWebhook();

      if (data.ok) {
        console.log(data.description);
      } else {
        throw Error('unknows');
      }
    } catch (e) {
      console.log('Error set webhook: ', e.message);
    }
  }

  tgToken = this.configService.get('TELEGRAM_TOKEN');
  apiUrl = this.configService.get('API_URL');

  async setWebhook() {
    const data = await lastValueFrom(
      this.httpService
        .get(
          `https://api.telegram.org/bot${this.tgToken}/setWebhook?url=${this.apiUrl}/bot/updates`,
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
          chat_id: data.chatid,
          text: data.message,
          parse_mode: 'HTML',
        };

        const response = this.sendRequest({ url: 'sendMessage', body });

        return response;
      }

      case 'sendPhoto': {
        const body = {
          chat_id: data.chatid,
          photo: data.photo,
          caption: data.caption,
          reply_markup: JSON.stringify({
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
}
