import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) { }

  @Post()
  @ResponseMessage('Station created successfully')
  create(@Body() createStationDto: CreateStationDto) {
    return this.stationsService.create(createStationDto);
  }

  @Get()
  @ResponseMessage('Stations fetched successfully')
  findAll(@Query('limit') limit: number, @Query('page') page: number) {
    return this.stationsService.findAll(limit, page);
  }

  @Get('nearest')
  @ResponseMessage('Nearest station fetched successfully')
  findNearestStation(@Query('lat') latitude: number, @Query('lon') longitude: number, @Query('radius') radius: number) {
    return this.stationsService.findNearestStation([longitude, latitude], radius);
  }

  @Get('sorted')
  @Public()
  @ResponseMessage('Stations sorted by distance fetched successfully')
  getStationsSortedByDistance(@Query('lat') latitude: number, @Query('lon') longitude: number) {
    return this.stationsService.getStationsSortedByDistance([longitude, latitude]);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ResponseMessage('Station updated successfully')
  update(@Param('id') id: string, @Body() updateStationDto: UpdateStationDto) {
    return this.stationsService.update(id, updateStationDto);
  }
}
