import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import unique_id from 'unique-id-key';
import fs from 'fs';
import express from 'express';
import https from 'https';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {version} from '../package.json'

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
  expressApp.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await expressApp.init();

  const nestApp = await NestFactory.create<NestExpressApplication>(AppModule);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('IoT server API')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(nestApp, swaggerConfig);
  SwaggerModule.setup('/api', nestApp, document);

  await nestApp.listen(config.get('HTTP_PORT'), config.get('HOSTNAME'));
  https.createServer(httpsOptions, server).listen(config.get('HTTPS_PORT'), config.get('HOSTNAME'));

  // const mqttApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.MQTT,
  //   options: {
  //     url: 'mqtt://test.mosquitto.org',
  //     clean: false,
  //     clientId: unique_id.RandomString(11, 'uppercase'),
  //     protocol: 'mqtt',
  //     port: 1883,
  //     rejectUnauthorized: false
  //   },
  // });
  //
  // await mqttApp.listen();
}

bootstrap();
