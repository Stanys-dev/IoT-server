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
import { join } from 'path';
import { MqttModule } from './mqtt/mqtt.module';

const envFilePath: string = getEnvPath(join(__dirname, '../common/envs'));
const configService = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    MongooseModule.forRoot(configService.get('DB_URL')),
    RecordsModule,
    MqttModule,
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
