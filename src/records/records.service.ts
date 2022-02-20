import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Record, RecordDocument } from './schemas/records.schema';
import { Model } from 'mongoose';
import { RecordsDto } from './dtos/records.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name) private recordModel: Model<RecordDocument>,
  ) {}

  async saveRecords(recordDto: RecordsDto) {
    const record = new this.recordModel(recordDto);

    return record.save();
  }

  async getLatestRecord() {
    return this.recordModel
      .findOne({}, {}, { lean: true })
      .sort({ timestamp: -1 });
  }
}
