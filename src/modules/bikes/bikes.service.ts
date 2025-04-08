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

  async getCountBikeEachSTation(userLat: number, userLon: number) {
    const listStation = await this.bikesRepository.getCountBikeEachSTation();
    return listStation
      .map(station => {
        const [lon, lat] = station.location;
        const distance = this.calculateHaversineDistance(userLat, userLon, lat, lon);
        return { ...station, distance };
      }).sort((a, b) => a.distance - b.distance);
  }

  async getBikeByQrCode(qrCode: string) {
    return await this.bikesRepository.findByQRCode(qrCode);
  }

  // // Công thức Haversine
  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Bán kính Trái Đất (km)

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Khoảng cách 
  }
}
