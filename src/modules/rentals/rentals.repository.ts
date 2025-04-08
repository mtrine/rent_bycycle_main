import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rental } from './schemas/rental.schema';
import { Model } from 'mongoose';
import { CreateRentalDto } from './dto/create-rental.dto';
import { start } from 'repl';
import { StatusRental } from 'src/enums/status-rental.enum';

@Injectable()
export class RentalsRepository {
  constructor(
    @InjectModel(Rental.name) private readonly rentalModel: Model<Rental>,
  ) { }

  async createRental(
    createRentalDto: CreateRentalDto,
    userId: string,
    startStationId: string,
  ) {
    const rental = await this.rentalModel.create({
      bikeId: createRentalDto.bikeId,
      userId: userId,
      startStation: startStationId,
    }) as any;

    // Cập nhật startTime = createdAt sau khi đã tạo
    rental.startTime = rental.createdAt;
    console.log(rental.startTime);
    console.log(rental.createdAt);
    await rental.save();

    return rental;
  }

  async findById(rentalId: string, userId: string) {
    return await this.rentalModel
      .findOne({
        _id: rentalId,
        userId: userId,
      });
  }

  async returnBike(rentalId: string, endStationId: string, cost: number) {
    return await this.rentalModel
      .findOneAndUpdate(
        {
          _id: rentalId,
        },
        {
          endStationId: endStationId,
          endAt: new Date(),
          cost: cost,
        },
        { new: true },
      )
      .lean();
  }

  async getOngoingRental(userId: string) {
    return await this.rentalModel.findOne({
      userId,
      status: StatusRental.ONGOING
    }).populate('bikeId', 'bikeCode _id').lean();
  }
}
