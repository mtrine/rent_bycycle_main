import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/enums/role.enum';


@Schema({
    timestamps: true, // Tự động thêm createdAt và updatedAt
})
export class User {
    @Prop({ type: String, required: true, unique: true }) // Số điện thoại liên kết Zalo, duy nhất
    phoneNumber: string;

    @Prop({ type: String, required: true }) // Họ tên người dùng
    fullName: string;

    @Prop({ type: Date }) // Ngày sinh
    dateOfBirth: Date;

    @Prop({
        type: String,
        enum: ['male', 'female', 'other'], // Giới tính, chỉ cho phép các giá trị cụ thể
        default: 'other', // Giá trị mặc định
    })
    gender: string;

    @Prop({
        type: {
            balance: { type: Number, default: 0 }, // Số dư ví (VND)
            lastUpdated: { type: Date, default: Date.now }, // Thời gian cập nhật số dư cuối cùng
        },
    })
    wallet: {
        balance: number;
        lastUpdated: Date;
    };

    @Prop({
        type: String,
        required: true,
    })
    password: string;

    @Prop({ type: Boolean, default: false }) // Trạng thái xác thực OTP qua Zalo
    isVerified: boolean;

    @Prop({
        type: String,
        enum: Role, // Vai trò của người dùng
        default: Role.USER, //
    })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);