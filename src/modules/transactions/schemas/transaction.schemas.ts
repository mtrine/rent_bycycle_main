import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { PaymentMethod } from 'src/enums/paymentMethod.enum';
import { StatusTransaction } from 'src/enums/status-transaction.enum';
import { TypeTransaction } from 'src/enums/type-transaction.enum';
import { Rental } from 'src/modules/rentals/schemas/rental.schema';
import { User } from 'src/modules/users/schemas/user.schema';

@Schema({
    timestamps: true, // Tự động thêm createdAt và updatedAt
})
export class Transaction {

    // ID người dùng (tham chiếu đến Users)
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
    userId: Types.ObjectId;

    // Loại giao dịch: "deposit" (nạp tiền), "payment" (thanh toán)
    @Prop({
        type: String,
        enum: TypeTransaction,
        required: true,
    })
    type: string;

    // Số tiền (VND)
    @Prop({ type: Number, required: true })
    amount: number;

    // ID chuyến thuê (tham chiếu đến Rentals, nullable nếu nạp tiền)
    @Prop({ type: mongoose.Schema.Types.ObjectId, default: null, ref: Rental.name })
    rentalId: Types.ObjectId | null;

    // Phương thức: "ZaloPay"
    @Prop({
        type: String,
        enum: PaymentMethod,
        required: true,
    })
    paymentMethod: string;

    // Trạng thái: "pending", "success", "failed"
    @Prop({
        type: String,
        enum: StatusTransaction,
        required: true,
        default: StatusTransaction.PENDING,
    })
    status: string;
}

// Tạo schema factory
export const TransactionSchema = SchemaFactory.createForClass(Transaction);