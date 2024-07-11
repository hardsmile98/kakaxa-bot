import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('bot');

  app.enableCors({
    origin: '*',
    methods: '*',
    credentials: true,
  });

  await app.listen(8070);
}

bootstrap();
