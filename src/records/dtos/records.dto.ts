import { IsNumber } from 'class-validator';

export class RecordsDto {
  @IsNumber()
  altitude: Number;

  @IsNumber()
  latitude: Number;

  @IsNumber()
  longitude: Number;

  @IsNumber()
  timestamp: Number;
}
