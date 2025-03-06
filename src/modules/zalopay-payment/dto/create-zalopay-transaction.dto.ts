import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateZalopayTransactionDto {
    @IsNotEmpty({ message: 'Amount is required' })
    @IsNumber({}, { message: 'Amount must be a number' })
    @Min(20000, { message: 'Amount must be at least 20,000 VND' })
    amount: number;


}