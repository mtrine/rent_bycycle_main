import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/decorators/user-infor.decorator';
import { UserInterface } from './dto/user.interface';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-my-info')
  @ResponseMessage('Get my info successfully')
  getMyInfo(@User() user: UserInterface) {
    return this.usersService.findById(user._id);
  }
}
