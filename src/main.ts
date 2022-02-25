import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import express from 'express';
import http from 'http';
import https from 'https';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';

async function bootstrap() {
  const config = new ConfigService();
  const httpsOptions = {
    key: fs.readFileSync(join(__dirname, '../../secrets/key.pem')),
    cert: fs.readFileSync(join(__dirname, '../../secrets/cert.pem')),
  };

  const server = express();
  const expressApp = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );
  expressApp.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('IoT server API')
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(expressApp, swaggerConfig);
  SwaggerModule.setup('docs', expressApp, document);

  await expressApp.init();
  http
    .createServer(server)
    .listen(config.get('HTTP_PORT'), config.get('HOSTNAME'));
  https
    .createServer(httpsOptions, server)
    .listen(config.get('HTTPS_PORT'), config.get('HOSTNAME'));
}

bootstrap();
