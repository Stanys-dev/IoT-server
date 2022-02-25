import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecordsDto {
  @IsNumber()
  @ApiProperty({ type: Number, example: 212.15151, required: true })
  altitude: number;

  @IsNumber()
  @ApiProperty({ type: Number, example: 448.15151, required: true })
  latitude: number;

  @IsNumber()
  @ApiProperty({ type: Number, example: 44.15151, required: true })
  longitude: number;

  @IsNumber()
  @ApiProperty({ type: Number, example: 1645766667042, required: true })
  timestamp: number;
}
