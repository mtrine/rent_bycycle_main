import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtpTokenService } from './otp-token.service';
import { CreateOtpTokenDto } from './dto/create-otp-token.dto';
import { UpdateOtpTokenDto } from './dto/update-otp-token.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller('otp-token')
export class OtpTokenController {
  constructor(private readonly otpTokenService: OtpTokenService) { }

  // @Post()
  // @Public()
  // @ResponseMessage('Create OTP token')
  // create(@Body('phoneNumber') phoneNumber: string, @Body('recaptchaToken') recaptchaToken: string) {
  //   return this.otpTokenService.create(phoneNumber,recaptchaToken);
  // }

  @Post('verify')
  @Public()
  @ResponseMessage('Verify OTP token')
  verify(@Body('idToken') idToken: string) {
    return this.otpTokenService.verifyOtp(idToken);
  }
}
