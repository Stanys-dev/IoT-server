import { Module } from '@nestjs/common';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { Record, RecordSchema } from './schemas/records.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [RecordsController],
  providers: [RecordsService],
  imports: [
    MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }]),
  ],
  exports: [RecordsService],
})
export class RecordsModule {}
