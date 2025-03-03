import { Module } from '@nestjs/common';
import { ZalopayPaymentService } from './zalopay-payment.service';
import { ZalopayPaymentController } from './zalopay-payment.controller';


@Module({
  imports: [
    // PaymentModule,
    // MailModule,
  ],
  controllers: [ZalopayPaymentController],
  providers: [ZalopayPaymentService],
})
export class ZalopayPaymentModule { }
