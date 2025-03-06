import { Module } from '@nestjs/common';
import { PrintService } from './print.service';
import { PrintController } from './print.controller';
import { BikesModule } from '../bikes/bikes.module';

@Module({
  imports: [
    BikesModule,
  ],
  controllers: [PrintController],
  providers: [PrintService],
})
export class PrintModule {}
