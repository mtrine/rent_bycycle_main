import { IsDateString, IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { StatusRental } from 'src/enums/status-rental.enum';

export class CreateRentalDto {
    // ID xe đạp (tham chiếu đến Bikes)
    @IsMongoId({ message: 'bikeId phải là một MongoDB ObjectId hợp lệ' })
    @IsNotEmpty({ message: 'bikeId không được để trống' })
    bikeId: string;
}