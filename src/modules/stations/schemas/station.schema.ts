import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Bike } from 'src/modules/bikes/schemas/bike.schemas';

@Schema({
    timestamps: true, // Tự động thêm createdAt và updatedAt
})
export class Station {

    // Mã trạm duy nhất
    @Prop({ required: true, unique: true })
    stationCode: string;

    // Tên trạm (VD: "Trạm Công viên Tao Đàn")
    @Prop({ required: true })
    name: string;

    // Địa chỉ trạm
    @Prop({ required: true })
    address: string;

    // Tọa độ được hiện thị trên Google Maps
    @Prop({
        type: {
            type: String,
            enum: ['Point'], // Chỉ chấp nhận kiểu "Point"
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number], // Mảng [longitude, latitude]
            required: true,
        },
        _id: false, // Không tạo ID riêng cho location
    })
    location: {
        type: string;
        coordinates: [number, number];
    };

    // Số lượng xe hiện tại tại trạm
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Bike.name }], default: [] })
    bikes: Types.ObjectId[];
}

// Tạo schema factory
export const StationSchema = SchemaFactory.createForClass(Station);