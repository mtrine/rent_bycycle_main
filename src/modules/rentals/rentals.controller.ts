import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { User } from 'src/decorators/user-infor.decorator';
import { UserInterface } from '../users/dto/user.interface';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { ReturnBikeDto } from './dto/return-bike.dto';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) { }

  @Post()
  @ResponseMessage('Create rental successfully')
  create(@Body() createRentalDto: CreateRentalDto, @User() user: UserInterface) {
    return this.rentalsService.createRental(createRentalDto, user._id);
  }

  @Patch('/return-bike')
  @ResponseMessage('Return bike successfully')
  returnBike(@Body() dto: ReturnBikeDto, @User() user: UserInterface) {
    return this.rentalsService.returnBike(dto, user._id);
  }

  @Get('check-user')
  @ResponseMessage('User has ongoing rental')
  async checkUserRental(@User() user: UserInterface) {
    const rental = await this.rentalsService.getOngoingRental(user._id);
    if (rental) {
      return rental;
    }
    return null;
  }
}
