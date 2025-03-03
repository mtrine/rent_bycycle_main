import { IsNotEmpty, IsString, IsArray, IsNumber } from 'class-validator';

export class CreateStationDto {
    // Tên trạm (VD: "Trạm Công viên Tao Đàn")
  @IsNotEmpty()
  @IsString()
  name: string;

  // Địa chỉ trạm
  @IsNotEmpty()
  @IsString()
  address: string;

  // Tọa độ được hiện thị trên Google Maps (mảng [longitude, latitude])
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  location: [number, number];
}