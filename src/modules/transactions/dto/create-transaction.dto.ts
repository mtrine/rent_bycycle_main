import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from 'src/enums/paymentMethod.enum';
import { StatusTransaction } from 'src/enums/status-transaction.enum';
import { TypeTransaction } from 'src/enums/type-transaction.enum';


export class CreateTransactionDto {
    @IsNotEmpty({ message: 'User ID is required' })
    @IsString({ message: 'User ID must be a string' })
    userId: string;

    @IsNotEmpty({ message: 'Transaction type is required' })
    @IsEnum(TypeTransaction, { message: 'Invalid transaction type' })
    type: string;

    @IsNotEmpty({ message: 'Amount is required' })
    @IsNumber({}, { message: 'Amount must be a number' })
    amount: number;

    @IsOptional()
    @IsString({ message: 'Rental ID must be a string' })
    rentalId?: string | null;

    @IsNotEmpty({ message: 'Payment method is required' })
    @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
    paymentMethod: string;

    @IsOptional()
    status?: StatusTransaction;

}