import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BikeReportService } from './bike-report.service';
import { CreateBikeReportDto } from './dto/create-bike-report.dto';
import { UpdateBikeReportDto } from './dto/update-bike-report.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { User } from 'src/decorators/user-infor.decorator';
import { UserInterface } from '../users/dto/user.interface';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('bike-report')
export class BikeReportController {
  constructor(private readonly bikeReportService: BikeReportService) { }

  @Post()
  @ResponseMessage('Create bike report successfully')
  async create(@Body() createBikeReportDto: CreateBikeReportDto, @User() user: UserInterface) {
    return await this.bikeReportService.create(createBikeReportDto, user._id);
  }

  @Get('today')
  @Roles(Role.ADMIN)
  @ResponseMessage('Get all bike report today')
  async findReportToday() {
    return await this.bikeReportService.findReportToday();
  }

  @Get('today/pending')
  @Roles(Role.ADMIN)
  @ResponseMessage('Get all bike report today with status pending')
  async findReportStatusPendingToday() {
    return await this.bikeReportService.findReportStatusPendingToday();
  }

  @Patch('fixed/:id')
  @Roles(Role.ADMIN)
  @ResponseMessage('Update status to fixed successfully')
  async updateStatusToFixed(@Param('id') id: string) {

    return await this.bikeReportService.updateStatusToFixed(id);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ResponseMessage('Get all bike report')
  async findAll() {
    return await this.bikeReportService.findAll();
  }
}
