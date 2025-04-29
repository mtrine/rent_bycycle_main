import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalsRepository } from './rentals.repository';
import { BikesRepository } from '../bikes/bikes.repository';
import { UsersRepository } from '../users/user.repository';

import { CustomException } from 'src/exception-handle/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';
import { StatusBike } from 'src/enums/status-bike.enum';
import { StatusTransaction } from 'src/enums/status-transaction.enum';
import { TypeTransaction } from 'src/enums/type-transaction.enum';
import { PaymentMethod } from 'src/enums/paymentMethod.enum';
import { TransactionsRepository } from '../transactions/transactions.repository,';
import { StatusRental } from 'src/enums/status-rental.enum';
import { ReturnBikeDto } from './dto/return-bike.dto';
import { Types } from 'mongoose';
import { SerialPort } from 'serialport';
import path from 'path';

@Injectable()
export class RentalsService {
  private port: SerialPort;
  constructor(
    private readonly rentalsRepository: RentalsRepository,
    private readonly bikesRepository: BikesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly transactionsRepository: TransactionsRepository, // Thêm repository cho Transaction
  ) { }


  async createRental(createRentalDto: CreateRentalDto, userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }
    const checkRental = await this.rentalsRepository.getOngoingRental(userId);
    if (checkRental) {
      throw new CustomException(ErrorCode.RENTAL_ALREADY_EXISTS);
    }
    if (user.wallet.balance < 20000) {
      throw new CustomException(ErrorCode.NOT_ENOUGH_MONEY);
    }

    const bike = await this.bikesRepository.findById(createRentalDto.bikeId);

    if (!bike) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }

    if (bike.status !== StatusBike.AVAILABLE) {
      throw new CustomException(ErrorCode.BIKE_NOT_AVAILABLE);
    }
    const serialPort = bike.serialPort;
    await this.connectPort(serialPort, '1');
    const rental = await this.rentalsRepository.createRental(
      createRentalDto,
      userId,
      bike.currentStation.toString(),
    );

    if (rental) {
      await this.bikesRepository.updateBike(createRentalDto.bikeId, {
        status: StatusBike.INUSE,
      });
    }

    return rental;
  }

  async returnBike(dto: ReturnBikeDto, userId: string) {
    // 1. Kiểm tra rental có tồn tại và thuộc về user không
    const rental = await this.rentalsRepository.findById(dto.rentalId, userId);
    if (!rental) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }

    // Kiểm tra xem xe đã được trả chưa
    if (rental.endTime) {
      throw new CustomException(ErrorCode.BIKE_ALREADY_RETURNED);
    }

    // 2. Tính toán chi phí thuê xe
    const startTime = rental.startTime;
    const endTime = new Date();
    const rentalDurationMinutes = Math.ceil(
      (endTime.getTime() - startTime.getTime()) / (1000 * 60),
    ); // Thời gian thuê tính bằng phút

    let rentalCost = 0;
    if (rentalDurationMinutes <= 60) {
      // Dưới hoặc bằng 60 phút: 10,000 VND
      rentalCost = 10000;
    } else {
      // Trên 60 phút: 10,000 VND cho 60 phút đầu + 3,000 VND cho mỗi 15 phút tiếp theo
      const extraMinutes = rentalDurationMinutes - 60; // Phần thời gian vượt quá 60 phút
      const extra15MinuteBlocks = Math.ceil(extraMinutes / 15); // Số khối 15 phút
      rentalCost = 10000 + extra15MinuteBlocks * 3000; // Tổng chi phí
    }

    // 3. Lấy thông tin user và wallet
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }

    let { balance, debt } = user.wallet;

    // 4. Trừ tiền từ balance, nếu không đủ thì chuyển thành debt
    if (balance >= rentalCost) {
      // Trường hợp balance đủ để trả
      balance -= rentalCost;
    } else {
      // Trường hợp balance không đủ
      const remainingDebt = rentalCost - balance;
      debt += remainingDebt; // Chuyển phần thiếu thành debt
      balance = 0; // Balance về 0
    }

    // 5. Cập nhật wallet của user
    user.wallet.balance = balance;
    user.wallet.debt = debt;
    user.wallet.lastUpdated = new Date();
    await user.save(); // Lưu user, middleware pre-save sẽ tự động điều chỉnh nếu cần

    // 6. Tạo transaction để ghi lại giao dịch
    const transaction = {
      userId: userId,
      type: TypeTransaction.PAYMENT,
      amount: rentalCost,
      rentalId: dto.rentalId,
      paymentMethod: PaymentMethod.WALLET,
      status: StatusTransaction.SUCCESS,
    };
    await this.transactionsRepository.createTransaction(transaction);

    // 7. Cập nhật rental (đánh dấu xe đã được trả)
    rental.endTime = endTime;
    rental.cost = rentalCost; // Giả sử có trường totalCost trong Rental schema
    rental.endStation = new Types.ObjectId(dto.endStationId); // Giả sử có trường endStation trong Rental schema
    rental.status = StatusRental.COMPLETED;
    await rental.save();

    const bike = await this.bikesRepository.findById(rental.bikeId.toString());

    if (!bike) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }
    const serialPort = bike.serialPort;
    await this.connectPort(serialPort, '2');
    // 8. Cập nhật trạng thái xe về AVAILABLE
    await this.bikesRepository.updateBike(rental.bikeId.toString(), {
      status: StatusBike.AVAILABLE,
      currentStation: dto.endStationId,
    });

    return {
      message: 'Bike returned successfully',
      rental,
      updatedWallet: user.wallet,
    };
  }

  async getOngoingRental(userId: string) {
    return await this.rentalsRepository.getOngoingRental(userId);
  }

  async connectPort(port: string, command: string) {
    {
      try {
        if (!this.port || !this.port.isOpen) {
          console.log("Opening new Arduino connection...");
          this.port = new SerialPort({
            path: port,
            baudRate: 9600,
          });

          this.port.on("open", () => console.log("Arduino connected!"));
          this.port.on("error", (err) => console.error("Arduino error:", err));

          // Đợi 1s để chắc chắn cổng đã mở trước khi gửi lệnh
          await new Promise((resolve) => setTimeout(resolve, 1800));
        }

        this.port.write(command, (err) => {
          if (err) {
            console.error("Error sending signal:", err);
          } else {
            console.log("Signal sent successfully");
          }
        });
      } catch (error) {
        console.error("Unexpected error in Arduino communication:", error);
      }
    }
  }
}