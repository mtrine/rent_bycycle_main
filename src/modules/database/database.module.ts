import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Station, StationSchema } from '../stations/schemas/station.schema';
import { StationsModule } from '../stations/stations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name:Station.name,
        schema:StationSchema
      }
    ])
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
