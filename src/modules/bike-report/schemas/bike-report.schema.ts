import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { StatusBikeReport } from "src/enums/status-bike-report.enum.";

@Schema({
    timestamps: true, // Tự động thêm createdAt và updatedAt
})
export class BikeReport {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true })
    bike: Types.ObjectId; // Xe bị hỏng

    @Prop({
        type: String,
        enum: StatusBikeReport,
        default: StatusBikeReport.PENDING
    })
    status: string; // Trạng thái xử lý báo cáo

    @Prop({
        type: [Number], // [longitude, latitude]
        required: true,
    })
    location: [number, number]; // Vị trí người dùng khi gửi báo cáo
}

export const BikeReportSchema = SchemaFactory.createForClass(BikeReport);