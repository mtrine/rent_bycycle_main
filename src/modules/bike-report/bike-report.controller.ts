import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BikeReportService } from './bike-report.service';
import { CreateBikeReportDto } from './dto/create-bike-report.dto';
import { UpdateBikeReportDto } from './dto/update-bike-report.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('bike-report')
export class BikeReportController {
  constructor(private readonly bikeReportService: BikeReportService) { }

  @Post()
  @ResponseMessage('Create bike report successfully')
  async create(@Body() createBikeReportDto: CreateBikeReportDto) {
    return await this.bikeReportService.create(createBikeReportDto);
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
