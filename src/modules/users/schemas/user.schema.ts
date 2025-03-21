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

  //   @Prop({
  //     type: {
  //       balance: { type: Number, default: 0, min: 0 }, // Không cho phép số dư âm
  //       debt: { type: Number, default: 0, min: 0 },
  //       lastUpdated: { type: Date, default: Date.now }, // Thời gian cập nhật số dư cuối cùng
  //     },
  //     default: { balance: 0, debt: 0, lastUpdated: Date.now },
  //   })
  //   wallet: {
  //     balance: number;
  //     debt: number;
  //     lastUpdated: Date;
  //   };

  @Prop({
    type: {
      balance: { type: Number, default: 0, min: 0 }, // Không cho phép số dư âm
      debt: { type: Number, default: 0, min: 0 },
      lastUpdated: { type: Date, default: () => Date.now() }, // Gọi Date.now() để lấy giá trị thời gian hiện tại
    },
    default: { balance: 0, debt: 0, lastUpdated: Date.now() }, // Gọi Date.now() ở đây cũng cần sửa
  })
  wallet: {
    balance: number;
    debt: number;
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

UserSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as any;

  // Kiểm tra nếu có thay đổi trong wallet
  if (update.$inc && update.$inc['wallet.balance']) {
    const amount = update.$inc['wallet.balance'];

    // Lấy document hiện tại để xử lý
    this.model
      .findOne(this.getQuery())
      .then((user) => {
        if (!user || !user.wallet) return next();

        let { balance, debt } = user.wallet;
        balance += amount; // Cập nhật balance với amount mới

        // Logic xử lý balance và debt
        if (debt > 0 && balance > 0) {
          if (balance >= debt) {
            balance -= debt;
            debt = 0;
          } else {
            debt -= balance;
            balance = 0;
          }
        }

        // Đảm bảo balance và debt không âm
        balance = Math.max(0, balance);
        debt = Math.max(0, debt);

        // Ghi đè giá trị mới vào update
        update.$set = {
          ...update.$set,
          'wallet.balance': balance,
          'wallet.debt': debt,
          'wallet.lastUpdated': new Date(),
        };

        // Xóa $inc để tránh tăng dư
        delete update.$inc['wallet.balance'];

        this.setUpdate(update);
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

// Giữ nguyên middleware pre('save') nếu cần cho các trường hợp khác
UserSchema.pre('save', function (next) {
  const user = this;

  if (user.wallet) {
    let { balance, debt } = user.wallet;

    if (debt > 0 && balance > 0) {
      if (balance >= debt) {
        balance -= debt;
        debt = 0;
      } else {
        debt -= balance;
        balance = 0;
      }

      user.wallet.balance = balance;
      user.wallet.debt = debt;
      user.wallet.lastUpdated = new Date();
    }
  }

  next();
});
