import { IsMongoId, IsNotEmpty } from "class-validator";

export class ReturnBikeDto {

    @IsMongoId()
    @IsNotEmpty()
    rentalId: string;

    @IsMongoId()
    @IsNotEmpty()
    endStationId: string;
}