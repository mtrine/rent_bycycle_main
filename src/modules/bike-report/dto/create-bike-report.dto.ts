import { IsArray, IsMongoId, IsNotEmpty, IsNumber } from "class-validator";

export class CreateBikeReportDto {
    @IsMongoId()
    @IsNotEmpty()
    bike: string;

    @IsArray()
    @IsNumber({}, { each: true })
    location: [number, number]; // [longitude, latitude]
}