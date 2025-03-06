import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ZalopayPaymentService } from './zalopay-payment.service';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { User } from 'src/decorators/user-infor.decorator';
import { UserInterface } from '../users/dto/user.interface';
import { Public } from 'src/decorators/public.decorator';
import { CreateZalopayTransactionDto } from './dto/create-zalopay-transaction.dto';

// import { Public, ResponseMessage, Serialize } from 'src/decorators/customize';
// import { PaymentResponseDto } from '../payment/dto/payment-response.dto';

@Controller('zalopay-payment')
export class ZalopayPaymentController {
  constructor(private readonly zalopayPaymentService: ZalopayPaymentService) { }

  @Post()
  @ResponseMessage('Get url zalopay payment successfully')
  zaloPayGateway(@Body() dto: CreateZalopayTransactionDto, @User() user: UserInterface) {
    return this.zalopayPaymentService.createZaloPayPayment(dto.amount, user._id);
  }

  @Post('/callback')
  @Public()
  @ResponseMessage('Create zalopay payment successfully')
  callback(@Req() req) {
    return this.zalopayPaymentService.callBackZaloPay(req);
  }
}
