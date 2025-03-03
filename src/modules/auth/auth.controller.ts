import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/decorators/user-infor.decorator';
import { Public } from 'src/decorators/public.decorator';
import { Request, Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from 'src/guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Public()
  async login(@User() user, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(user, res);
  }

  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(createUserDto, res);
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    return this.authService.handleRefreshToken(refreshToken, res);
  }
}
