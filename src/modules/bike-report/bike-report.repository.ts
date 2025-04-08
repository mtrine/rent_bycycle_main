import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BikeReport } from "./schemas/bike-report.schema";
import { Model } from "mongoose";
import { CreateBikeReportDto } from "./dto/create-bike-report.dto";

@Injectable()
export class BikeReportRepository {
    constructor(
        @InjectModel(BikeReport.name) private readonly bikeReportModel: Model<BikeReport>
    ) { }

    async create(dto: CreateBikeReportDto,userId:string) {
        return this.bikeReportModel.create({
            bike: dto.bike,
            location: dto.location,
            userId:userId
        });
    }

    async find(query: any, limit?: number, skip?: number) {
        if (!limit || !skip) {
            return this.bikeReportModel.find(query).lean();
        }
        return this.bikeReportModel
            .find(query)
            .limit(limit)
            .skip(skip)
            .lean();
        ;
    }

    async updateStatus(id: string, status: string) {
        return this.bikeReportModel.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );
    }
}