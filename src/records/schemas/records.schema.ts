import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RecordDocument = Record & Document;

@Schema()
export class Record {
  @Prop({ required: true })
  @ApiProperty({ type: Number, example: 212.15151 })
  altitude: number;

  @Prop({ required: true })
  @ApiProperty({ type: Number, example: 448.15151 })
  latitude: number;

  @Prop({ required: true })
  @ApiProperty({ type: Number, example: 44.15151 })
  longitude: number;

  @Prop({ required: true, index: { background: true } })
  @ApiProperty({ type: Date, example: '2022-02-20T14:46:21.962+00:00' })
  timestamp: Date;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
