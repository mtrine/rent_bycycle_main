import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Post()
  @ResponseMessage('Create bike')
  create(@Body() createBikeDto: CreateBikeDto) {
    return this.bikesService.create(createBikeDto);
  }

  @Get('count')
  @ResponseMessage('Get count bike each station')
  getCountBikeEachSTation(@Query('lat') lat: number, @Query('lon') lon: number) {
    return this.bikesService.getCountBikeEachSTation(lat, lon);
  }

  @Get('qr-code/:qrCode')
  @ResponseMessage('Get bike by qr code')
  getBikeByQrCode(@Param('qrCode') qrCode: string) {
    return this.bikesService.getBikeByQrCode(qrCode);
  }
}
