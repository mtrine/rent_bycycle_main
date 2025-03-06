import { Module } from '@nestjs/common';
import { ZalopayPaymentService } from './zalopay-payment.service';
import { ZalopayPaymentController } from './zalopay-payment.controller';
import { TransactionsModule } from '../transactions/transactions.module';


@Module({
  imports: [
    TransactionsModule
  ],
  controllers: [ZalopayPaymentController],
  providers: [ZalopayPaymentService],
})
export class ZalopayPaymentModule { }
