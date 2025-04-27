import { Injectable } from '@nestjs/common';
import { CreateBikeReportDto } from './dto/create-bike-report.dto';
import { UpdateBikeReportDto } from './dto/update-bike-report.dto';
import { BikeReportRepository } from './bike-report.repository';
import { StatusBikeReport } from 'src/enums/status-bike-report.enum.';
import { BikesRepository } from '../bikes/bikes.repository';
import { StatusBike } from 'src/enums/status-bike.enum';
import { CustomException } from 'src/exception-handle/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';

@Injectable()
export class BikeReportService {
  constructor(
    private bikeReportRepository: BikeReportRepository,
    private bikeRepository: BikesRepository
  ) { }

  async create(createBikeReportDto: CreateBikeReportDto, userId: string) {
    const report = await this.bikeReportRepository.create(createBikeReportDto, userId);
    await this.bikeRepository.updateBike(createBikeReportDto.bike, {
      status: StatusBike.MAINTENANCE
    });
    return report;
  }

  async findReportToday(limit?: number, skip?: number) {
    return await this.bikeReportRepository.find({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    }
      , limit, skip);
  }

  async findReportStatusPendingToday(limit?: number, skip?: number) {
    return await this.bikeReportRepository.find({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      },
      status: StatusBikeReport.PENDING
    }
      , limit, skip);
  }

  async updateStatusToFixed(id: string) {
    const report = await this.bikeReportRepository.updateStatus(id, StatusBikeReport.FIXED);
    if (!report) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }
    await this.bikeRepository.updateBike(report.bike.toString(), {
      status: StatusBike.AVAILABLE
    })
    return report;
  }

  async findAll() {
    return await this.bikeReportRepository.findAll();
  }
}

