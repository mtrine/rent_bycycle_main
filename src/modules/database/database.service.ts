import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Station } from '../stations/schemas/station.schema';
import { Model } from 'mongoose';
import { INIT_STATION } from './sample';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private readonly logger = new Logger(DatabaseService.name);
    constructor(
        @InjectModel(Station.name) private stationModel: Model<Station>) { }
    async onModuleInit() {
        const countStations = await this.stationModel.countDocuments();
        if (countStations === 0) {
            await this.stationModel.insertMany(INIT_STATION)
        }

        if (countStations > 0) {
            this.logger.log('>>> ALREADY INIT SAMPLE DATA...');
        }
    }


}
