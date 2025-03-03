import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Station } from "./schemas/station.schema";
import { Model } from "mongoose";
import { CreateStationDto } from "./dto/create-station.dto";

@Injectable()
export class StationsRepository {
    constructor(
        @InjectModel(Station.name) private stationModel: Model<Station>
    ) {}

    async createStation(dto:CreateStationDto) {
        return this.stationModel.create({
            name: dto.name,
            address: dto.address,
            location: dto.location
        });
    }

    async getAllStations(limit:number, skip:number) {
        return this.stationModel.find().limit(limit).skip(skip).lean();
    }

}