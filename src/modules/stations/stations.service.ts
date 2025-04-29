import { Injectable } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { StationsRepository } from './stations.repository';
import { UtilsService } from 'src/utils/utils.service';
import { CustomException } from 'src/exception-handle/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';
import * as haversine from 'haversine-distance';
@Injectable()
export class StationsService {

  constructor(
    private readonly stationsRepository: StationsRepository
  ) { }
  async create(createStationDto: CreateStationDto) {
    return await this.stationsRepository.createStation(createStationDto);
  }

  async findAll(limit: number = 10, page: number = 1) {
    const stationList = await this.stationsRepository.getAllStations(limit, (page - 1) * limit);
    return UtilsService.paginateResponse(stationList, limit, page);
  }

  async findNearestStation(userLocation: [number, number], radius: number = 40) {
    const stations = await this.stationsRepository.getAllStations(); // Lấy danh sách tất cả station

    for (const station of stations) {
      const stationLocation = station.location; // [longitude, latitude]

      // Tính khoảng cách giữa tọa độ người dùng và station bằng Haversine
      const distance = this.haversine(
        userLocation[1], userLocation[0],  // latitude, longitude của user
        stationLocation[1], stationLocation[0]  // latitude, longitude của station
      );
      if (distance <= radius) {
        return station; // Trả về station nếu trong bán kính 3m
      }
    }

    throw new CustomException(ErrorCode.NOT_STAY_AT_STATION);
  }

  async getStationsSortedByDistance(userLocation: [number, number]) {
    return this.stationsRepository.getStationsSortedByDistance(userLocation);
  }

  async update(id: string, updateStationDto: UpdateStationDto) {
    const station = await this.stationsRepository.updateStation(id, updateStationDto);
    if (!station) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }
    return station;
  }
  
  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Bán kính Trái Đất (mét)
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) ** 2 +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
