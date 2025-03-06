import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalsRepository } from './rentals.repository';
import { BikesRepository } from '../bikes/bikes.repository';
import { CustomException } from 'src/exception-handle/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';
import { StatusBike } from 'src/enums/status-bike.enum';

@Injectable()
export class RentalsService {
  constructor(
    private readonly rentalsRepository: RentalsRepository,
    private readonly bikesRepository: BikesRepository,
  ) { }

  async createRental(createRentalDto: CreateRentalDto, userId: string) {
    const bike = await this.bikesRepository.findById(createRentalDto.bikeId);

    if (!bike) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }

    const rental = await this.rentalsRepository.createRental(createRentalDto, userId, bike.currentStation.toString());

    if (rental) {
      await this.bikesRepository.updateStatus(createRentalDto.bikeId, StatusBike.INUSE);
    }
    return rental;
  }

  async returnBike(rentalId: string, userId: string) {
    
  }

}
