import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecordDocument = Record & Document;

@Schema()
export class Record {
  @Prop({ required: true })
  altitude: number;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true, index: { background: true } })
  timestamp: Date;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
