import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RecordsModule } from './records/records.module';
import { getEnvPath } from './common/helpers/env.helper';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BufferDecoderMiddleware } from './common/middlewares/bufferDecoder.middleware';
import { ClientsModule, Transport } from '@nestjs/microservices';
import unique_id from 'unique-id-key'
import {join} from 'path'

const envFilePath: string = getEnvPath(join(__dirname, '../common/envs'));
const configService = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    // ClientsModule.register([
    //   {
    //     name: 'Device',
    //     transport: Transport.MQTT,
    //     options: {
    //       url:  'mqtt://test.mosquitto.org',
    //       clean:false,
    //       clientId: unique_id.RandomString(11, 'uppercase'),
    //       protocol: 'mqtt',
    //       port:1883,
    //       rejectUnauthorized:false
    //     },
    //   },
    // ]),
    MongooseModule.forRoot(configService.get('DB_URL')),
    RecordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BufferDecoderMiddleware)
      .forRoutes({ path: 'records', method: RequestMethod.POST });
  }
}
