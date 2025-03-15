import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Station } from "./schemas/station.schema";
import { Model } from "mongoose";
import { CreateStationDto } from "./dto/create-station.dto";

@Injectable()
export class StationsRepository {
    constructor(
        @InjectModel(Station.name) private stationModel: Model<Station>
    ) { }

    async createStation(dto: CreateStationDto) {
        return this.stationModel.create({
            name: dto.name,
            address: dto.address,
            location: dto.location
        });
    }

    async getAllStations(limit?: number, skip?: number) {
        if (!limit||!skip) {
            return this.stationModel.find().lean();
        }
        return this.stationModel.find().limit(limit).skip(skip).lean();
    }

    async getAllStationsWithoutPagination() {
        return await this.stationModel.find().exec();
    }

    async getStationsSortedByDistance(userLocation: [number, number]) {
        const stations = await this.stationModel.find().lean(); // Lấy tất cả trạm
        const [userLon, userLat] = userLocation;
    
        return stations
            .map(station => {
                const [lon, lat] = station.location;
                const distance = this.calculateHaversineDistance(userLat, userLon, lat, lon);
                return { ...station, distance };
            })
            .sort((a, b) => a.distance - b.distance); // Sắp xếp theo khoảng cách
    }
    
    // Công thức Haversine
    private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const toRad = (x: number) => (x * Math.PI) / 180;
        const R = 6371; // Bán kính Trái Đất (km)
    
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
    
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Khoảng cách (km)
    }
    
}