import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Rental } from "./schemas/rental.schema";
import { Model } from "mongoose";
import { CreateRentalDto } from "./dto/create-rental.dto";
import { start } from "repl";

@Injectable()
export class RentalsRepository {
    constructor(
        @InjectModel(Rental.name) private readonly rentalModel: Model<Rental>
    ) { }

    async createRental(createRentalDto: CreateRentalDto, userId: string, startStationId: string) {
        return await this.rentalModel.create({
            bikeId: createRentalDto.bikeId,
            userId: userId,
            startStationId: startStationId,
        });
    }

    async findById(rentalId: string, userId: string) {
        return await this.rentalModel.findOne({
            _id: rentalId,
            userId: userId
        });
    }

    async returnBike(rentalId: string, endStationId: string, cost: number) {
        return await this.rentalModel.findOneAndUpdate({
            _id: rentalId,
        }, {
            endStationId: endStationId,
            endAt: new Date(),
            cost: cost
        }, { new: true }).lean();
    }
}