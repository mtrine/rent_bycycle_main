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

  async findNearestStation(userLocation: [number, number], radius: number = 2) {
    const stations = await this.stationsRepository.getAllStations(); // Lấy danh sách tất cả station

    for (const station of stations) {
      const stationLocation = station.location; // [longitude, latitude]

      // Tính khoảng cách giữa tọa độ người dùng và station bằng Haversine
      const distance = haversine(
        { latitude: userLocation[1], longitude: userLocation[0] },
        { latitude: stationLocation[1], longitude: stationLocation[0] }
      );

      if (distance <= radius) {
        return station; // Trả về station nếu trong bán kính
      }
    }

    throw new CustomException(ErrorCode.NOT_STAY_AT_STATION);
  }
}
