import { Type } from '@nestjs/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId, Types } from 'mongoose';
import { StatusBike } from 'src/enums/status-bike.enum';
import { Station } from 'src/modules/stations/schemas/station.schema';

@Schema({
    timestamps: true, // Tự động thêm createdAt và updatedAt
})
export class Bike extends Document {

    // Mã xe duy nhất (liên kết với mã QR)
    @Prop({ required: true, unique: true })
    bikeCode: string;

    // Chuỗi mã QR để quét
    @Prop({ required: true })
    qrCode: string;

    // Trạng thái: "available", "in_use", "maintenance"
    @Prop({
        type: String,
        enum: StatusBike,
        required: true,
        default: StatusBike.AVAILABLE,
    })
    status: string;

    // ID trạm hiện tại (tham chiếu đến Stations)
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Station.name, required: true })
    currentStation: Types.ObjectId;

    // Thời gian sử dụng cuối cùng
    @Prop({ type: Date, default: null })
    lastUsed: Date;
}

// Tạo schema factory
export const BikeSchema = SchemaFactory.createForClass(Bike);