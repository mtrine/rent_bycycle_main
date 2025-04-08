import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BikeReportService } from './bike-report.service';
import { CreateBikeReportDto } from './dto/create-bike-report.dto';
import { UpdateBikeReportDto } from './dto/update-bike-report.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { User } from 'src/decorators/user-infor.decorator';
import { UserInterface } from '../users/dto/user.interface';

@Controller('bike-report')
export class BikeReportController {
  constructor(private readonly bikeReportService: BikeReportService) { }

  @Post()
  @ResponseMessage('Create bike report successfully')
  async create(@Body() createBikeReportDto: CreateBikeReportDto, @User() user: UserInterface) {
    return await this.bikeReportService.create(createBikeReportDto, user._id);
  }

  @Get('today')
  @ResponseMessage('Get all bike report today')
  async findReportToday() {
    return await this.bikeReportService.findReportToday();
  }

  @Get('today/pending')
  @ResponseMessage('Get all bike report today with status pending')
  async findReportStatusPendingToday() {
    return await this.bikeReportService.findReportStatusPendingToday();
  }

  @Patch('fixed/:id')
  @ResponseMessage('Update status to fixed successfully')
  async updateStatusToFixed(@Param('id') id: string) {

    return await this.bikeReportService.updateStatusToFixed(id);
  }
}
