import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rental, RentalSchema } from './schemas/rental.schema';
import { BikesModule } from '../bikes/bikes.module';
import { RentalsRepository } from './rentals.repository';

@Module({
  imports: [
    BikesModule,
    MongooseModule.forFeature([
      {
        name: Rental.name,
        schema: RentalSchema
      }
    ])
  ],
  controllers: [RentalsController],
  providers: [RentalsService,RentalsRepository],
})
export class RentalsModule { }
