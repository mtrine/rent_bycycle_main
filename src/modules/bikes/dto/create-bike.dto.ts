import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusBike } from 'src/enums/status-bike.enum';

export class CreateBikeDto {

 
  // ID trạm hiện tại (tham chiếu đến Stations), tùy chọn khi tạo
  @IsOptional()
  @Type(() => String)
  @IsString()
  currentStation?: string;
}