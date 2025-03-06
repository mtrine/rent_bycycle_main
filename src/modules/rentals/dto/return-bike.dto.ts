import { IsMongoId } from "class-validator";

export class ReturnBikeDto {

    @IsMongoId({ message: 'rentalId phải là một MongoDB ObjectId hợp lệ' })
    rentalId: string;

    @IsMongoId({ message: 'endStationId phải là một MongoDB ObjectId hợp lệ' })
    endStationId: string;
}