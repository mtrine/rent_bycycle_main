import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { User } from 'src/decorators/user-infor.decorator';
import { UserInterface } from '../users/dto/user.interface';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @ResponseMessage('Create rental successfully')
  create(@Body() createRentalDto: CreateRentalDto,@User() user:UserInterface) {
    return this.rentalsService.createRental(createRentalDto,user._id);
  }

  @Patch(':id')
  @ResponseMessage('Return bike successfully')
  returnBike(@Param('id') id: string,@User() user:UserInterface) {
    return this.rentalsService.returnBike(id,user._id);
  }
}
