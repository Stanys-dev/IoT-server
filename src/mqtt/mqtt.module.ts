import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { RecordsModule } from '../records/records.module';

@Module({
  controllers: [],
  providers: [MqttService],
  imports: [RecordsModule],
})
export class MqttModule {}
