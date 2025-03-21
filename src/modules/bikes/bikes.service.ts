import { Injectable } from '@nestjs/common';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { BikesRepository } from './bikes.repository';

@Injectable()
export class BikesService {
  constructor(
    private readonly bikesRepository: BikesRepository
  ) { }
  async create(createBikeDto: CreateBikeDto) {
    return await this.bikesRepository.createBike(createBikeDto);
  }

  async getCountBikeEachSTation() {
    return await this.bikesRepository.getCountBikeEachSTation();
  }

  async getBikeByQrCode(qrCode: string) {
    return await this.bikesRepository.findByQRCode(qrCode);
  }
}
