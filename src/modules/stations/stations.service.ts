import { Injectable } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { StationsRepository } from './stations.repository';
import { UtilsService } from 'src/utils/utils.service';

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

}
