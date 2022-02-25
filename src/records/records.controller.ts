import { Body, Controller, Get, Post } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsDto } from './dtos/records.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Record } from './schemas/records.schema';

@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(private recordsService: RecordsService) {
  }

  @Post()
  @ApiBody({ type: RecordsDto })
  @ApiCreatedResponse({ type: Record })
  @ApiBadRequestResponse()
  saveRecords(@Body() record: RecordsDto) {
    return this.recordsService.saveRecords(record);
  }

  @Get('latest')
  @ApiOkResponse({ type: Record })
  getLatestRecord() {
    return this.recordsService.getLatestRecord();
  }
}
