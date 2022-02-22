import { Body, Controller, Get, Post } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsDto } from './dtos/records.dto';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';

@Controller('records')
export class RecordsController {
  constructor(private recordsService: RecordsService) {}

  @Post()
  saveRecords(@Body() record: RecordsDto) {
    return this.recordsService.saveRecords(record);
  }

  @Get('latest')
  getLatestRecord() {
    return this.recordsService.getLatestRecord();
  }

  @MessagePattern()
  getNotifications(@Payload() data: number[], @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
  }
}
