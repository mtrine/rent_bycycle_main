import { Module } from '@nestjs/common';
import { BikeReportService } from './bike-report.service';
import { BikeReportController } from './bike-report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BikeReport, BikeReportSchema } from './schemas/bike-report.schema';
import { BikeReportRepository } from './bike-report.repository';
import { BikesModule } from '../bikes/bikes.module';

@Module({
  imports: [
    BikesModule,
    MongooseModule.forFeature([
      { name: BikeReport.name, schema: BikeReportSchema }
    ])
  ],
  controllers: [BikeReportController],
  providers: [BikeReportService,BikeReportRepository],
})
export class BikeReportModule {}
