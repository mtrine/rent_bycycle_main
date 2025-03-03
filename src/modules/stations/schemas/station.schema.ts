import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
// Loại bỏ import Bike để tránh vòng lặp, dùng chuỗi 'Bike' thay vì Bike.name
@Schema({
  timestamps: true,
})
export class Station {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({
    type: [Number],
    required: true,
  })
  location: [number, number];
}

export const StationSchema = SchemaFactory.createForClass(Station);