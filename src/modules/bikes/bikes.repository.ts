import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Bike } from "./schemas/bike.schemas";
import { Model } from "mongoose";
import { CreateBikeDto } from "./dto/create-bike.dto";
import * as path from "path";
import * as QRCode from 'qrcode'; // Import thư viện qrcode
import * as fs from 'fs';
@Injectable()
export class BikesRepository {
    constructor(
        @InjectModel(Bike.name) private bikeModel: Model<Bike>
    ) { }

    async createBike(dto: CreateBikeDto) {
        const count = await this.bikeModel.countDocuments();
        const bikeCode = `B${String(count + 1).padStart(3, '0')}`;
        // Tự động sinh qrCode dựa trên bikeCode
        const qrCode = `QR-${bikeCode}`; // Ví dụ: QR-B001
        const publicDir = path.resolve(__dirname, '..', '..', '..', 'public'); // Nhảy lên gốc dự án
        const qrImagePath = path.join(publicDir, 'qrcodes', `${qrCode}.png`);
        // console.log(qrImagePath);
        await this.generateQRCode(qrCode, qrImagePath);

        return this.bikeModel.create({
            bikeCode,
            qrCode,
            currentStation: dto.currentStation,
            serialPort: dto.serialPort,
            lastUsed: new Date(),
        });


    }

    private async generateQRCode(text: string, filePath: string): Promise<void> {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
        }
        await QRCode.toFile(filePath, text, {
            color: {
                dark: '#000000', // Màu đen cho mã QR
                light: '#FFFFFF', // Màu nền trắng
            },
            width: 200, // Kích thước hình ảnh
        });
    }


    async getCountBikeEachSTation() {
        return this.bikeModel.db.collection('stations').aggregate([
            {
                // Bắt đầu từ collection stations
                $project: {
                    _id: 1, // Giữ lại _id của station
                    name: 1,// Nếu bạn muốn thêm thông tin khác của station, ví dụ: name
                    location: 1
                }
            },
            {
                $lookup: {
                    from: 'bikes', // Liên kết với collection bikes
                    localField: '_id', // Trường _id trong stations
                    foreignField: 'currentStation', // Trường currentStation trong bikes
                    as: 'bikes' // Mảng chứa các xe tại trạm
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1, // Nếu bạn giữ lại name hoặc các trường khác
                    location: 1,
                    count: { $size: '$bikes' } // Đếm số lượng xe trong mảng bikes
                }
            }
        ]).toArray(); // Chuyển kết quả thành mảng
    }
    async findById(id: string) {
        return this.bikeModel.findById(id).lean();
    }

    async updateBike(id: string, query: any) {
        return this.bikeModel.updateOne({ _id: id }, query);
    }

    async findByQRCode(qrCode: string) {
        return this.bikeModel.findOne({ qrCode })
        .populate('currentStation','name _id')
        .lean();
    }
}