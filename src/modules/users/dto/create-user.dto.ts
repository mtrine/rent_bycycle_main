import { IsString, IsOptional, IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  phoneNumber: string; // Số điện thoại liên kết Zalo, duy nhất

  @IsString()
  fullName: string; // Họ tên người dùng

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date; // Ngày sinh (không bắt buộc)

  @IsNotEmpty()
  @IsString()
  gender?: string; // Giới tính (không bắt buộc, có thể là 'male', 'female', 'other')

  @IsNotEmpty()
  
  password:number
}