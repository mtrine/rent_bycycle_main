import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusBike } from 'src/enums/status-bike.enum';

export class CreateBikeDto {
  @IsString()
  currentStation?: string;

  @IsOptional()
  @IsString()
  serialPort?: string;
}