import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegamModule } from './telegam/telegam.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegamModule,
  ],
})
export class AppModule {}
