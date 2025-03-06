import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { StatusRental } from 'src/enums/status-rental.enum';
import { Bike } from 'src/modules/bikes/schemas/bike.schemas';
import { Station } from 'src/modules/stations/schemas/station.schema';
import { User } from 'src/modules/users/schemas/user.schema';


@Schema({
    timestamps: true, // Tự động thêm createdAt và updatedAt
})
export class Rental {
    // ID người dùng (tham chiếu đến Users)
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
    userId: Types.ObjectId;

    // ID xe đạp (tham chiếu đến Bikes)
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: Bike.name })
    bikeId: Types.ObjectId;

    // ID trạm bắt đầu (tham chiếu đến Stations)
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: Station.name })
    startStation: Types.ObjectId;

    // ID trạm kết thúc (tham chiếu đến Stations, nullable nếu chưa kết thúc)
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Station.name, default: null })
    endStation: Types.ObjectId | null;

    // Thời gian bắt đầu thuê
    @Prop({ type: Date, default: new Date() })
    startTime: Date;

    // Thời gian trả xe (nullable nếu chưa trả)
    @Prop({ type: Date, default: null })
    endTime: Date | null;

    // Chi phí chuyến (tiền kết thúc)
    @Prop({ type: Number, default: 0 })
    cost: number;

    // Trạng thái: "ongoing", "completed", "canceled"
    @Prop({
        type: String,
        enum: StatusRental,
        required: true,
        default: StatusRental.ONGOING,
    })
    status: string;
}

// Tạo schema factory
export const RentalSchema = SchemaFactory.createForClass(Rental);

// Thêm index cho userId, bikeId, và startTime
RentalSchema.index({ userId: 1, bikeId: 1, startTime: 1 });