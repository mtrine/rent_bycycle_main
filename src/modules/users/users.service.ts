import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './user.repository';
import { CustomException } from 'src/exception-handle/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository
  ) { }
  async findById(id: string) {
    const user = await this.usersRepository.findById(id, ['password', 'isVerified', 'role', '__v']);
    if (!user) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }

    return user;
  }

  async updateProfile(id: string, dto: UpdateUserDto) {
    const objectAfterRemove = UtilsService.removeUndefinedAndNull(dto) as UpdateUserDto;
    const userUpdate = await this.usersRepository.updateProfile(id, objectAfterRemove);
    if (!userUpdate) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }
    return userUpdate;
  }
}
